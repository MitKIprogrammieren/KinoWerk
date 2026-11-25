"""Synology-Video-Station-Infos (.vsmeta neben der Videodatei) lesen und übernehmen.
Aufbau (Protobuf): 2 Titel, 3 Originaltitel, 4 Untertitel, 5 Jahr, 6 Datum, 8 Inhalt, 10 {1 Darsteller, 2 Regie,
3 Genre, 4 Drehbuch}, 11 Altersfreigabe, 12 Bewertung, 17 Cover (Base64), 21 {1 Hintergrundbild (Base64)}."""
import base64
import hashlib
import json
import logging
import os
import re

from . import db

log = logging.getLogger("mediathek.vsmeta")
IMG_EXT = (".jpg", ".jpeg", ".png")


def _varint(d, i):
    r = s = 0
    while True:
        b = d[i]
        i += 1
        r |= (b & 0x7F) << s
        s += 7
        if b < 0x80:
            return r, i


def _fields(d):
    i, out = 0, []
    while i < len(d):
        key, i = _varint(d, i)
        f, w = key >> 3, key & 7
        if w == 0:
            v, i = _varint(d, i)
        elif w == 2:
            n, i = _varint(d, i)
            v = d[i:i + n]
            i += n
        elif w == 1:
            v, i = d[i:i + 8], i + 8
        elif w == 5:
            v, i = d[i:i + 4], i + 4
        else:
            raise ValueError("unbekanntes Format")
        out.append((f, v))
    return out


def _txt(v):
    try:
        return v.decode("utf-8").strip()
    except Exception:
        return ""


def _img(v):
    try:
        data = base64.b64decode(re.sub(rb"\s+", b"", v))
        return data if data[:3] == b"\xff\xd8\xff" or data[:8] == b"\x89PNG\r\n\x1a\n" else None
    except Exception:
        return None


def find(video_path):
    p = video_path + ".vsmeta"
    return p if os.path.isfile(p) else None


def side_image(video_path):
    """Cover mit gleichem Namen wie das Video (z. B. Film.jpg zu Film.mp4)."""
    stem = os.path.splitext(video_path)[0]
    for ext in IMG_EXT + tuple(e.upper() for e in IMG_EXT):
        if os.path.isfile(stem + ext):
            return stem + ext
    return None


def read(video_path):
    """Infos zu einem Video – aus .vsmeta und/oder gleichnamigem Bild. None, wenn es nichts gibt."""
    out = {}
    p = find(video_path)
    if p:
        try:
            with open(p, "rb") as f:
                d = f.read()
            for f_, v in _fields(d):
                if f_ == 2:
                    out["title"] = _txt(v)
                elif f_ == 3:
                    out["orig_title"] = _txt(v)
                elif f_ == 4:
                    out["tagline"] = _txt(v)
                elif f_ == 5 and isinstance(v, int) and 1880 < v < 2100:
                    out["year"] = v
                elif f_ == 6 and not out.get("year"):
                    m = re.match(r"(\d{4})", _txt(v))
                    if m:
                        out["year"] = int(m.group(1))
                elif f_ == 8:
                    out["overview"] = _txt(v)
                elif f_ == 10 and isinstance(v, bytes):
                    for g, x in _fields(v):
                        key = {1: "cast", 2: "director", 3: "genres", 4: "writer"}.get(g)
                        if key and _txt(x):
                            out.setdefault(key, []).append(_txt(x))
                elif f_ == 11:
                    m = re.search(r"(\d+)", _txt(v))
                    if m and int(m.group(1)) in (0, 6, 12, 16, 18):
                        out["fsk"] = int(m.group(1))
                elif f_ == 17 and isinstance(v, bytes):
                    out["poster"] = _img(v)
                elif f_ == 21 and isinstance(v, bytes):
                    for g, x in _fields(v):
                        if g == 1 and isinstance(x, bytes):
                            out["backdrop"] = _img(x)
        except Exception as e:
            log.warning("vsmeta %s nicht lesbar: %s", p, e)
    if not out.get("poster"):
        si = side_image(video_path)
        if si:
            try:
                with open(si, "rb") as f:
                    out["poster"] = f.read()
            except OSError:
                pass
    if not out.get("title") and not out.get("poster"):
        return None
    if out.get("overview", "").lower() in ("null", "none"):
        out["overview"] = ""
    return out


def save_image(data, prefix):
    if not data:
        return None
    ext = ".png" if data[:4] == b"\x89PNG" else ".jpg"
    name = f"{prefix}_{hashlib.sha1(data).hexdigest()[:16]}{ext}"
    dest = os.path.join(db.DATA_DIR, "images", name)
    if not os.path.exists(dest):
        with open(dest, "wb") as f:
            f.write(data)
    return name


def form_data(item_id):
    """Fürs Bearbeiten-Fenster (wie die anderen Quellen)."""
    it = db.q1("SELECT path FROM items WHERE id=?", (item_id,))
    m = read(it["path"]) if it else None
    if not m:
        raise RuntimeError("Keine Video-Station-Infos zu dieser Datei")
    return {"title": m.get("title") or "", "year": m.get("year"), "overview": m.get("overview") or "",
            "fsk": m.get("fsk"), "genres": m.get("genres") or [], "director": m.get("director") or [],
            "cast": [{"name": n, "role": ""} for n in m.get("cast") or []],
            "poster_url": f"/api/admin/vsmeta_poster/{item_id}" if m.get("poster") else None,
            "source": "Video Station"}


def apply(item, store_links=None):
    """Infos automatisch übernehmen (wenn TheMovieDB nichts gefunden hat). True, wenn etwas übernommen wurde."""
    m = read(item["path"])
    if not m or not m.get("title"):
        return False
    poster = save_image(m.get("poster"), "vs")
    backdrop = save_image(m.get("backdrop"), "vsb")
    cast = [{"id": None, "name": n, "role": "", "img": None} for n in m.get("cast") or []]
    db.run("UPDATE items SET title=?, sort_title=?, year=COALESCE(?, year), overview=COALESCE(NULLIF(?, ''), overview), "
           "fsk=COALESCE(?, fsk), genres=?, cast=?, poster=COALESCE(?, poster), backdrop=COALESCE(?, backdrop), "
           "meta_done=1, details_done=1, meta_src='vsmeta' WHERE id=?",
           (m["title"], m["title"].lower(), m.get("year"), m.get("overview") or "", m.get("fsk"),
            json.dumps(m.get("genres") or [], ensure_ascii=False),
            json.dumps({"cast": cast, "director": m.get("director") or []}, ensure_ascii=False),
            poster, backdrop, item["id"]))
    if store_links:
        store_links("item", item["id"], cast, m.get("genres") or [], [], [])
    return True

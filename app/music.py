"""Musik (MP3-Ordner mit eingebettetem Cover) und Internetradio."""
import hashlib
import json
import logging
import os
import re
import subprocess
import time

import httpx

from . import db

log = logging.getLogger("mediathek.music")

TRASH = "_Papierkorb"
AUDIO_EXT = {".mp3", ".m4a", ".aac", ".flac", ".ogg", ".oga", ".opus", ".wav", ".wma"}
COVER_NAMES = ("cover", "folder", "front", "album", "albumart", "albumartsmall")
SKIP = {"@eaDir", "#recycle", "#snapshot", "_Papierkorb", "_Mediathek-Sicherung"}


def _roots(lib):
    r = [x["path"] for x in db.q("SELECT path FROM library_paths WHERE library_id=? ORDER BY id", (lib["id"],))]
    return r or ([lib["path"]] if lib.get("path") else [])


def _probe(path):
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", path],
                             capture_output=True, text=True, timeout=30).stdout
        return json.loads(out or "{}")
    except Exception:
        return {}


def _num(v):
    m = re.match(r"\s*(\d+)", str(v or ""))
    return int(m.group(1)) if m else None


def fix_text(v):
    """Kaputte Umlaute reparieren: UTF-8, das als Latin-1 gelesen wurde (z. B. „Ã¼ber“ → „über“)."""
    if not v or not isinstance(v, str) or not re.search("[ÃÂ][\x80-\xbf\u0100-\u024f\u2018-\u203a€]", v):
        return v
    try:
        fixed = v.encode("cp1252", errors="strict").decode("utf-8")
    except Exception:
        try:
            fixed = v.encode("latin-1").decode("utf-8")
        except Exception:
            return v
    return fixed


def repair_texts(lib_id):
    c = db.conn()
    n = 0
    for r in db.q("SELECT id,title,artist,album,album_artist,genre FROM tracks WHERE library_id=?", (lib_id,)):
        new = {k: fix_text(r[k]) for k in ("title", "artist", "album", "album_artist", "genre")}
        if any(new[k] != r[k] for k in new):
            c.execute("UPDATE tracks SET title=?,artist=?,album=?,album_artist=?,genre=? WHERE id=?",
                      (new["title"], new["artist"], new["album"], new["album_artist"], new["genre"], r["id"]))
            n += 1
    c.commit()
    return n


# ---------------------------------------------------------------- Genres vereinheitlichen, Arten

CATS = ["Musik", "Hörbuch", "Hörspiel", "Comedy", "Kinder", "Podcast"]

# Schlüssel = vereinfachte Schreibweise (klein, ohne Umlaute/Sonderzeichen) → (Anzeigename, Art)
_GENRE_MAP = {}
for _canon, _cat, _keys in [
    ("Hörbuch", "Hörbuch", "hoerbuch hoerbuecher hoerbuchs horbuch horbucher audiobook audiobooks audiobuch lesung lesungen "
                           "gelesen spokenword spoken speech sprache roman krimi thriller fantasy sachbuch biografie"),
    ("Hörspiel", "Hörspiel", "hoerspiel hoerspiele horspiel horspiele radiohoerspiel radioplay audiodrama"),
    ("Comedy", "Comedy", "comedy comedie kabarett cabaret humor humour satire standup standupcomedy witze lustig"),
    ("Kinder", "Kinder", "kinder kindermusik kinderlieder kinderlied kinderhoerspiel kinderhoerbuch children childrens "
                         "childrensmusic kids kindergarten"),
    ("Podcast", "Podcast", "podcast podcasts"),
    ("Schlager", "Musik", "schlager deutscherschlager schlagermusik"),
    ("Volksmusik", "Musik", "volksmusik volkstuemlich volkstuemlichemusik folkmusik"),
    ("A cappella", "Musik", "acappella cappella"),
    ("Hip-Hop", "Musik", "hiphop hiphoprap rap raphiphop"),
    ("R&B", "Musik", "rnb rb rhythmandblues"),
    ("Rock 'n' Roll", "Musik", "rocknroll rockandroll rocknrollmusic"),
    ("Pop", "Musik", "pop popmusik popmusic"),
    ("Rock", "Musik", "rock rockmusik"),
    ("Soundtrack", "Musik", "soundtrack soundtracks filmmusik ost originalsoundtrack score"),
    ("Weihnachten", "Musik", "weihnachten weihnachtslieder weihnachtsmusik christmas xmas"),
    ("Klassik", "Musik", "klassik classical klassische klassischemusik"),
    ("Elektronisch", "Musik", "electronic elektronisch electronica elektro electro"),
    ("Liedermacher", "Musik", "liedermacher singersongwriter"),
    ("Deutschrock", "Musik", "deutschrock germanrock"),
    ("Neue Deutsche Welle", "Musik", "ndw neuedeutschewelle"),
]:
    for _k in _keys.split():
        _GENRE_MAP[_k] = (_canon, _cat)
_PATH_CATS = [("Hörbuch", r"h(ö|oe|o)rb(u|ü|ue)ch|audiobook"), ("Hörspiel", r"h(ö|oe|o)rspiel"),
              ("Comedy", r"comedy|kabarett"), ("Kinder", r"kinder"), ("Podcast", r"podcast")]
_JUNK = {"", "other", "others", "andere", "sonstige", "sonstiges", "unknown", "unbekannt", "unbekanntesgenre", "genre", "misc",
         "miscellaneous", "verschiedenes", "verschiedene", "diverse", "none", "na", "default", "unknowngenre"}
# Wortteile → Art, falls die Schreibweise nicht in der Liste steht („Lesung * Erwachsene“, „Books & Spoken“)
_PART_CATS = [("hoerspiel", ("Hörspiel", "Hörspiel")), ("horspiel", ("Hörspiel", "Hörspiel")),
              ("hoerbuch", ("Hörbuch", "Hörbuch")), ("audiobook", ("Hörbuch", "Hörbuch")), ("lesung", ("Hörbuch", "Hörbuch")),
              ("spoken", ("Hörbuch", "Hörbuch")), ("gesprochen", ("Hörbuch", "Hörbuch")), ("comedy", ("Comedy", "Comedy")),
              ("kabarett", ("Comedy", "Comedy")), ("kinderlied", ("Kinder", "Kinder"))]
# Bekannte Hörspielreihen – stehen oft als „Hörbuch“ oder „Vocal“ in den Tags
_HOERSPIEL_RX = re.compile(r"drei \?|drei fragezeichen|tkkg|f(ü|ue)nf freunde|john sinclair|geisterj(ä|ae)ger|benjamin bl(ü|ue)mchen|"
                           r"bibi blocksberg|bibi (&|und) tina|hui buh|gruselkabinett|point whitecliff|larry brent|dorian hunter|"
                           r"commander perkins|die schwarze serie|paul temple|sherlock holmes|kommissar dobranski|h(ö|oe|o)rspiel", re.I)
_DISC_RX = re.compile(r"(cd|disc|disk|teil|part)[\s_.-]*\d+([\s_.-].{0,40})?", re.I)
_DISC_TAG_RX = re.compile(r"\s*[\(\[\-–,]?\s*(cd|disc|disk|teil|part)[\s_.-]*\d+\s*[\)\]]?\s*$", re.I)


def afolder(folder):
    """Ordner „Buch/CD 1“, „Buch/CD 2“ … gehören zu einem Album „Buch“."""
    folder = folder or ""
    if "/" in folder:
        parent, last = folder.rsplit("/", 1)
        if _DISC_RX.fullmatch(last.strip()):
            return parent
    return folder


def strip_disc(tag):
    return _DISC_TAG_RX.sub("", tag or "").strip()


def _gkey(g):
    k = g.lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    return re.sub(r"[^a-z0-9]", "", k)


def genre_parts(raw):
    """Rohes Genre-Tag → Liste (Anzeigename, Art). ID3-Nummern wie „(12)“ und Müll fallen weg."""
    out = []
    for g in re.split(r"[;/,|\\]", raw or ""):
        g = re.sub(r"^\(\d+\)", "", g.strip()).strip()
        k = _gkey(g)
        if k in _JUNK or k.isdigit():
            continue
        if k not in _GENRE_MAP and k.endswith("s") and k[:-1] in _GENRE_MAP:
            k = k[:-1]
        if k in _GENRE_MAP:
            out.append(_GENRE_MAP[k])
        elif any(part in k for part, _ in _PART_CATS):
            out.append(next(v for part, v in _PART_CATS if part in k))
        else:
            out.append((g[:1].upper() + g[1:], "Musik"))
    seen, res = set(), []
    for x in out:
        if x[0].lower() not in seen:
            seen.add(x[0].lower()); res.append(x)
    return res


def normalize_genres(lib_id):
    """Einheitliche Genres (gnorm) und Art (cat) je Titel; die Art gilt fürs ganze Album (Ordner)."""
    rows = db.q("SELECT id, folder, path, genre, artist, album FROM tracks WHERE library_id=?", (lib_id,))
    # gleiche Genres mit verschiedener Schreibweise → häufigste Schreibweise gewinnt
    spell = {}
    parts = {}
    for r in rows:
        ps = genre_parts(r["genre"])
        parts[r["id"]] = ps
        for name, _ in ps:
            d = spell.setdefault(_gkey(name), {})
            d[name] = d.get(name, 0) + 1
    best = {k: max(v.items(), key=lambda x: (x[1], x[0] != x[0].lower()))[0] for k, v in spell.items()}
    by_folder = {}
    for r in rows:
        by_folder.setdefault(afolder(r["folder"]), []).append(r)
    c = db.conn()
    for folder, lst in by_folder.items():
        votes = {}
        for r in lst:
            cats = [cat for _, cat in parts[r["id"]] if cat != "Musik"]
            if cats:
                votes[cats[0]] = votes.get(cats[0], 0) + 1
        cat = "Musik"
        if votes and max(votes.values()) * 2 >= len(lst):
            cat = max(votes.items(), key=lambda x: x[1])[0]
        else:
            for name, rx in _PATH_CATS:
                if re.search(rx, (lst[0]["path"] or "").lower()):
                    cat = name
                    break
        if cat in ("Hörbuch", "Musik") and any(_HOERSPIEL_RX.search(f"{x['path']} {x['artist']} {x['album']}") for x in lst[:3]):
            if cat == "Hörbuch" or any(_gkey(g) in ("vocal", "speech") for x in lst for g in [x["genre"] or ""]):
                cat = "Hörspiel"
        for r in lst:
            names = [best.get(_gkey(n), n) for n, _ in parts[r["id"]]]
            c.execute("UPDATE tracks SET gnorm=?, cat=?, afolder=? WHERE id=?", (";".join(names), cat, folder, r["id"]))
    c.commit()


def normalize_all():
    for r in db.q("SELECT DISTINCT library_id FROM tracks WHERE cat IS NULL OR afolder IS NULL"):
        normalize_genres(r["library_id"])


def _tags(data):
    t = {}
    for src in [data.get("format", {}).get("tags", {})] + [s.get("tags", {}) for s in data.get("streams", [])]:
        for k, v in (src or {}).items():
            t.setdefault(k.lower(), fix_text(v))
    return t


def _folder_cover(d):
    try:
        files = os.listdir(d)
    except OSError:
        return None
    imgs = [f for f in files if os.path.splitext(f)[1].lower() in (".jpg", ".jpeg", ".png")]
    for n in COVER_NAMES:
        for f in imgs:
            if os.path.splitext(f)[0].lower() == n:
                return os.path.join(d, f)
    return os.path.join(d, imgs[0]) if len(imgs) == 1 else None


def _make_cover(src_file, key, embedded):
    """Cover als JPG (max. 600 px) in images/ ablegen. Einmal pro Album-Schlüssel."""
    name = "m_" + hashlib.sha1(key.encode()).hexdigest()[:16] + ".jpg"
    dest = os.path.join(db.DATA_DIR, "images", name)
    if os.path.exists(dest):
        return name
    if embedded:
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", src_file, "-map", "0:v:0", "-frames:v", "1",
               "-vf", "scale='min(600,iw)':-2", dest]
    else:
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", src_file, "-frames:v", "1", "-vf", "scale='min(600,iw)':-2", dest]
    try:
        subprocess.run(cmd, capture_output=True, timeout=30)
    except Exception:
        pass
    return name if os.path.exists(dest) and os.path.getsize(dest) > 0 else None


def scan(lib, status=None):
    rts = _roots(lib)
    existing = {r["path"]: r for r in db.q("SELECT id,path,size,mtime FROM tracks WHERE library_id=?", (lib["id"],))}
    seen, reachable = set(), []
    c = db.conn()
    covers = {}
    for root in rts:
        if not os.path.isdir(root):
            log.warning("Musikordner nicht erreichbar: %s", root)
            continue
        reachable.append(root)
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = sorted(d for d in dirnames if d not in SKIP and not d.startswith("."))
            for fn in sorted(filenames):
                if fn.startswith(".") or os.path.splitext(fn)[1].lower() not in AUDIO_EXT:
                    continue
                full = os.path.join(dirpath, fn)
                try:
                    st = os.stat(full)
                except OSError:
                    continue
                seen.add(full)
                if status is not None:
                    status["checked"] = status.get("checked", 0) + 1
                old = existing.get(full)
                if old and old["size"] == st.st_size and abs((old["mtime"] or 0) - st.st_mtime) < 2:
                    continue
                if status is not None:
                    status["new"] = status.get("new", 0) + 1
                data = _probe(full)
                t = _tags(data)
                rel_dir = os.path.relpath(dirpath, root)
                rel_dir = "" if rel_dir == "." else rel_dir
                parts = [p for p in rel_dir.split(os.sep) if p]
                base = os.path.splitext(fn)[0]
                title = t.get("title") or re.sub(r"^\d+[\s.\-_]+", "", base).strip() or base
                artist = t.get("artist") or (parts[-2] if len(parts) >= 2 else "") or "Unbekannt"
                album = t.get("album") or (parts[-1] if parts else "") or "Ohne Album"
                album_artist = t.get("album_artist") or t.get("albumartist") or t.get("album artist") or artist
                year = _num((t.get("date") or t.get("year") or "")[:4])
                streams = data.get("streams", [])
                aud = next((s for s in streams if s.get("codec_type") == "audio"), {})
                has_pic = any(s.get("codec_type") == "video" for s in streams)
                key = f"{lib['id']}|{album_artist}|{album}"
                cover = covers.get(key)
                if not cover:
                    if has_pic:
                        cover = _make_cover(full, key, True)
                    if not cover:
                        fc = _folder_cover(dirpath)
                        cover = _make_cover(fc, key + "|f", False) if fc else None
                    if cover:
                        covers[key] = cover
                vals = (lib["id"], full, "/".join(parts), title, artist, album, album_artist, _num(t.get("track")),
                        _num(t.get("disc")), year, t.get("genre"), float(data.get("format", {}).get("duration") or 0),
                        aud.get("codec_name"), st.st_size, st.st_mtime, cover or None)
                if old:
                    c.execute("UPDATE tracks SET library_id=?,path=?,folder=?,title=?,artist=?,album=?,album_artist=?,"
                              "track=?,disc=?,year=?,genre=?,duration=?,codec=?,size=?,mtime=?,cover=? WHERE id=?",
                              vals + (old["id"],))
                else:
                    c.execute("INSERT INTO tracks(library_id,path,folder,title,artist,album,album_artist,track,disc,year,"
                              "genre,duration,codec,size,mtime,cover,added) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                              vals + (time.time(),))
                if status is not None and status.get("new", 0) % 50 == 0:
                    c.commit()
    c.commit()
    # Verschwundene Titel entfernen (nur in erreichbaren Ordnern)
    pre = tuple(r.rstrip("/") + "/" for r in reachable)
    gone = [r["id"] for p, r in existing.items() if p not in seen and p.startswith(pre)]
    for i in range(0, len(gone), 500):
        part = gone[i:i + 500]
        c.execute(f"DELETE FROM tracks WHERE id IN ({','.join('?' * len(part))})", part)
    c.commit()
    repair_texts(lib["id"])
    normalize_genres(lib["id"])
    return len(seen)


# ---------------------------------------------------------------- Abfragen

def _lib_sql(libs):
    return "library_id IN (%s)" % (",".join(str(int(x)) for x in libs) or "0")


def _filters(libs, q="", artist="", genre="", cat=""):
    where = _lib_sql(libs)
    args = []
    for w in (q or "").split():      # jedes Wort muss irgendwo vorkommen („Prinzen geklaut“)
        where += " AND (album LIKE ? OR album_artist LIKE ? OR artist LIKE ? OR title LIKE ? OR folder LIKE ?)"
        args += [f"%{w}%"] * 5
    if artist:
        where += " AND (album_artist = ? OR artist = ?)"
        args += [artist, artist]
    if genre:
        where += " AND (';' || IFNULL(gnorm,'') || ';') LIKE ?"
        args.append(f"%;{genre};%")
    if cat:
        where += " AND cat = ?"
        args.append(cat)
    return where, args


_COLS = "id,library_id,IFNULL(afolder,folder) folder,folder sub,title,artist,album,album_artist,track,disc,year,genre,duration,codec,cover,added,cat"


def _natkey(s):
    return [int(p) if p.isdigit() else p.lower() for p in re.split(r"(\d+)", s or "")]


def _is_num(x):
    return bool(re.fullmatch(r"\s*(cd|disc)?\s*\d+\s*", x or "", re.I))


def _group(rows):
    """Titel zu Alben zusammenfassen: ein Album = ein Ordner (wie bei Serien).
    Nur wenn ein Ordner eindeutig mehrere Alben enthält (je mind. 3 Titel mit eigenem Album-Tag), wird geteilt."""
    by_folder = {}
    for r in rows:
        by_folder.setdefault((r["library_id"], r["folder"] or ""), []).append(r)
    out = []
    for (lib, folder), lst in by_folder.items():
        tags = {}
        for r in lst:
            a = strip_disc(r["album"])
            if a and not _is_num(a):
                tags.setdefault(a, []).append(r)
        big = {k: v for k, v in tags.items() if len(v) >= 3}
        if len(big) >= 2 and sum(len(v) for v in big.values()) >= 0.8 * len(lst):
            rest = [r for r in lst if strip_disc(r["album"]) not in big]
            groups = list(big.values()) + ([rest] if rest else [])
        else:
            groups = [lst]
        for g in groups:
            out.append(_album_info(lib, folder, g))
    return out


def _common(vals):
    vals = [v for v in vals if v]
    return vals[0] if vals and all(v == vals[0] for v in vals) else None


def _album_info(lib, folder, g):
    tag = _common([strip_disc(r["album"]) for r in g])
    fname = folder.split("/")[-1] if folder else ""
    name = tag if tag and not _is_num(tag) else (fname or tag or "Einzeltitel")
    artist = _common([r["album_artist"] for r in g]) or _common([r["artist"] for r in g])
    if not artist:
        artist = "Verschiedene Interpreten" if len({r["artist"] for r in g}) > 1 else (g[0]["artist"] or "")
    return {"id": min(r["id"] for r in g), "library_id": lib, "folder": folder, "album": name, "album_artist": artist,
            "year": max((r["year"] or 0) for r in g) or None, "cover": next((r["cover"] for r in g if r["cover"]), None),
            "n": len(g), "added": max((r["added"] or 0) for r in g), "dur": sum((r["duration"] or 0) for r in g),
            "ids": [r["id"] for r in g]}


def albums(libs, q="", sort="album", artist="", genre="", cat=""):
    where, args = _filters(libs, q, artist, genre, cat)
    hit = db.q(f"SELECT DISTINCT library_id, IFNULL(afolder,folder) folder FROM tracks WHERE {where}", args)
    if not hit:
        return []
    keys = {(r["library_id"], r["folder"] or "") for r in hit}
    rows = [r for r in db.q(f"SELECT {_COLS} FROM tracks WHERE {_lib_sql(libs)}") if (r["library_id"], r["folder"] or "") in keys]
    groups = _group(rows)
    if q or artist or genre or cat:      # nur Alben, in denen wirklich ein passender Titel steckt
        ok = {r["id"] for r in db.q(f"SELECT id FROM tracks WHERE {where}", args)}
        groups = [g for g in groups if ok.intersection(g["ids"])]
    keyf = {"artist": lambda g: (g["album_artist"].lower(), g["year"] or 0, g["album"].lower()),
            "added": lambda g: -g["added"], "year": lambda g: (-(g["year"] or 0), g["album"].lower())}.get(
        sort, lambda g: g["album"].lower())
    groups.sort(key=keyf)
    for g in groups:
        g.pop("ids", None)
    return groups


def tracks(libs, q="", artist="", genre="", sort="title", shuffle=False, limit=2000, cat=""):
    where, args = _filters(libs, q, artist, genre, cat)
    order = "RANDOM()" if shuffle else {
        "title": "title COLLATE NOCASE", "artist": "artist COLLATE NOCASE, album COLLATE NOCASE, disc, track",
        "added": "added DESC", "year": "year DESC, album COLLATE NOCASE, disc, track",
        "album": "album COLLATE NOCASE, disc, track"}.get(sort, "title COLLATE NOCASE")
    return [dict(r) for r in db.q(
        f"SELECT id,title,artist,album,album_artist,track,disc,year,genre,duration,codec,cover FROM tracks "
        f"WHERE {where} ORDER BY {order} LIMIT ?", args + [limit])]


def facets(libs, cat=""):
    where, args = _filters(libs, cat=cat)
    arts = db.q(f"SELECT t.artist name, COUNT(DISTINCT IFNULL(afolder,folder)) albums, COUNT(*) n, "
                f"COALESCE((SELECT image FROM artist_img a WHERE a.name=t.artist AND a.blocked=0), MAX(cover)) cover, "
                f"(SELECT image FROM artist_img a WHERE a.name=t.artist AND a.blocked=0) photo FROM tracks t "
                f"WHERE {where} GROUP BY t.artist ORDER BY t.artist COLLATE NOCASE", args)
    gen = {}
    for r in db.q(f"SELECT gnorm, COUNT(*) n FROM tracks WHERE {where} AND gnorm IS NOT NULL AND gnorm<>'' GROUP BY gnorm", args):
        for g in r["gnorm"].split(";"):
            if g and (cat or g not in CATS[1:]):     # Hörbuch & Co. sind Arten, keine Musikrichtungen
                cur = gen.setdefault(g, {"name": g, "n": 0})
                cur["n"] += r["n"]
    base, bargs = _filters(libs)
    cats = {r["cat"] or "Musik": r["n"] for r in db.q(f"SELECT cat, COUNT(DISTINCT IFNULL(afolder,folder)) n FROM tracks WHERE {base} GROUP BY cat", bargs)}
    return {"artists": [dict(a) for a in arts if a["name"]],
            "genres": sorted(gen.values(), key=lambda x: x["name"].lower()),
            "cats": [{"name": c, "albums": cats[c]} for c in CATS if c in cats]}


def album(tid, libs):
    t = db.q1("SELECT library_id, IFNULL(afolder,folder) folder FROM tracks WHERE id=?", (tid,))
    if not t or t["library_id"] not in libs:
        return None
    rows = db.q(f"SELECT {_COLS} FROM tracks WHERE library_id=? AND IFNULL(afolder,folder) IS ?", (t["library_id"], t["folder"]))
    for g in _group(rows):
        if tid in g["ids"]:
            tr = sorted((r for r in rows if r["id"] in set(g["ids"])),
                        key=lambda r: (_natkey(r["sub"]), r["disc"] or 1, r["track"] or 9999, (r["title"] or "").lower()))
            return {"album": g["album"], "artist": g["album_artist"], "year": g["year"], "cover": g["cover"],
                    "tracks": [dict(r) for r in tr]}
    return None


def search_tracks(libs, q, limit=60):
    return [dict(r) for r in db.q(
        f"SELECT id,title,artist,album,album_artist,duration,codec,cover FROM tracks WHERE {_lib_sql(libs)} "
        f"AND (title LIKE ? OR artist LIKE ?) ORDER BY title COLLATE NOCASE LIMIT ?", (f"%{q}%", f"%{q}%", limit))]


# ---------------------------------------------------------------- Radio

RB_HOSTS = ["https://de1.api.radio-browser.info", "https://de2.api.radio-browser.info",
            "https://fi1.api.radio-browser.info", "https://all.api.radio-browser.info"]
UA = {"User-Agent": "Kinowerk/1.1"}
DEFAULT_STATIONS = ["NDR 2", "NDR 1 Niedersachsen", "radio ffn", "Antenne Niedersachsen", "N-JOY", "1LIVE", "WDR 2",
                    "Bayern 3", "SWR3", "hr3", "MDR JUMP", "MDR SACHSEN-ANHALT", "radioeins", "Fritz",
                    "Deutschlandfunk", "Deutschlandfunk Kultur", "Klassik Radio", "ROCK ANTENNE", "Radio Bob!", "Radio 21"]


def _rb(path, params):
    last = None
    for h in RB_HOSTS:
        try:
            r = httpx.get(h + path, params=params, headers=UA, timeout=8, follow_redirects=True)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            last = e
    raise RuntimeError(f"Radio-Verzeichnis nicht erreichbar ({last})")


def _station(x):
    return {"name": (x.get("name") or "").strip(), "url": x.get("url_resolved") or x.get("url"),
            "favicon": x.get("favicon") or "", "codec": x.get("codec") or "", "bitrate": x.get("bitrate") or 0,
            "uuid": x.get("stationuuid") or "", "tags": x.get("tags") or "", "country": x.get("countrycode") or ""}


def radio_search(q, country=""):
    params = {"name": q, "limit": 40, "order": "clickcount", "reverse": "true", "hidebroken": "true"}
    if country:
        params["countrycode"] = country
    return [_station(x) for x in _rb("/json/stations/search", params) if x.get("url_resolved") or x.get("url")]


def stations():
    raw = db.get_setting("radio_stations")
    if raw is None:
        found = []
        for n in DEFAULT_STATIONS:
            try:
                res = radio_search(n, "DE")
            except Exception:
                break
            exact = [r for r in res if r["name"].lower() == n.lower()] or res[:1]
            if exact and not any(f["uuid"] == exact[0]["uuid"] for f in found):
                found.append(exact[0])
        if found:
            db.set_setting("radio_stations", json.dumps(found))
        return found
    try:
        return json.loads(raw)
    except Exception:
        return []


def save_stations(lst):
    clean = [{k: s.get(k, "") for k in ("name", "url", "favicon", "codec", "bitrate", "uuid", "tags", "country")}
             for s in lst if s.get("name") and s.get("url")]
    db.set_setting("radio_stations", json.dumps(clean))
    return clean


def resolve_playlist(url):
    """.pls/.m3u-Wiedergabelisten auflösen – liefert die eigentliche Stream-Adresse."""
    low = url.lower().split("?")[0]
    if not (low.endswith(".pls") or low.endswith(".m3u")):
        return url
    try:
        txt = httpx.get(url, headers=UA, timeout=8, follow_redirects=True).text
        for line in txt.splitlines():
            line = line.strip()
            if line.lower().startswith("file") and "=" in line:
                line = line.split("=", 1)[1].strip()
            if line.startswith("http"):
                return line
    except Exception:
        pass
    return url


# ---------------------------------------------------------------- Playlisten

def _pl_tracks(pid):
    return [dict(r) for r in db.q(
        "SELECT t.id,t.title,t.artist,t.album,t.album_artist,t.track,t.duration,t.codec,t.cover,t.library_id, p.id pli "
        "FROM playlist_items p JOIN tracks t ON t.id=p.track_id WHERE p.playlist_id=? ORDER BY p.pos, p.id", (pid,))]


def playlists(uid, libs):
    out = []
    for p in db.q("SELECT * FROM playlists WHERE user_id=? ORDER BY name COLLATE NOCASE", (uid,)):
        tr = [t for t in _pl_tracks(p["id"]) if t["library_id"] in libs]
        out.append({"id": p["id"], "name": p["name"], "n": len(tr), "dur": sum(t["duration"] or 0 for t in tr),
                    "covers": list(dict.fromkeys(t["cover"] for t in tr if t["cover"]))[:4]})
    return out


def playlist(pid, uid, libs):
    p = db.q1("SELECT * FROM playlists WHERE id=? AND user_id=?", (pid, uid))
    if not p:
        return None
    return {"id": p["id"], "name": p["name"], "tracks": [t for t in _pl_tracks(pid) if t["library_id"] in libs]}


def playlist_add(pid, track_ids):
    c = db.conn()
    pos = (db.q1("SELECT MAX(pos) m FROM playlist_items WHERE playlist_id=?", (pid,))["m"] or 0)
    for i, t in enumerate(track_ids):
        c.execute("INSERT INTO playlist_items(playlist_id,track_id,pos) VALUES(?,?,?)", (pid, int(t), pos + i + 1))
    c.commit()


def playlist_set(pid, track_ids):
    c = db.conn()
    c.execute("DELETE FROM playlist_items WHERE playlist_id=?", (pid,))
    for i, t in enumerate(track_ids):
        c.execute("INSERT INTO playlist_items(playlist_id,track_id,pos) VALUES(?,?,?)", (pid, int(t), i + 1))
    c.commit()


def inventory(libs):
    """Kompakte Übersicht aller Alben mit Genres (für die Genre-Prüfung über Home Assistant)."""
    if not libs:
        return ""
    rows = db.q(f"SELECT {_COLS} FROM tracks WHERE {_lib_sql(libs)}")
    byid = {r["id"]: r for r in rows}
    lines = []
    for g in sorted(_group(rows), key=lambda g: (g["album_artist"].lower(), g["album"].lower())):
        gen = {}
        for i in g["ids"]:
            k = (byid[i]["genre"] or "-").strip() or "-"
            gen[k] = gen.get(k, 0) + 1
        gs = ", ".join(f"{k}" if c == g["n"] else f"{k}×{c}" for k, c in sorted(gen.items(), key=lambda x: -x[1]))
        cat = byid[g["ids"][0]]["cat"] or "?"
        lines.append(f"{g['album_artist']} | {g['album']} | {g['n']} | {cat} | {gs} | {g['folder']}")
    return "\n".join(lines)


# ---------------------------------------------------------------- Papierkorb (Musik)

def _tmove(src, dst):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if os.path.isdir(src) and os.path.isdir(dst):          # gibt es im Papierkorb schon → zusammenführen
        for f in os.listdir(src):
            _tmove(os.path.join(src, f), os.path.join(dst, f))
        os.rmdir(src)
        return
    if os.path.exists(dst):
        base, ext = os.path.splitext(dst)
        dst = f"{base} ({time.strftime('%Y-%m-%d %H%M%S')}){ext}"
    os.rename(src, dst)


def trash(track_ids, whole_album=False):
    """Titel (oder ein ganzes Album) in den Ordner _Papierkorb der Bibliothek verschieben.
    Endgültig gelöscht wird nichts. Rückgabe: Anzahl verschobener Titel."""
    from . import library
    if not track_ids:
        return 0
    marks = ",".join("?" * len(track_ids))
    rows = db.q(f"SELECT id, library_id, path, folder, IFNULL(afolder,folder) af FROM tracks WHERE id IN ({marks})", track_ids)
    moved_ids = []
    for lib_id in {r["library_id"] for r in rows}:
        lib = db.q1("SELECT * FROM libraries WHERE id=?", (lib_id,))
        rts = library.roots(lib)
        lrows = [r for r in rows if r["library_id"] == lib_id]
        if whole_album:
            # ganzer Albumordner, wenn darin sonst keine anderen Titel liegen
            af = lrows[0]["af"] or ""
            root = next((x for x in rts if lrows[0]["path"].startswith(x.rstrip("/") + "/")), None)
            if root and af:
                adir = os.path.join(root, af)
                ours = {r["path"] for r in lrows}
                others = db.q("SELECT path FROM tracks WHERE library_id=? AND (path LIKE ? ) ", (lib_id, adir.rstrip("/") + "/%"))
                if os.path.isdir(adir) and all(o["path"] in ours for o in others):
                    if not os.access(os.path.dirname(adir), os.W_OK):
                        raise RuntimeError("Der Musikordner ist nur lesend eingehängt")
                    _tmove(adir, os.path.join(root, TRASH, af))
                    moved_ids += [r["id"] for r in lrows]
                    _cleanup_dirs(root, os.path.dirname(adir))
                    continue
        for r in lrows:
            root = next((x for x in rts if r["path"].startswith(x.rstrip("/") + "/")), None)
            if not root or not os.path.exists(r["path"]):
                moved_ids.append(r["id"])          # Datei schon weg → nur aus der Liste nehmen
                continue
            if not os.access(os.path.dirname(r["path"]), os.W_OK):
                raise RuntimeError("Der Musikordner ist nur lesend eingehängt")
            rel = os.path.relpath(r["path"], root)
            _tmove(r["path"], os.path.join(root, TRASH, rel))
            moved_ids.append(r["id"])
            _cleanup_dirs(root, os.path.dirname(r["path"]), only_images=True)
    if moved_ids:
        m = ",".join("?" * len(moved_ids))
        db.run(f"DELETE FROM playlist_items WHERE track_id IN ({m})", moved_ids)
        db.run(f"DELETE FROM tracks WHERE id IN ({m})", moved_ids)
    return len(moved_ids)


def _cleanup_dirs(root, d, only_images=False):
    """Leer gewordene Ordner entfernen. only_images: Ordner, in dem nur noch Bilder/Kleinkram liegen,
    wandert ebenfalls in den Papierkorb (z. B. Cover nach dem letzten Titel)."""
    root = root.rstrip("/")
    while d.startswith(root + "/") and os.path.isdir(d):
        try:
            rest = os.listdir(d)
            if rest and only_images and not any(os.path.isdir(os.path.join(d, f)) or
                                                os.path.splitext(f)[1].lower() in AUDIO_EXT for f in rest):
                _tmove(d, os.path.join(root, TRASH, os.path.relpath(d, root)))
            elif rest:
                break
            else:
                os.rmdir(d)
        except OSError:
            break
        d = os.path.dirname(d)


# ---------------------------------------------------------------- Bilder aus dem Internet (Deezer)

DZ = "https://api.deezer.com"
NET = {"running": False, "artists": 0, "covers": 0, "done": 0, "total": 0}
_NO_ARTIST = {"verschiedene interpreten", "various artists", "various", "unbekannt", "unknown", "diverse", "va", ""}


def _dz(path, params):
    for _ in range(3):
        try:
            r = httpx.get(DZ + path, params=params, timeout=15, headers=UA)
            d = r.json()
        except Exception:
            time.sleep(2)
            continue
        if isinstance(d, dict) and d.get("error"):
            if (d["error"].get("code") == 4):        # Quota – kurz warten
                time.sleep(5)
                continue
            return {}
        time.sleep(0.15)                            # max. ~6 Anfragen/s (Deezer erlaubt 50 in 5 s)
        return d
    return {}


def _save_net_image(url, prefix):
    if not url:
        return None
    name = prefix + hashlib.sha1(url.encode()).hexdigest()[:16] + ".jpg"
    dest = os.path.join(db.DATA_DIR, "images", name)
    if not os.path.exists(dest):
        try:
            r = httpx.get(url, timeout=30, follow_redirects=True)
            if r.status_code != 200 or len(r.content) < 2000 or "image" not in r.headers.get("content-type", ""):
                return None
            with open(dest, "wb") as f:
                f.write(r.content)
        except Exception:
            return None
    return name


def artist_photo(name):
    from .check import score
    d = _dz("/search/artist", {"q": name, "limit": 5})
    for a in d.get("data") or []:
        if score(a.get("name", ""), name) >= 0.85 and a.get("picture_xl") and "/artist//" not in a["picture_xl"]:
            return _save_net_image(a.get("picture_xl") or a.get("picture_big"), "ar_")
    return None


def album_cover(artist, album):
    from .check import score
    q = f'artist:"{artist}" album:"{album}"' if artist and artist.lower() not in _NO_ARTIST else album
    d = _dz("/search/album", {"q": q, "limit": 8})
    if not (d.get("data")):
        d = _dz("/search/album", {"q": f"{artist} {album}" if artist.lower() not in _NO_ARTIST else album, "limit": 8})
    for a in d.get("data") or []:
        ok_album = score(a.get("title", ""), album) >= 0.7
        ok_artist = artist.lower() in _NO_ARTIST or score((a.get("artist") or {}).get("name", ""), artist) >= 0.6
        if ok_album and ok_artist:
            return _save_net_image(a.get("cover_xl") or a.get("cover_big"), "mn_")
    return None


def fetch_images(force=False):
    """Fehlende Albumcover und Interpretenfotos im Hintergrund suchen (je nur einmal, danach nur Neues)."""
    if NET["running"]:
        return
    NET.update(running=True, artists=0, covers=0, done=0)
    try:
        libs = [r["id"] for r in db.q("SELECT id FROM libraries WHERE kind='musik'")]
        if not libs:
            return
        now = time.time()
        old = now - 30 * 86400
        rows = db.q(f"SELECT {_COLS} FROM tracks WHERE {_lib_sql(libs)}")
        todo = []
        tried = {(r["library_id"], r["afolder"]): r for r in db.q("SELECT * FROM album_net")}
        for g in _group(rows):
            if g["cover"]:
                continue
            t = tried.get((g["library_id"], g["folder"]))
            if t and (t["blocked"] or (t["tried"] or 0) > old) and not force:
                continue
            todo.append(g)
        arts = [r["artist"] for r in db.q(
            f"SELECT artist FROM tracks WHERE {_lib_sql(libs)} AND (cat IS NULL OR cat IN ('Musik','Comedy','Kinder','Hörspiel')) "
            f"GROUP BY artist")]
        have = {r["name"]: r for r in db.q("SELECT * FROM artist_img")}
        arts = [a for a in arts if a and a.lower() not in _NO_ARTIST and
                (force or a not in have or (not have[a]["image"] and not have[a]["blocked"] and (have[a]["tried"] or 0) < old))]
        NET["total"] = len(todo) + len(arts)
        c = db.conn()
        for g in todo:
            try:
                img = album_cover(g["album_artist"], strip_disc(g["album"]))
            except Exception as e:
                log.warning("Cover %s: %s", g["album"], e)
                img = None
            if img:
                c.execute("UPDATE tracks SET cover=? WHERE library_id=? AND IFNULL(afolder,folder) IS ? AND cover IS NULL",
                          (img, g["library_id"], g["folder"]))
                NET["covers"] += 1
            c.execute("INSERT OR REPLACE INTO album_net(library_id, afolder, tried, blocked) VALUES(?,?,?,0)",
                      (g["library_id"], g["folder"], now))
            c.commit()
            NET["done"] += 1
        for a in arts:
            try:
                img = artist_photo(a)
            except Exception as e:
                log.warning("Interpretenbild %s: %s", a, e)
                img = None
            c.execute("INSERT INTO artist_img(name, image, tried) VALUES(?,?,?) "
                      "ON CONFLICT(name) DO UPDATE SET image=excluded.image, tried=excluded.tried", (a, img, now))
            c.commit()
            NET["artists"] += 1 if img else 0
            NET["done"] += 1
    finally:
        NET["running"] = False


def remove_artist_photo(name):
    db.run("INSERT INTO artist_img(name, image, tried, blocked) VALUES(?,NULL,?,1) "
           "ON CONFLICT(name) DO UPDATE SET image=NULL, blocked=1", (name, time.time()))


def remove_album_cover(tid):
    t = db.q1("SELECT library_id, IFNULL(afolder,folder) af FROM tracks WHERE id=?", (tid,))
    if not t:
        return
    db.run("UPDATE tracks SET cover=NULL WHERE library_id=? AND IFNULL(afolder,folder) IS ?", (t["library_id"], t["af"]))
    db.run("INSERT OR REPLACE INTO album_net(library_id, afolder, tried, blocked) VALUES(?,?,?,1)",
           (t["library_id"], t["af"], time.time()))

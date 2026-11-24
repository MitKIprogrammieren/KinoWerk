"""Bibliothek: Ordner durchsuchen, Dateien analysieren, Filminfos von TheMovieDB holen."""
import json
import logging
import os
import re
import subprocess
import threading
import time

import httpx

from . import db

log = logging.getLogger("mediathek.library")

VIDEO_EXT = {".mp4", ".m4v", ".mkv", ".avi", ".mov", ".wmv", ".mpg", ".mpeg", ".ts",
             ".m2ts", ".mts", ".webm", ".flv", ".divx", ".3gp", ".ogv"}
SKIP_DIRS = {"#recycle", "@eaDir", "#snapshot", "@Recycle", "$RECYCLE.BIN", "lost+found",
             "System Volume Information", "VIDEO_TS", "BDMV", "AUDIO_TS", "extras", "Extras",
             "featurettes", "Featurettes", "sample", "Sample"}
JUNK = re.compile(
    r"\b(2160p|1080p|1080i|720p|576p|480p|4k|uhd|hdr10?|dv|bluray|blu-ray|bdrip|brrip|"
    r"dvdrip|webrip|web-dl|webdl|web|hdtv|remux|x264|x265|h264|h265|hevc|avc|xvid|divx|"
    r"aac|ac3|eac3|dts|dts-hd|truehd|atmos|dd5\.1|5\.1|7\.1|german|deutsch|dl|ml|"
    r"multi|dubbed|ger|eng|subbed|extended|uncut|unrated|directors\.?cut|remastered|"
    r"proper|repack|internal|complete)\b.*$", re.I)
YEAR = re.compile(r"[\(\[\s\.]((?:19|20)\d\d)[\)\]\s\.]?")
EPISODE = re.compile(r"[Ss](\d{1,2})[\s\._-]*[EeFf](\d{1,3})|\b(\d{1,2})x(\d{2,3})\b")
SEASON_DIR = re.compile(r"^(staffel|season|s)\s*\d+$", re.I)

MIN_SIZE = int(os.environ.get("MEDIATHEK_MINSIZE", 1024 * 1024))
_scan_lock = threading.Lock()
status = {"running": False, "phase": "", "done": 0, "total": 0, "last": None, "checked": 0, "new": 0,
          "target": "", "last_result": ""}


def clean_title(name: str):
    """Aus einem Dateinamen Titel und Jahr gewinnen."""
    t = re.sub(r"[\._]", " ", name).strip()
    year = None
    m = YEAR.search(" " + t + " ")
    if m and m.start() > 1:
        year = int(m.group(1))
        t = (" " + t + " ")[:m.start()].strip()
    t = JUNK.sub("", t)
    t = re.sub(r"[\[\(][^\]\)]*[\]\)]", "", t)
    t = re.sub(r"\s+-\s*$", "", t)
    t = re.sub(r"\s{2,}", " ", t).strip(" -")
    return (t or name), year


def sort_key(title: str) -> str:
    t = title.lower()
    for art in ("der ", "die ", "das ", "the ", "ein ", "eine ", "a "):
        if t.startswith(art):
            t = t[len(art):]
            break
    return t


# ---------------------------------------------------------------- Scan

_jobs = []
_jobs_lock = threading.Lock()


def scan_all(target=None):
    """Suchlauf starten. target: None = alles, ("lib", id) = eine Bibliothek, ("series", id) = eine Serie.
    Läuft schon einer, wird der Auftrag hinten angehängt."""
    with _jobs_lock:
        if target not in _jobs:
            _jobs.append(target)
    if not _scan_lock.acquire(blocking=False):
        return False
    threading.Thread(target=_scan_worker, daemon=True).start()
    return True


def series_dirs(sid):
    """Ordner einer Serie (oberster Ordner unterhalb des Bibliotheksordners)."""
    s_ = db.q1("SELECT * FROM series WHERE id=?", (sid,))
    if not s_:
        return None, []
    lib = db.q1("SELECT * FROM libraries WHERE id=?", (s_["library_id"],))
    rts = roots(lib)
    dirs = set()
    for it in db.q("SELECT path FROM items WHERE series_id=?", (sid,)):
        root, rel, _ = locate(rts, it["path"])
        if root:
            top = rel.split(os.sep)[0] if rel else ""
            dirs.add(os.path.join(root, top) if top else os.path.dirname(it["path"]))
    return lib, sorted(dirs)


def _scan_worker():
    try:
        while True:
            with _jobs_lock:
                if not _jobs:
                    break
                jobs = list(_jobs)
                _jobs.clear()
            status.update(running=True, phase="Ordner durchgehen", done=0, total=0, checked=0, new=0)
            if None in jobs:
                status["target"] = "alle Bibliotheken"
                todo = [(lib, None) for lib in db.q("SELECT * FROM libraries")]
            else:
                todo, names = [], []
                for kind, ref in jobs:
                    if kind == "lib":
                        lib = db.q1("SELECT * FROM libraries WHERE id=?", (ref,))
                        if lib:
                            todo.append((lib, None)); names.append(lib["name"])
                    elif kind == "series":
                        lib, dirs = series_dirs(ref)
                        s_ = db.q1("SELECT name FROM series WHERE id=?", (ref,))
                        if lib and dirs:
                            todo.append((lib, dirs)); names.append(s_["name"] if s_ else "Serie")
                status["target"] = ", ".join(names)
            for lib, dirs in todo:
                try:
                    scan_library(lib, dirs)
                except Exception:
                    log.exception("Scan von %s fehlgeschlagen", lib["name"])
            new = status["new"]
            probe_pending()
            fetch_metadata()
            status["last"] = time.time()
            status["last_result"] = (f"{status['target']}: {status['checked']} Dateien geprüft, "
                                     f"{new} neu oder geändert")
    finally:
        status.update(running=False, phase="")
        _scan_lock.release()


def roots(lib):
    """Alle Ordner einer Bibliothek."""
    r = [x["path"] for x in db.q("SELECT path FROM library_paths WHERE library_id=? ORDER BY id", (lib["id"],))]
    return r or ([lib["path"]] if lib.get("path") else [])


def locate(rts, path):
    """Zu einer Datei den passenden Bibliotheksordner, den relativen Unterordner und den Anzeige-Ordner finden."""
    best = None
    for r in rts:
        rr = r.rstrip("/") + "/"
        if path.startswith(rr) and (best is None or len(r) > len(best)):
            best = r
    if best is None:
        return None, "", ""
    rel = os.path.relpath(os.path.dirname(path), best)
    rel = "" if rel == "." else rel
    if len(rts) > 1:
        shown = os.path.join(os.path.basename(best.rstrip("/")), rel) if rel else os.path.basename(best.rstrip("/"))
    else:
        shown = rel
    return best, rel, shown


def scan_library(lib, only_dirs=None):
    rts = roots(lib)
    existing = {r["path"]: r for r in db.q("SELECT id,path,size,mtime FROM items WHERE library_id=?",
                                           (lib["id"],))}
    if only_dirs:
        pre = tuple(d.rstrip("/") + "/" for d in only_dirs)
        existing = {p: r for p, r in existing.items() if p.startswith(pre)}
    seen = set()
    reachable = []
    c = db.conn()
    for root in (only_dirs or rts):
        if not os.path.isdir(root):
            log.warning("Ordner nicht erreichbar: %s", root)
            continue
        reachable.append(root)
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS and not d.startswith("."))
            for fn in filenames:
                ext = os.path.splitext(fn)[1].lower()
                if ext not in VIDEO_EXT or fn.startswith("."):
                    continue
                full = os.path.join(dirpath, fn)
                try:
                    st = os.stat(full)
                except OSError:
                    continue
                if st.st_size < MIN_SIZE:  # sehr kleine Dateien (Beispiele, Reste) ignorieren
                    continue
                seen.add(full)
                status["checked"] += 1
                old = existing.get(full)
                if old and old["size"] == st.st_size and abs((old["mtime"] or 0) - st.st_mtime) < 2:
                    continue
                status["new"] += 1
                _, rel, shown = locate(rts, full)
                info = classify(lib, full, fn, rel)
                if old:
                    c.execute("UPDATE items SET size=?, mtime=?, probed=0, chapters=NULL, mediainfo=NULL WHERE id=?",
                              (st.st_size, st.st_mtime, old["id"]))
                else:
                    if info.get("series_id"):
                        c.execute("UPDATE series SET details_done=0 WHERE id=? AND tmdb_id IS NOT NULL", (info["series_id"],))
                    c.execute(
                        "INSERT INTO items(library_id,path,kind,title,sort_title,year,series_id,season,"
                        "episode,size,mtime,added,folder) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        (lib["id"], full, info["kind"], info["title"], sort_key(info["title"]),
                         info.get("year"), info.get("series_id"), info.get("season"),
                         info.get("episode"), st.st_size, st.st_mtime, time.time(), shown))
                status["done"] += 1
            c.commit()
    # Nur Einträge entfernen, deren Ordner erreichbar war (NAS kurz weg = nichts löschen)
    for p in existing:
        if p in seen:
            continue
        if only_dirs:
            if any(p.startswith(d.rstrip("/") + "/") for d in reachable):
                c.execute("DELETE FROM items WHERE path=?", (p,))
            continue
        root, _, _ = locate(rts, p)
        if root is None or root in reachable:
            c.execute("DELETE FROM items WHERE path=?", (p,))
    c.execute("DELETE FROM series WHERE library_id=? AND id NOT IN "
              "(SELECT DISTINCT series_id FROM items WHERE series_id IS NOT NULL)", (lib["id"],))
    # Neue Folgen erben die Altersfreigabe ihrer Serie
    c.execute("UPDATE items SET fsk=(SELECT fsk FROM series WHERE series.id=items.series_id) "
              "WHERE library_id=? AND series_id IS NOT NULL AND fsk IS NULL", (lib["id"],))
    c.commit()


def refresh_folders(lib):
    rts = roots(lib)
    c = db.conn()
    for it in db.q("SELECT id,path FROM items WHERE library_id=?", (lib["id"],)):
        _, _, shown = locate(rts, it["path"])
        c.execute("UPDATE items SET folder=? WHERE id=?", (shown, it["id"]))
    c.commit()


SEASON_NUM = re.compile(r"(?:staffel|season|s)\s*(\d{1,2})\b", re.I)
EP_WORD = re.compile(r"(?:folge|episode|ep|e)[\s\._-]*(\d{1,3})\b", re.I)
EP_LEAD = re.compile(r"(?:^|[\s\._-])(\d{1,3})(?=[\s\._-]|$)")


def classify(lib, full, fn, folder):
    base = os.path.splitext(fn)[0]
    if lib["kind"] == "serien":
        return classify_episode(lib, base, folder)
    if lib["kind"] == "filme":
        t, y = clean_title(base)
        return {"kind": "movie", "title": t, "year": y}
    t = re.sub(r"[\._]", " ", base).strip()
    return {"kind": "video", "title": t}


def classify_episode(lib, base, folder):
    """Serie, Staffel und Folge aus Ordnern und Dateinamen ermitteln.
    Der oberste Ordner unter der Bibliothek ist der Serienname (z. B. Serien/Airwolf/Staffel 1/...)."""
    dirs = [p for p in folder.split(os.sep) if p]
    show_dirs = [p for p in dirs if not SEASON_DIR.match(p)]
    folder_season = None
    for p in dirs[1:] if show_dirs else dirs:
        ms = SEASON_NUM.search(p)
        if ms:
            folder_season = int(ms.group(1))
    season = ep = None
    prefix, rest = "", base
    m = EPISODE.search(base)
    if m:
        season = int(m.group(1) or m.group(3))
        ep = int(m.group(2) or m.group(4))
        prefix, rest = base[:m.start()], base[m.end():]
    else:
        m = EP_WORD.search(base) or EP_LEAD.search(base)
        if m:
            ep = int(m.group(1))
            prefix, rest = base[:m.start()], base[m.end():]
    if season is None:
        season = folder_season if folder_season is not None else (1 if ep else 0)
    if show_dirs:
        name, year = clean_title(show_dirs[0])
    else:
        name, year = clean_title(prefix) if len(prefix.strip(" .-_")) > 1 else clean_title(base)
    sid = series_id(lib["id"], name, year)
    ep_title = ""
    if rest.strip(" .-_"):
        t, _ = clean_title(rest)
        ep_title = "" if t == rest else t
    if ep_title.lower().startswith(name.lower()):
        ep_title = ep_title[len(name):].strip(" -")
    if len(ep_title) < 2:
        ep_title = f"Folge {ep}" if ep else clean_title(base)[0]
    return {"kind": "episode", "title": ep_title, "series_id": sid, "season": season, "episode": ep}


def reclassify_library(lib):
    """Vorhandene Einträge neu einordnen (z. B. nach Wechsel der Art), ohne die Dateien neu zu analysieren."""
    c = db.conn()
    rts = roots(lib)
    for it in db.q("SELECT id,path,folder,kind FROM items WHERE library_id=?", (lib["id"],)):
        _, rel, shown = locate(rts, it["path"])
        info = classify(lib, it["path"], os.path.basename(it["path"]), rel)
        changed = info["kind"] != it["kind"]
        c.execute("UPDATE items SET kind=?, title=?, sort_title=?, year=?, series_id=?, season=?, episode=?, folder=? "
                  + (", tmdb_id=NULL, poster=NULL, backdrop=NULL, overview=NULL, meta_done=0, details_done=0, fsk=NULL"
                     if changed else "")
                  + " WHERE id=?",
                  (info["kind"], info["title"], sort_key(info["title"]), info.get("year"),
                   info.get("series_id"), info.get("season"), info.get("episode"), shown, it["id"]))
    c.execute("DELETE FROM series WHERE library_id=? AND id NOT IN "
              "(SELECT DISTINCT series_id FROM items WHERE series_id IS NOT NULL)", (lib["id"],))
    c.commit()


def migrate():
    """Einmalige Anpassungen nach einem Update."""
    if int(db.get_setting("classify_version", "1")) < 2:
        for lib in db.q("SELECT * FROM libraries WHERE kind='serien'"):
            reclassify_library(lib)
        db.set_setting("classify_version", "2")
    if int(db.get_setting("schema_version", "1")) < 3:
        merge_libraries()
        db.set_setting("schema_version", "3")
    if int(db.get_setting("schema_version", "1")) < 5:
        db.run("UPDATE series SET details_done=0 WHERE tmdb_id IS NOT NULL")
    if int(db.get_setting("schema_version", "1")) < 4:
        db.run("UPDATE items SET details_done=0 WHERE tmdb_id IS NOT NULL")
        db.run("UPDATE series SET details_done=0 WHERE tmdb_id IS NOT NULL")
        db.set_setting("schema_version", "4")
    if int(db.get_setting("schema_version", "1")) < 5:
        db.set_setting("schema_version", "5")


def merge_libraries():
    """Ordner in library_paths übernehmen und gleichnamige Bibliotheken gleicher Art zusammenführen."""
    c = db.conn()
    for lib in db.q("SELECT * FROM libraries"):
        if lib["path"]:
            c.execute("INSERT OR IGNORE INTO library_paths(library_id,path) VALUES(?,?)", (lib["id"], lib["path"]))
    c.commit()
    groups = {}
    for lib in db.q("SELECT * FROM libraries ORDER BY id"):
        groups.setdefault((lib["name"].strip().lower(), lib["kind"]), []).append(lib)
    idmap = {}
    for libs in groups.values():
        keep = libs[0]
        for other in libs[1:]:
            idmap[other["id"]] = keep["id"]
            c.execute("UPDATE OR IGNORE library_paths SET library_id=? WHERE library_id=?", (keep["id"], other["id"]))
            c.execute("DELETE FROM library_paths WHERE library_id=?", (other["id"],))
            # Serien mit gleichem Namen vereinen
            for s_ in db.q("SELECT * FROM series WHERE library_id=?", (other["id"],)):
                dup = db.q1("SELECT id FROM series WHERE library_id=? AND name=?", (keep["id"], s_["name"]))
                if dup:
                    c.execute("UPDATE items SET series_id=? WHERE series_id=?", (dup["id"], s_["id"]))
                    c.execute("DELETE FROM series WHERE id=?", (s_["id"],))
                else:
                    c.execute("UPDATE series SET library_id=? WHERE id=?", (keep["id"], s_["id"]))
            c.execute("UPDATE items SET library_id=? WHERE library_id=?", (keep["id"], other["id"]))
            c.execute("DELETE FROM libraries WHERE id=?", (other["id"],))
        c.commit()
    # Freigaben der Benutzer auf die neuen Nummern umstellen
    if idmap:
        for u in db.q("SELECT id, libraries FROM users WHERE libraries IS NOT NULL"):
            try:
                ids = json.loads(u["libraries"])
            except Exception:
                continue
            new = sorted({idmap.get(i, i) for i in ids})
            c.execute("UPDATE users SET libraries=? WHERE id=?", (json.dumps(new), u["id"]))
        c.commit()
    # Anzeige-Ordner neu berechnen (bei mehreren Ordnern mit Ordnernamen davor)
    for lib in db.q("SELECT * FROM libraries"):
        rts = roots(lib)
        for it in db.q("SELECT id,path FROM items WHERE library_id=?", (lib["id"],)):
            _, _, shown = locate(rts, it["path"])
            c.execute("UPDATE items SET folder=? WHERE id=?", (shown, it["id"]))
        c.commit()


def series_id(lib_id, name, year):
    r = db.q1("SELECT id FROM series WHERE library_id=? AND name=?", (lib_id, name))
    if r:
        return r["id"]
    return db.run("INSERT INTO series(library_id,name,year) VALUES(?,?,?)", (lib_id, name, year))


# ---------------------------------------------------------------- Analyse

def ffprobe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", path],
        capture_output=True, timeout=60)
    return json.loads(out.stdout or b"{}")


def probe_item(item_id):
    it = db.q1("SELECT * FROM items WHERE id=?", (item_id,))
    if not it:
        return None
    try:
        data = ffprobe(it["path"])
    except Exception as e:
        log.warning("ffprobe fehlgeschlagen für %s: %s", it["path"], e)
        db.run("UPDATE items SET probed=2 WHERE id=?", (item_id,))
        return db.q1("SELECT * FROM items WHERE id=?", (item_id,))
    fmt = data.get("format", {})
    streams = data.get("streams", [])
    v = next((s for s in streams if s.get("codec_type") == "video"
              and not (s.get("disposition") or {}).get("attached_pic")), None)
    audio = []
    for s in streams:
        if s.get("codec_type") != "audio":
            continue
        tags = s.get("tags") or {}
        audio.append({"codec": s.get("codec_name"), "lang": tags.get("language", ""),
                      "title": tags.get("title", ""), "ch": s.get("channels", 2),
                      "default": (s.get("disposition") or {}).get("default", 0)})
    db.run("UPDATE items SET probed=1, duration=?, container=?, vcodec=?, width=?, height=?, "
           "audio=? WHERE id=?",
           (float(fmt.get("duration") or 0), fmt.get("format_name", ""),
            v.get("codec_name") if v else None, v.get("width") if v else None,
            v.get("height") if v else None, json.dumps(audio), item_id))
    return db.q1("SELECT * FROM items WHERE id=?", (item_id,))


def probe_pending():
    todo = db.q("SELECT id FROM items WHERE probed=0")
    status.update(phase="Dateien analysieren", done=0, total=len(todo))
    for r in todo:
        probe_item(r["id"])
        status["done"] += 1


# ---------------------------------------------------------------- TheMovieDB

IMG_BASE = "https://image.tmdb.org/t/p/"


def _tmdb_get(path, params):
    key = (db.get_setting("tmdb_key") or "").strip()
    if not key:
        return None
    headers = {}
    params = dict(params, language="de-DE")
    if len(key) > 40:
        headers["Authorization"] = f"Bearer {key}"
    else:
        params["api_key"] = key
    r = httpx.get("https://api.themoviedb.org/3" + path, params=params, headers=headers, timeout=15)
    if r.status_code == 429:
        time.sleep(2)
        return _tmdb_get(path, params)
    r.raise_for_status()
    return r.json()


def _save_image(tmdb_path, size):
    if not tmdb_path:
        return None
    name = f"{size}_{tmdb_path.strip('/')}"
    dest = os.path.join(db.DATA_DIR, "images", name)
    if not os.path.exists(dest):
        try:
            r = httpx.get(IMG_BASE + size + tmdb_path, timeout=30)
            r.raise_for_status()
            with open(dest, "wb") as f:
                f.write(r.content)
        except Exception as e:
            log.warning("Bild konnte nicht geladen werden: %s", e)
            return None
    return name


def tmdb_test():
    try:
        return _tmdb_get("/configuration", {}) is not None
    except Exception:
        return False


def fetch_metadata(force=False):
    if not db.get_setting("tmdb_key"):
        return
    where = " AND i.locked=0" + ("" if force else " AND i.meta_done=0")
    movies = db.q("SELECT i.id,i.title,i.year FROM items i JOIN libraries l ON l.id=i.library_id "
                  "WHERE i.kind='movie'" + where)
    shows = db.q("SELECT id,name,year FROM series WHERE locked=0" + ("" if force else " AND meta_done=0"))
    status.update(phase="Filminfos laden", done=0, total=len(movies) + len(shows))
    for m in movies:
        try:
            match_movie(m["id"], m["title"], m["year"])
        except Exception as e:
            log.warning("TMDB-Fehler bei %s: %s", m["title"], e)
        status["done"] += 1
    for s in shows:
        try:
            match_series(s["id"], s["name"], s["year"])
        except Exception as e:
            log.warning("TMDB-Fehler bei %s: %s", s["name"], e)
        status["done"] += 1
    fetch_details()


def _fsk_from(values):
    for v in values:
        v = (v or "").strip().replace("FSK", "").strip()
        if v.isdigit() and int(v) in (0, 6, 12, 16, 18):
            return int(v)
    return None


def _cast_list(credits):
    out = []
    for c in (credits or {}).get("cast", [])[:20]:
        role = c.get("character") or ""
        if not role and c.get("roles"):
            role = c["roles"][0].get("character") or ""
        out.append({"id": c.get("id"), "name": c.get("name"), "role": role, "img": c.get("profile_path")})
    crew = [c.get("name") for c in (credits or {}).get("crew", []) if c.get("job") == "Director"][:2]
    return out, crew


def _store_links(kind, ref_id, cast, genres, keywords, rec_ids):
    """Darsteller, Genres, Schlagwörter und Empfehlungen für Suche nach Person und ähnlichen Titeln speichern."""
    c = db.conn()
    c.execute("DELETE FROM people WHERE ref_kind=? AND ref_id=?", (kind, ref_id))
    c.execute("DELETE FROM tags WHERE ref_kind=? AND ref_id=?", (kind, ref_id))
    c.execute("DELETE FROM recs WHERE ref_kind=? AND ref_id=?", (kind, ref_id))
    for i, p in enumerate(cast):
        if p.get("id"):
            c.execute("INSERT INTO people(ref_kind,ref_id,person_id,name,role,img,ord) VALUES(?,?,?,?,?,?,?)",
                      (kind, ref_id, p["id"], p["name"], p["role"], p.get("img"), i))
    for g in genres:
        c.execute("INSERT INTO tags(ref_kind,ref_id,type,name) VALUES(?,?,'genre',?)", (kind, ref_id, g))
    for k in keywords:
        c.execute("INSERT INTO tags(ref_kind,ref_id,type,name) VALUES(?,?,'kw',?)", (kind, ref_id, k))
    for t in rec_ids:
        c.execute("INSERT INTO recs(ref_kind,ref_id,tmdb_id) VALUES(?,?,?)", (kind, ref_id, t))
    c.commit()


def _rec_ids(d):
    ids = [r["id"] for r in (d.get("recommendations") or {}).get("results", [])]
    ids += [r["id"] for r in (d.get("similar") or {}).get("results", [])]
    return list(dict.fromkeys(ids))[:60]


def movie_details(item_id, tmdb_id):
    d = _tmdb_get(f"/movie/{tmdb_id}", {"append_to_response": "credits,release_dates,keywords,recommendations,similar"}) or {}
    certs = []
    for r in (d.get("release_dates") or {}).get("results", []):
        if r.get("iso_3166_1") == "DE":
            certs = [x.get("certification") for x in r.get("release_dates", [])]
    cast, directors = _cast_list(d.get("credits"))
    genres = [g["name"] for g in d.get("genres", [])]
    kws = [k["name"] for k in (d.get("keywords") or {}).get("keywords", [])]
    db.run("UPDATE items SET fsk=?, cast=?, genres=?, details_done=1 WHERE id=?",
           (_fsk_from(certs), json.dumps({"cast": cast, "director": directors}, ensure_ascii=False),
            json.dumps(genres, ensure_ascii=False), item_id))
    _store_links("item", item_id, cast, genres, kws, _rec_ids(d))


def series_details(sid, tmdb_id):
    d = _tmdb_get(f"/tv/{tmdb_id}", {"append_to_response": "credits,content_ratings,keywords,recommendations,similar"}) or {}
    certs = [r.get("rating") for r in (d.get("content_ratings") or {}).get("results", [])
             if r.get("iso_3166_1") == "DE"]
    cast, _ = _cast_list(d.get("credits"))
    creators = [c.get("name") for c in d.get("created_by", [])][:2]
    fsk = _fsk_from(certs)
    genres = [g["name"] for g in d.get("genres", [])]
    kws = [k["name"] for k in (d.get("keywords") or {}).get("results", [])]
    db.run("UPDATE series SET fsk=?, cast=?, genres=?, details_done=1 WHERE id=?",
           (fsk, json.dumps({"cast": cast, "director": creators}, ensure_ascii=False),
            json.dumps(genres, ensure_ascii=False), sid))
    _store_links("series", sid, cast, genres, kws, _rec_ids(d))
    # Echte Folgentitel und Inhaltsangaben je vorhandener Staffel
    for row in db.q("SELECT DISTINCT season FROM items WHERE series_id=? AND season IS NOT NULL AND episode IS NOT NULL", (sid,)):
        try:
            sd = _tmdb_get(f"/tv/{tmdb_id}/season/{row['season']}", {}) or {}
        except Exception as e:
            log.info("Staffel %s nicht gefunden (%s)", row["season"], e)
            continue
        c = db.conn()
        for ep in sd.get("episodes", []):
            name = (ep.get("name") or "").strip()
            if re.match(r"^(Folge|Episode)\s*\d+$", name, re.I):
                name = ""
            c.execute("UPDATE items SET ep_name=?, overview=? WHERE series_id=? AND season=? AND episode=?",
                      (name or None, ep.get("overview") or None, sid, row["season"], ep.get("episode_number")))
        c.commit()
    db.run("UPDATE items SET fsk=? WHERE series_id=?", (fsk, sid))


def fetch_details():
    """Altersfreigabe (FSK), Darsteller und Genres für zugeordnete Titel nachladen."""
    movies = db.q("SELECT id, tmdb_id FROM items WHERE kind='movie' AND tmdb_id IS NOT NULL AND details_done=0 AND locked=0")
    shows = db.q("SELECT id, tmdb_id FROM series WHERE tmdb_id IS NOT NULL AND details_done=0 AND locked=0")
    status.update(phase="Altersfreigaben und Darsteller laden", done=0, total=len(movies) + len(shows))
    for m in movies:
        try:
            movie_details(m["id"], m["tmdb_id"])
        except Exception as e:
            log.warning("TMDB-Details fehlgeschlagen (%s): %s", m["tmdb_id"], e)
            db.run("UPDATE items SET details_done=1 WHERE id=?", (m["id"],))
        status["done"] += 1
    for sh in shows:
        try:
            series_details(sh["id"], sh["tmdb_id"])
        except Exception as e:
            log.warning("TMDB-Details fehlgeschlagen (%s): %s", sh["tmdb_id"], e)
            db.run("UPDATE series SET details_done=1 WHERE id=?", (sh["id"],))
        status["done"] += 1


def _num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _fps(r):
    try:
        a, b = r.split("/")
        return round(float(a) / float(b), 3) if float(b) else None
    except Exception:
        return None


def media_details(item):
    """Kapitel und ausführliche Medieninformationen (einmal lesen, dann gespeichert)."""
    if item.get("mediainfo") and item.get("chapters") is not None:
        try:
            return json.loads(item["chapters"]), json.loads(item["mediainfo"])
        except Exception:
            pass
    chs, info = [], {}
    try:
        r = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams",
                            "-show_chapters", item["path"]], capture_output=True, timeout=60)
        data = json.loads(r.stdout or b"{}")
        for ch in data.get("chapters", []):
            chs.append({"start": round(float(ch.get("start_time", 0)), 2),
                        "title": (ch.get("tags") or {}).get("title", "")})
        fmt = data.get("format", {})
        info = {"container": (fmt.get("format_long_name") or fmt.get("format_name") or ""),
                "bitrate": _num(fmt.get("bit_rate")), "video": [], "audio": [], "subs": [], "images": []}
        for st in data.get("streams", []):
            tags = st.get("tags") or {}
            disp = st.get("disposition") or {}
            bps = _num(st.get("bit_rate")) or _num(tags.get("BPS")) or _num(tags.get("BPS-eng"))
            base = {"codec": (st.get("codec_name") or "").upper(), "tag": None if (st.get("codec_tag_string") or "").startswith("[0]") else st.get("codec_tag_string"),
                    "profile": st.get("profile"), "title": tags.get("title"), "lang": tags.get("language"),
                    "default": bool(disp.get("default")), "bitrate": bps}
            t = st.get("codec_type")
            if t == "video" and disp.get("attached_pic"):
                info["images"].append(dict(base, width=st.get("width"), height=st.get("height")))
            elif t == "video":
                info["video"].append(dict(base, level=st.get("level"), width=st.get("width"), height=st.get("height"),
                                          aspect=st.get("display_aspect_ratio"), fps=_fps(st.get("avg_frame_rate") or st.get("r_frame_rate")),
                                          interlaced=st.get("field_order") not in (None, "progressive", "unknown"),
                                          primaries=st.get("color_primaries"), space=st.get("color_space"),
                                          transfer=st.get("color_transfer"), pix_fmt=st.get("pix_fmt"),
                                          bits=st.get("bits_per_raw_sample"), refs=st.get("refs")))
            elif t == "audio":
                info["audio"].append(dict(base, layout=st.get("channel_layout"), channels=st.get("channels"),
                                          rate=_num(st.get("sample_rate"))))
            elif t == "subtitle":
                info["subs"].append(dict(base, forced=bool(disp.get("forced"))))
    except Exception as e:
        log.warning("Medieninfo konnte nicht gelesen werden: %s", e)
    db.run("UPDATE items SET chapters=?, mediainfo=? WHERE id=?", (json.dumps(chs), json.dumps(info), item["id"]))
    return chs, info


def chapters(item):
    return media_details(item)[0]

def match_movie(item_id, title, year, tmdb_id=None):
    if tmdb_id:
        res = _tmdb_get(f"/movie/{tmdb_id}", {})
    else:
        params = {"query": title}
        if year:
            params["year"] = year
        data = _tmdb_get("/search/movie", params) or {}
        results = data.get("results") or []
        if not results and year:
            data = _tmdb_get("/search/movie", {"query": title}) or {}
            results = data.get("results") or []
        res = results[0] if results else None
    if not res:
        db.run("UPDATE items SET meta_done=1 WHERE id=?", (item_id,))
        return False
    y = (res.get("release_date") or "")[:4]
    db.run("UPDATE items SET tmdb_id=?, title=?, sort_title=?, year=?, overview=?, poster=?, "
           "backdrop=?, meta_done=1, details_done=0 WHERE id=?",
           (res["id"], res.get("title") or title, sort_key(res.get("title") or title),
            int(y) if y.isdigit() else year, res.get("overview"),
            _save_image(res.get("poster_path"), "w342"),
            _save_image(res.get("backdrop_path"), "w1280"), item_id))
    return True


def match_series(sid, name, year, tmdb_id=None):
    if tmdb_id:
        res = _tmdb_get(f"/tv/{tmdb_id}", {})
    else:
        params = {"query": name}
        if year:
            params["first_air_date_year"] = year
        data = _tmdb_get("/search/tv", params) or {}
        results = data.get("results") or []
        res = results[0] if results else None
    if not res:
        db.run("UPDATE series SET meta_done=1 WHERE id=?", (sid,))
        return False
    y = (res.get("first_air_date") or "")[:4]
    db.run("UPDATE series SET tmdb_id=?, overview=?, poster=?, backdrop=?, year=?, meta_done=1, details_done=0 "
           "WHERE id=?",
           (res["id"], res.get("overview"), _save_image(res.get("poster_path"), "w342"),
            _save_image(res.get("backdrop_path"), "w1280"),
            int(y) if y.isdigit() else year, sid))
    return True


def tmdb_search(kind, query):
    path = "/search/tv" if kind == "serie" else "/search/movie"
    data = _tmdb_get(path, {"query": query}) or {}
    out = []
    for r in (data.get("results") or [])[:10]:
        out.append({"id": r["id"], "title": r.get("title") or r.get("name"),
                    "year": (r.get("release_date") or r.get("first_air_date") or "")[:4],
                    "poster": (IMG_BASE + "w154" + r["poster_path"]) if r.get("poster_path") else None})
    return out


# ---------------------------------------------------------------- Vorschaubilder

def thumbnail(item):
    dest = os.path.join(db.DATA_DIR, "thumbs", f"{item['id']}.jpg")
    if os.path.exists(dest):
        return dest
    dur = item.get("duration") or 0
    pos = max(5, dur * 0.15) if dur else 30
    for p in (pos, 5, 0):
        try:
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(p), "-i", item["path"],
                            "-frames:v", "1", "-vf", "scale=480:-2", "-q:v", "4", dest],
                           capture_output=True, timeout=60)
        except Exception:
            pass
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            return dest
    return None

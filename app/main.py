"""Kinowerk – eigener Videoserver (übernommen aus Ernsthafte Mediathek 0.8.9)."""
import asyncio
import hashlib
import json
import logging
import os
import secrets
import threading
import time
from contextlib import asynccontextmanager
from typing import Optional

import httpx
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

import ipaddress
import zlib

from . import cast, db, library, livetv, lookup, transcode

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("mediathek")

WEB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "web")
MEDIA_ROOT = os.environ.get("MEDIATHEK_MEDIA", "/media")
COOKIE = "mt_session"
SESSION_DAYS = 90
VERSION = "1.0.0"
APP_NAME = "Kinowerk"

@asynccontextmanager
async def lifespan(_app):
    db.init()
    library.migrate()
    jellyfin.init()
    jellyfin.discovery_thread(int(os.environ.get("PORT", "8080")))
    threading.Thread(target=transcode.reaper, daemon=True).start()
    threading.Thread(target=_auto_scan, daemon=True).start()
    yield
    for sid in list(transcode.sessions):
        transcode.stop(sid)


app = FastAPI(title="Kinowerk", docs_url=None, redoc_url=None, lifespan=lifespan)


def _auto_scan():
    """Beim Start und danach alle 6 Stunden neue Filme suchen."""
    time.sleep(5)
    while True:
        if db.q1("SELECT id FROM libraries"):
            library.scan_all()
        time.sleep(6 * 3600)


# ---------------------------------------------------------------- Anmeldung

def hash_pw(pw: str) -> str:
    salt = secrets.token_bytes(16)
    h = hashlib.scrypt(pw.encode(), salt=salt, n=2 ** 14, r=8, p=1)
    return salt.hex() + ":" + h.hex()


def verify_pw(pw: str, stored: str) -> bool:
    try:
        salt, h = stored.split(":")
        test = hashlib.scrypt(pw.encode(), salt=bytes.fromhex(salt), n=2 ** 14, r=8, p=1)
        return secrets.compare_digest(test.hex(), h)
    except Exception:
        return False


def current_user(request: Request) -> Optional[dict]:
    tok = request.cookies.get(COOKIE)
    if not tok:
        return None
    s = db.q1("SELECT * FROM sessions WHERE token=?", (tok,))
    if not s or time.time() - s["created"] > SESSION_DAYS * 86400:
        return None
    u = db.q1("SELECT id,name,is_admin,libraries,max_fsk,prefs,need_device,allow_sat FROM users WHERE id=?", (s["user_id"],))
    if not u:
        return None
    if s.get("device_id"):
        d = db.q1("SELECT * FROM devices WHERE id=?", (s["device_id"],))
        if u["need_device"] and (not d or not d["approved"]):
            return None
        if d and time.time() - (d["last_seen"] or 0) > 300:
            db.run("UPDATE devices SET last_seen=?, ip=? WHERE id=?",
                   (time.time(), client_ip(request), d["id"]))
    elif u["need_device"]:
        return None
    return u


def fsk_sql(u, alias="i", extra=None):
    """SQL-Bedingung für die Altersfreigabe des Benutzers (und ggf. eines gewählten Filters)."""
    limits = [x for x in (u.get("max_fsk"), extra) if x is not None]
    if not limits:
        return "", []
    return f" AND {alias}.fsk IS NOT NULL AND {alias}.fsk <= ?", [min(limits)]


def fsk_ok(u, fsk):
    return u.get("max_fsk") is None or (fsk is not None and fsk <= u["max_fsk"])


def user_required(request: Request) -> dict:
    u = current_user(request)
    if not u:
        raise HTTPException(401, "Nicht angemeldet")
    return u


def admin_required(u: dict = Depends(user_required)) -> dict:
    if not u["is_admin"]:
        raise HTTPException(403, "Nur für Administratoren")
    return u


def allowed_libs(u) -> list:
    ids = [r["id"] for r in db.q("SELECT id FROM libraries")]
    if u["libraries"]:
        try:
            allowed = set(json.loads(u["libraries"]))
            ids = [i for i in ids if i in allowed]
        except Exception:
            pass
    return ids


def check_lib(u, lib_id):
    if lib_id not in allowed_libs(u):
        raise HTTPException(404, "Nicht gefunden")


def device_name(ua: str) -> str:
    ua = ua or ""
    for key, name in (("Web0S", "LG-Fernseher"), ("webOS", "LG-Fernseher"), ("Tizen", "Samsung-Fernseher"),
                      ("iPad", "iPad"), ("iPhone", "iPhone"), ("Android", "Android-Gerät"),
                      ("Macintosh", "Mac"), ("Windows", "Windows-PC"), ("Linux", "Linux-PC")):
        if key in ua:
            return name
    return "Unbekanntes Gerät"


def register_device(user, token, request, approve_first=True):
    """Gerät merken. Rückgabe: (device_row, freigegeben?)"""
    if not token or len(token) < 16:
        raise HTTPException(400, "Gerätekennung fehlt – bitte Seite neu laden")
    d = db.q1("SELECT * FROM devices WHERE token=? AND user_id=?", (token, user["id"]))
    if not d:
        has_any = db.q1("SELECT id FROM devices WHERE user_id=? AND approved=1", (user["id"],))
        approved = 1 if (not user["need_device"] or (approve_first and not has_any)) else 0
        did = db.run("INSERT INTO devices(user_id,token,name,approved,created,last_seen,ip) VALUES(?,?,?,?,?,?,?)",
                     (user["id"], token, device_name(request.headers.get("user-agent", "")), approved,
                      time.time(), time.time(), client_ip(request)))
        d = db.q1("SELECT * FROM devices WHERE id=?", (did,))
    return d, bool(d["approved"]) or not user["need_device"]


def is_https(request: Request) -> bool:
    return (request.headers.get("x-forwarded-proto", "").lower() == "https"
            or request.url.scheme == "https")


def client_ip(request: Request) -> str:
    """Echte Absenderadresse – auch hinter dem Reverse Proxy der Synology.
    Weitergeleitete Adressen werden nur geglaubt, wenn die Anfrage aus dem Heimnetz (vom Proxy) kommt."""
    direct = request.client.host if request.client else ""
    try:
        trusted = ipaddress.ip_address(direct).is_private or ipaddress.ip_address(direct).is_loopback
    except ValueError:
        trusted = False
    if trusted:
        v = request.headers.get("x-real-ip")
        if v:
            return v.strip()
        v = request.headers.get("x-forwarded-for")
        if v:
            return v.split(",")[-1].strip()   # letzter Eintrag stammt vom Proxy selbst
    return direct


def is_remote(request: Request) -> bool:
    try:
        ip = ipaddress.ip_address(client_ip(request))
        return not (ip.is_private or ip.is_loopback or ip.is_link_local)
    except ValueError:
        return False


_pending_cookie_secure = {}


def _login_response(user_id, device_id=None, request: Request = None):
    tok = secrets.token_urlsafe(32)
    db.run("INSERT INTO sessions(token,user_id,created,device_id) VALUES(?,?,?,?)",
           (tok, user_id, time.time(), device_id))
    resp = JSONResponse({"ok": True})
    resp.set_cookie(COOKIE, tok, max_age=SESSION_DAYS * 86400, httponly=True, samesite="lax",
                    secure=bool(request is not None and is_https(request)))
    return resp


@app.get("/api/status")
def status(request: Request):
    u = current_user(request)
    user = None
    if u:
        user = {"name": u["name"], "admin": bool(u["is_admin"]), "max_fsk": u["max_fsk"],
                "allow_sat": bool(u["is_admin"] or u["allow_sat"]),
                "prefs": json.loads(u["prefs"] or "{}")}
        if u["is_admin"]:
            user["pending_devices"] = db.q1("SELECT COUNT(*) n FROM devices WHERE approved=0")["n"]
    return {"setup": db.q1("SELECT id FROM users") is None, "version": VERSION, "name": APP_NAME,
            "user": user, "remote": is_remote(request)}


@app.post("/api/setup")
async def setup(request: Request):
    if db.q1("SELECT id FROM users"):
        raise HTTPException(400, "Bereits eingerichtet")
    body = await request.json()
    name, pw = (body.get("name") or "").strip(), body.get("password") or ""
    if not name or len(pw) < 6:
        raise HTTPException(400, "Name und ein Passwort mit mindestens 6 Zeichen angeben")
    uid = db.run("INSERT INTO users(name,pw,is_admin,need_device) VALUES(?,?,1,0)", (name, hash_pw(pw)))
    u = db.q1("SELECT * FROM users WHERE id=?", (uid,))
    d = None
    if body.get("device"):
        d, _ = register_device(u, body["device"], request)
    return _login_response(uid, d["id"] if d else None, request)


_fails = {}


@app.post("/api/login")
async def login(request: Request):
    ip = client_ip(request) or "?"
    n, t = _fails.get(ip, (0, 0))
    if n >= 5 and time.time() - t < 300:
        raise HTTPException(429, "Zu viele Fehlversuche – bitte 5 Minuten warten")
    body = await request.json()
    uname = (body.get("name") or "").strip().lower()
    un, ut = _fails.get("user:" + uname, (0, 0))
    if un >= 10 and time.time() - ut < 900:
        raise HTTPException(429, "Zu viele Fehlversuche für diesen Namen – bitte 15 Minuten warten")
    u = db.q1("SELECT * FROM users WHERE name=? COLLATE NOCASE", ((body.get("name") or "").strip(),))
    if u and not u["pw"]:
        # Passwort wird bei der ersten Anmeldung selbst vergeben
        return {"need_password": True}
    if not u or not verify_pw(body.get("password") or "", u["pw"]):
        _fails[ip] = (n + 1, time.time())
        _fails["user:" + uname] = (un + 1, time.time())
        await asyncio.sleep(1)
        raise HTTPException(401, "Name oder Passwort falsch")
    _fails.pop(ip, None)
    _fails.pop("user:" + uname, None)
    d, ok = register_device(u, body.get("device"), request)
    if not ok:
        return JSONResponse({"pending": True, "detail": "Dieses Gerät ist noch nicht freigegeben. "
                             "Bitte beim Administrator melden."}, status_code=403)
    return _login_response(u["id"], d["id"], request)


@app.post("/api/first_password")
async def first_password(request: Request):
    body = await request.json()
    u = db.q1("SELECT * FROM users WHERE name=? COLLATE NOCASE", ((body.get("name") or "").strip(),))
    if not u or u["pw"]:
        raise HTTPException(400, "Für diesen Namen ist bereits ein Passwort vergeben")
    pw = body.get("password") or ""
    if len(pw) < 6:
        raise HTTPException(400, "Das Passwort braucht mindestens 6 Zeichen")
    db.run("UPDATE users SET pw=? WHERE id=?", (hash_pw(pw), u["id"]))
    u = db.q1("SELECT * FROM users WHERE id=?", (u["id"],))
    d, ok = register_device(u, body.get("device"), request)
    if not ok:
        # Passwort-Zurücksetzen auf einem fremden Gerät: Gerät muss trotzdem freigegeben werden
        return JSONResponse({"pending": True, "detail": "Passwort gespeichert. Dieses Gerät muss noch "
                             "vom Administrator freigegeben werden."}, status_code=403)
    return _login_response(u["id"], d["id"], request)


@app.post("/api/logout")
def logout(request: Request):
    tok = request.cookies.get(COOKIE)
    if tok:
        db.run("DELETE FROM sessions WHERE token=?", (tok,))
    resp = JSONResponse({"ok": True})
    resp.delete_cookie(COOKIE)
    return resp


# ---------------------------------------------------------------- Mein Konto

@app.post("/api/me/password")
async def me_password(request: Request, u=Depends(user_required)):
    b = await request.json()
    full = db.q1("SELECT * FROM users WHERE id=?", (u["id"],))
    if not verify_pw(b.get("old") or "", full["pw"]):
        raise HTTPException(400, "Bisheriges Passwort stimmt nicht")
    if len(b.get("new") or "") < 6:
        raise HTTPException(400, "Das neue Passwort braucht mindestens 6 Zeichen")
    db.run("UPDATE users SET pw=? WHERE id=?", (hash_pw(b["new"]), u["id"]))
    tok = request.cookies.get(COOKIE)
    db.run("DELETE FROM sessions WHERE user_id=? AND token<>?", (u["id"], tok))
    return {"ok": True}


@app.post("/api/me/prefs")
async def me_prefs(request: Request, u=Depends(user_required)):
    b = await request.json()
    prefs = json.loads(u["prefs"] or "{}")
    for k in ("audio_lang", "quality", "quality_remote", "subtitles"):
        if k in b:
            prefs[k] = b[k]
    db.run("UPDATE users SET prefs=? WHERE id=?", (json.dumps(prefs), u["id"]))
    return prefs


@app.get("/api/me/devices")
def me_devices(request: Request, u=Depends(user_required)):
    tok = request.cookies.get(COOKIE)
    s = db.q1("SELECT device_id FROM sessions WHERE token=?", (tok,)) or {}
    return [dict(d, current=(d["id"] == s.get("device_id")), token=None)
            for d in db.q("SELECT * FROM devices WHERE user_id=? ORDER BY last_seen DESC", (u["id"],))]


# ---------------------------------------------------------------- Bibliothek

import re as _re

def source_of(path):
    """Herkunft aus dem Ordner bzw. Dateinamen ableiten (Blu-ray, DVD, Stream)."""
    parts = [p.lower() for p in (path or "").split("/")]
    for p in reversed(parts[:-1]):
        if p in ("bd", "blu-ray", "bluray", "blu ray") or p.startswith("bd_") or p.endswith("_bd"):
            return "Blu-ray"
        if p == "dvd" or p.startswith("dvd_") or p.endswith("_dvd") or p.startswith("filme_dvd") or p.startswith("serien_dvd"):
            return "DVD"
        if p.startswith("stream"):
            return "Stream"
    name = parts[-1] if parts else ""
    if _re.search(r"blu-?ray|bdrip|remux", name):
        return "Blu-ray"
    if _re.search(r"dvdrip|\bdvd\b", name):
        return "DVD"
    if _re.search(r"web-?dl|webrip|\bweb\b", name):
        return "Stream"
    return None


SRC_RANK = {"Blu-ray": 3, "Stream": 2, "DVD": 1}


def _quality(it):
    return ((it.get("height") or 0), SRC_RANK.get(source_of(it.get("path")), 0), (it.get("size") or 0))


def _group_key(it):
    if it.get("kind") == "movie" and it.get("tmdb_id"):
        return ("m", it["tmdb_id"])
    if it.get("kind") == "episode" and it.get("series_id") and it.get("episode") is not None:
        return ("e", it["series_id"], it.get("season"), it["episode"])
    return ("i", it["id"])


def collapse(items):
    """Mehrere Fassungen desselben Films / derselben Folge zu einem Eintrag (beste Qualität) zusammenfassen."""
    groups, order = {}, []
    for it in items:
        k = _group_key(it)
        if k not in groups:
            groups[k] = [it]
            order.append(k)
        else:
            groups[k].append(it)
    out = []
    for k in order:
        g = groups[k]
        best = max(g, key=_quality)
        best = dict(best, _versions=len(g), _ids=[x["id"] for x in g])
        out.append(best)
    return out


def siblings(it, u=None):
    """Alle Fassungen zu einem Eintrag (inkl. sich selbst)."""
    if it.get("kind") == "movie" and it.get("tmdb_id"):
        rows = db.q("SELECT * FROM items WHERE kind='movie' AND tmdb_id=?", (it["tmdb_id"],))
    elif it.get("kind") == "episode" and it.get("series_id") and it.get("episode") is not None:
        rows = db.q("SELECT * FROM items WHERE series_id=? AND season IS ? AND episode=?",
                    (it["series_id"], it.get("season"), it["episode"]))
    else:
        rows = [it]
    if u is not None:
        libs = set(allowed_libs(u))
        rows = [r for r in rows if r["library_id"] in libs and fsk_ok(u, r["fsk"])]
    return rows or [it]


def _card(it, prog=None):
    """Kompakte Darstellung eines Eintrags für Übersichten."""
    p = prog or {}
    title = it.get("ep_name") or it["title"] if it.get("kind") == "episode" else it["title"]
    return {"id": it["id"], "type": it["kind"], "title": title, "year": it.get("year"),
            "poster": it.get("poster"), "backdrop": it.get("backdrop"),
            "duration": it.get("duration"), "position": p.get("position"),
            "watched": bool(p.get("watched")), "season": it.get("season"),
            "episode": it.get("episode"), "series_id": it.get("series_id"),
            "series_name": it.get("series_name"), "added": it.get("added"),
            "sort": it.get("sort_title"), "fsk": it.get("fsk"), "src": source_of(it.get("path")),
            "versions": it.get("_versions", 1), "file": os.path.basename(it.get("path") or ""),
            "folder": it.get("folder"), "height": it.get("height")}


def _progress_map(uid, ids):
    if not ids:
        return {}
    marks = ",".join("?" * len(ids))
    rows = db.q(f"SELECT * FROM progress WHERE user_id=? AND item_id IN ({marks})", (uid, *ids))
    return {r["item_id"]: r for r in rows}


def _cards(uid, items):
    """Fassungen zusammenfassen und Karten mit Fortschritt (aus irgendeiner Fassung) bauen."""
    items = collapse(items)
    all_ids = [i for it in items for i in it["_ids"]]
    pm = _progress_map(uid, all_ids)
    out = []
    for it in items:
        progs = [pm[i] for i in it["_ids"] if i in pm]
        p = max(progs, key=lambda r: r["updated"] or 0) if progs else None
        out.append(_card(it, p))
    return out


@app.get("/api/libraries")
def libraries(u=Depends(user_required)):
    ids = allowed_libs(u)
    out = []
    for lib in db.q("SELECT * FROM libraries ORDER BY sort, name"):
        if lib["id"] in ids:
            n = db.q1("SELECT COUNT(DISTINCT CASE WHEN kind='movie' AND tmdb_id IS NOT NULL THEN 'm'||tmdb_id "
                      "ELSE 'i'||id END) n FROM items WHERE library_id=?", (lib["id"],))["n"]
            out.append({"id": lib["id"], "name": lib["name"], "kind": lib["kind"], "count": n})
    return out


@app.get("/api/home")
def home(u=Depends(user_required)):
    ids = allowed_libs(u)
    if not ids:
        return {"continue": [], "rows": []}
    marks = ",".join("?" * len(ids))
    fs, fa = fsk_sql(u)
    cont = db.q(
        f"SELECT i.*, s.name series_name, p.position, p.watched FROM progress p "
        f"JOIN items i ON i.id=p.item_id LEFT JOIN series s ON s.id=i.series_id "
        f"WHERE p.user_id=? AND p.watched=0 AND p.position>30 AND i.library_id IN ({marks}){fs} "
        f"ORDER BY p.updated DESC LIMIT 20", (u["id"], *ids, *fa))
    rows = []
    for lib in db.q(f"SELECT * FROM libraries WHERE id IN ({marks}) ORDER BY sort, name", ids):
        if lib["kind"] == "serien":
            # Serien als eine Kachel je Serie, zuletzt ergänzte zuerst
            sfs, sfa = fsk_sql(u, "s")
            shows = db.q("SELECT s.*, MAX(i.added) last, COUNT(i.id) n FROM series s JOIN items i ON i.series_id=s.id "
                         f"WHERE s.library_id=?{sfs} GROUP BY s.id ORDER BY last DESC LIMIT 20", (lib["id"], *sfa))
            rows.append({"library": {"id": lib["id"], "name": lib["name"], "kind": lib["kind"]},
                         "items": [{"id": x["id"], "type": "series", "title": x["name"], "year": x["year"],
                                    "poster": x["poster"], "count": x["n"]} for x in shows]})
            continue
        items = db.q(f"SELECT * FROM items i WHERE library_id=?{fs} ORDER BY added DESC LIMIT 30",
                     (lib["id"], *fa))
        rows.append({"library": {"id": lib["id"], "name": lib["name"], "kind": lib["kind"]},
                     "items": _cards(u["id"], items)[:20]})
    seen, conts = set(), []
    for c_ in cont:
        k = _group_key(c_)
        if k not in seen:
            seen.add(k)
            conts.append(_card(c_, c_))
    return {"continue": conts, "rows": rows}


@app.get("/api/library/{lib_id}")
def library_view(lib_id: int, sort: str = "title", q: str = "", folder: Optional[str] = None,
                 fsk: Optional[int] = None, u=Depends(user_required)):
    check_lib(u, lib_id)
    lib = db.q1("SELECT * FROM libraries WHERE id=?", (lib_id,))
    order = {"title": "sort_title COLLATE NOCASE", "added": "added DESC",
             "year": "year DESC, sort_title"}.get(sort, "sort_title")
    if lib["kind"] == "serien":
        sorder = {"title": "name COLLATE NOCASE", "year": "year DESC, name",
                  "added": "(SELECT MAX(added) FROM items WHERE series_id=series.id) DESC",
                  "seen": "seen DESC"}.get(sort, "name")
        sfs, sfa = fsk_sql(u, "series", fsk)
        args = [u["id"], lib_id]
        where = "library_id=?" + sfs
        args += sfa
        if q:
            where += " AND name LIKE ?"
            args.append(f"%{q}%")
        # Ordner bei Serien: bei mehreren Bibliotheksordnern der jeweilige Ordner (Serienordner liegen darunter)
        rts = library.roots(lib)
        groups = []
        if len(rts) > 1:
            groups = sorted({(r["folder"] or "").split("/")[0] for r in db.q(
                "SELECT DISTINCT folder FROM items WHERE library_id=?", (lib_id,)) if r["folder"]})
            if folder:
                where += " AND id IN (SELECT series_id FROM items WHERE library_id=? AND (folder=? OR folder LIKE ?))"
                args += [lib_id, folder, folder + "/%"]
        if sort == "seen":
            where += " AND seen IS NOT NULL"
        series = db.q(f"SELECT * FROM (SELECT *, (SELECT COUNT(*) FROM items WHERE series_id=series.id) n, "
                      f"(SELECT MAX(p.updated) FROM progress p JOIN items i ON i.id=p.item_id "
                      f" WHERE i.series_id=series.id AND p.user_id=?) seen FROM series) series "
                      f"WHERE {where} ORDER BY {sorder}", args)
        return {"library": lib, "folders": groups, "series": [
            {"id": s["id"], "title": s["name"], "year": s["year"], "poster": s["poster"],
             "count": s["n"], "fsk": s["fsk"], "sort": library.sort_key(s["name"])} for s in series]}
    ifs, ifa = fsk_sql(u, "items", fsk)
    args = [u["id"], lib_id, *ifa]
    where = "library_id=?" + ifs
    if q:
        where += " AND title LIKE ?"
        args.append(f"%{q}%")
    if folder is not None:
        where += " AND folder=?"
        args.append(folder)
    if sort == "seen":
        where += " AND seen IS NOT NULL"
        order = "seen DESC"
    items = db.q(f"SELECT * FROM (SELECT items.*, (SELECT updated FROM progress p WHERE p.item_id=items.id AND p.user_id=?) seen "
                 f"FROM items) items WHERE {where} ORDER BY {order}", args)
    folders = [r["folder"] for r in db.q(
        "SELECT DISTINCT folder FROM items WHERE library_id=? AND folder<>'' ORDER BY folder", (lib_id,))]
    return {"library": lib, "items": _cards(u["id"], items), "folders": folders}


@app.get("/api/series/{sid}")
def series_view(sid: int, u=Depends(user_required)):
    s = db.q1("SELECT * FROM series WHERE id=?", (sid,))
    if not s:
        raise HTTPException(404)
    check_lib(u, s["library_id"])
    if not fsk_ok(u, s["fsk"]):
        raise HTTPException(404)
    eps = db.q("SELECT * FROM items WHERE series_id=? ORDER BY season, episode, sort_title", (sid,))
    eps = [e for e in eps if e["library_id"] in allowed_libs(u)]
    s["cast"] = json.loads(s["cast"] or "null")
    s["genres"] = json.loads(s["genres"] or "[]")
    seasons = {}
    for c_ in _cards(u["id"], eps):
        seasons.setdefault(c_["season"] or 0, []).append(c_)
    return {"series": s, "seasons": [{"season": k, "episodes": v} for k, v in sorted(seasons.items())]}


@app.get("/api/item/{item_id}")
def item_view(item_id: int, u=Depends(user_required)):
    it = db.q1("SELECT * FROM items WHERE id=?", (item_id,))
    if not it:
        raise HTTPException(404)
    check_lib(u, it["library_id"])
    if not fsk_ok(u, it["fsk"]):
        raise HTTPException(404)
    if not it["probed"]:
        it = library.probe_item(item_id)
    chapters, media = library.media_details(it)
    sibs = siblings(it, u)
    sib_ids = [x["id"] for x in sibs]
    marks = ",".join("?" * len(sib_ids))
    prog = db.q1(f"SELECT * FROM progress WHERE user_id=? AND item_id IN ({marks}) ORDER BY updated DESC",
                 (u["id"], *sib_ids)) or {}
    series = db.q1("SELECT * FROM series WHERE id=?", (it["series_id"],)) if it["series_id"] else None
    nxt = None
    if series:
        nxt = db.q1("SELECT id,title,season,episode FROM items WHERE series_id=? AND "
                    "(season>? OR (season=? AND episode>?)) ORDER BY season, episode LIMIT 1",
                    (series["id"], it["season"] or 0, it["season"] or 0, it["episode"] or 0))
    return {
        "id": it["id"], "type": it["kind"], "title": (it["ep_name"] or it["title"]) if it["kind"] == "episode" else it["title"],
        "year": it["year"], "src": source_of(it["path"]),
        "versions": [{"id": x["id"], "src": source_of(x["path"]), "height": x["height"], "size": x["size"],
                      "vcodec": x["vcodec"], "folder": x["folder"], "file": os.path.basename(x["path"]),
                      "duration": x["duration"]} for x in sorted(sibs, key=_quality, reverse=True)],
        "overview": it["overview"] or (series or {}).get("overview"),
        "poster": it["poster"] or (series or {}).get("poster"),
        "backdrop": it["backdrop"] or (series or {}).get("backdrop"),
        "duration": it["duration"], "width": it["width"], "height": it["height"],
        "vcodec": it["vcodec"], "audio": json.loads(it["audio"] or "[]"),
        "file": os.path.basename(it["path"]), "folder": it["folder"], "size": it["size"],
        "position": prog.get("position"), "watched": bool(prog.get("watched")),
        "series": {"id": series["id"], "name": series["name"]} if series else None,
        "season": it["season"], "episode": it["episode"], "next": nxt,
        "library_id": it["library_id"], "tmdb_id": it["tmdb_id"],
        "fsk": it["fsk"], "chapters": chapters, "media": media, "path": it["path"],
        "mtime": it["mtime"], "added": it["added"],
        "cast": json.loads(it["cast"] or (series or {}).get("cast") or "null"),
        "genres": json.loads(it["genres"] or (series or {}).get("genres") or "[]"),
    }


@app.get("/api/search")
def search(q: str, u=Depends(user_required)):
    ids = allowed_libs(u)
    if not ids or len(q) < 2:
        return {"items": [], "series": []}
    marks = ",".join("?" * len(ids))
    fs, fa = fsk_sql(u, "items")
    sfs, sfa = fsk_sql(u, "series")
    items = db.q(f"SELECT * FROM items WHERE kind<>'episode' AND title LIKE ? AND library_id IN ({marks}){fs} "
                 f"ORDER BY sort_title LIMIT 60", (f"%{q}%", *ids, *fa))
    series = db.q(f"SELECT * FROM series WHERE name LIKE ? AND library_id IN ({marks}){sfs} LIMIT 30",
                  (f"%{q}%", *ids, *sfa))
    return {"items": _cards(u["id"], items),
            "series": [{"id": s["id"], "title": s["name"], "year": s["year"], "poster": s["poster"]}
                       for s in series]}


@app.get("/api/person_img")
async def person_img(p: str, u=Depends(user_required)):
    import re as _re
    if not _re.match(r"^/[\w\-]+\.(jpg|jpeg|png)$", p):
        raise HTTPException(400)
    name = await asyncio.to_thread(library._save_image, p, "w185")
    if not name:
        raise HTTPException(404)
    return FileResponse(os.path.join(db.DATA_DIR, "images", name), headers={"Cache-Control": "max-age=2592000"})


def _visible_items(u, ids_sql, args):
    """Einträge laden und auf freigegebene Bibliotheken und Altersfreigabe beschränken."""
    libs = allowed_libs(u)
    if not libs:
        return []
    marks = ",".join("?" * len(libs))
    fs, fa = fsk_sql(u, "items")
    return db.q(f"SELECT * FROM items WHERE id IN ({ids_sql}) AND library_id IN ({marks}){fs}", (*args, *libs, *fa))


def _visible_series(u, ids_sql, args):
    libs = allowed_libs(u)
    if not libs:
        return []
    marks = ",".join("?" * len(libs))
    fs, fa = fsk_sql(u, "series")
    return db.q(f"SELECT * FROM series WHERE id IN ({ids_sql}) AND library_id IN ({marks}){fs}", (*args, *libs, *fa))


def _series_card(s_):
    return {"id": s_["id"], "type": "series", "title": s_["name"], "year": s_["year"], "poster": s_["poster"],
            "fsk": s_["fsk"], "sort": library.sort_key(s_["name"])}


@app.get("/api/person/{pid}")
def person(pid: int, u=Depends(user_required)):
    rows = db.q("SELECT * FROM people WHERE person_id=? ORDER BY ord", (pid,))
    if not rows:
        raise HTTPException(404)
    items = _visible_items(u, "SELECT ref_id FROM people WHERE person_id=? AND ref_kind='item'", (pid,))
    shows = _visible_series(u, "SELECT ref_id FROM people WHERE person_id=? AND ref_kind='series'", (pid,))
    roles = {(r["ref_kind"], r["ref_id"]): r["role"] for r in rows}
    img = next((r["img"] for r in rows if r["img"]), None)
    items.sort(key=lambda i: -(i["year"] or 0))
    return {"name": rows[0]["name"], "img": img,
            "items": [dict(c_, role=roles.get(("item", c_["id"]))) for c_ in _cards(u["id"], items)],
            "series": [dict(_series_card(x), role=roles.get(("series", x["id"]))) for x in shows]}


@app.get("/api/genre")
def genre(name: str, u=Depends(user_required)):
    items = _visible_items(u, "SELECT ref_id FROM tags WHERE type='genre' AND name=? AND ref_kind='item'", (name,))
    shows = _visible_series(u, "SELECT ref_id FROM tags WHERE type='genre' AND name=? AND ref_kind='series'", (name,))
    items.sort(key=lambda i: i["sort_title"] or "")
    return {"name": name, "items": _cards(u["id"], items),
            "series": [_series_card(x) for x in sorted(shows, key=lambda x: x["name"].lower())]}


@app.get("/api/similar/{kind}/{ref_id}")
def similar(kind: str, ref_id: int, u=Depends(user_required)):
    """Ähnliche Titel aus der eigenen Sammlung: TMDB-Empfehlungen zuerst, dann gemeinsame Schlagwörter/Genres."""
    if kind not in ("item", "series"):
        raise HTTPException(400)
    scores = {}
    table = "items" if kind == "item" else "series"
    rec = db.q(f"SELECT t.id FROM recs r JOIN {table} t ON t.tmdb_id=r.tmdb_id "
               f"WHERE r.ref_kind=? AND r.ref_id=?" + (" AND t.kind='movie'" if kind == "item" else ""),
               (kind, ref_id))
    for r in rec:
        scores[r["id"]] = scores.get(r["id"], 0) + 10
    for r in db.q("SELECT t2.ref_id id, SUM(CASE WHEN t2.type='kw' THEN 3 ELSE 1 END) sc FROM tags t1 "
                  "JOIN tags t2 ON t2.type=t1.type AND t2.name=t1.name AND t2.ref_kind=t1.ref_kind "
                  "WHERE t1.ref_kind=? AND t1.ref_id=? AND t2.ref_id<>? GROUP BY t2.ref_id "
                  "ORDER BY sc DESC LIMIT 80", (kind, ref_id, ref_id)):
        scores[r["id"]] = scores.get(r["id"], 0) + r["sc"]
    scores.pop(ref_id, None)
    best = [i for i, sc in sorted(scores.items(), key=lambda x: -x[1]) if sc >= 3][:40]
    if not best:
        return []
    marks = ",".join("?" * len(best))
    if kind == "item":
        rows = {r["id"]: r for r in _visible_items(u, marks, best)}
        own = db.q1("SELECT tmdb_id FROM items WHERE id=?", (ref_id,)) or {}
        ordered = [rows[i] for i in best if i in rows and (not own.get("tmdb_id") or rows[i]["tmdb_id"] != own["tmdb_id"])]
        return _cards(u["id"], ordered)[:20]
    rows = {r["id"]: r for r in _visible_series(u, marks, best)}
    return [_series_card(rows[i]) for i in best if i in rows][:20]


@app.get("/api/image/{name}")
def image(name: str, u=Depends(user_required)):
    p = os.path.join(db.DATA_DIR, "images", os.path.basename(name))
    if not os.path.exists(p):
        raise HTTPException(404)
    return FileResponse(p, headers={"Cache-Control": "max-age=2592000"})


FRAMES = os.path.join(transcode.TMP + "-frames")
_frame_sem = asyncio.Semaphore(2)


@app.get("/api/frame/{item_id}")
async def frame(item_id: int, t: float = 0, u=Depends(user_required)):
    """Standbild an Stelle t (für die Vorschau beim Spulen). Auf 5 Sekunden gerundet und zwischengespeichert."""
    it = db.q1("SELECT * FROM items WHERE id=?", (item_id,))
    if not it:
        raise HTTPException(404)
    check_lib(u, it["library_id"])
    if not fsk_ok(u, it["fsk"]):
        raise HTTPException(404)
    t = max(0, int(t // 5 * 5))
    os.makedirs(FRAMES, exist_ok=True)
    dest = os.path.join(FRAMES, f"{item_id}_{t}.jpg")
    if not os.path.exists(dest):
        async with _frame_sem:
            if not os.path.exists(dest):
                proc = await asyncio.create_subprocess_exec(
                    "ffmpeg", "-v", "error", "-y", "-noaccurate_seek", "-ss", str(t), "-i", it["path"],
                    "-frames:v", "1", "-vf", "scale=360:-2", "-q:v", "6", dest,
                    stdout=asyncio.subprocess.DEVNULL, stderr=asyncio.subprocess.DEVNULL)
                try:
                    await asyncio.wait_for(proc.wait(), 20)
                except asyncio.TimeoutError:
                    proc.kill()
    if not os.path.exists(dest) or os.path.getsize(dest) == 0:
        raise HTTPException(404)
    return FileResponse(dest, media_type="image/jpeg", headers={"Cache-Control": "max-age=86400"})


@app.get("/api/thumb/{item_id}")
async def thumb(item_id: int, u=Depends(user_required)):
    it = db.q1("SELECT * FROM items WHERE id=?", (item_id,))
    if not it:
        raise HTTPException(404)
    check_lib(u, it["library_id"])
    p = await asyncio.to_thread(library.thumbnail, it)
    if not p:
        raise HTTPException(404)
    return FileResponse(p, headers={"Cache-Control": "max-age=2592000"})


# ---------------------------------------------------------------- Wiedergabe

DIRECT_CONTAINERS = ("mp4", "mov", "m4a")


def can_direct(it, audio_idx, quality, hevc, safari=0):
    if quality != "original":
        return False
    fmt = it.get("container") or ""
    if not any(c in fmt.split(",") for c in DIRECT_CONTAINERS):
        return False
    vc = it.get("vcodec")
    if vc not in ("h264",) and not (hevc and vc == "hevc"):
        return False
    audio = json.loads(it.get("audio") or "[]")
    if audio and (audio_idx != 0 or audio[0]["codec"] not in ("aac", "mp3")):
        return False
    # Safari (iPad/iPhone/Mac) spielt bei Dateien mit mehreren Tonspuren alle gleichzeitig ab -> umpacken, nur eine Spur
    if safari and len(audio) > 1:
        return False
    return True


def default_audio(it, pref=None):
    audio = json.loads(it.get("audio") or "[]")
    langs = {"de": ("ger", "deu", "de"), "en": ("eng", "en")}.get(pref or "de", ())
    if pref == "original":
        return 0
    for i, a in enumerate(audio):
        if a["lang"] in langs:
            return i
    for i, a in enumerate(audio):
        if a.get("default"):
            return i
    return 0


@app.get("/api/play/{item_id}")
def play(item_id: int, start: float = 0, audio: Optional[int] = None, quality: str = "original",
         hevc: int = 0, replace: str = "", safari: int = 0, u=Depends(user_required)):
    it = db.q1("SELECT * FROM items WHERE id=?", (item_id,))
    if not it:
        raise HTTPException(404)
    check_lib(u, it["library_id"])
    if not fsk_ok(u, it["fsk"]):
        raise HTTPException(404)
    if not it["probed"]:
        it = library.probe_item(item_id)
    if audio is None:
        audio = default_audio(it, json.loads(u["prefs"] or "{}").get("audio_lang"))
    if replace:
        transcode.stop(replace)
    if can_direct(it, audio, quality, hevc, safari):
        return {"mode": "direct", "url": f"/api/direct/{item_id}", "offset": 0,
                "duration": it["duration"], "audio": audio}
    s = transcode.start(it, start, audio, quality)
    return {"mode": "hls", "url": f"/api/hls/{s.id}/index.m3u8", "session": s.id,
            "offset": s.start, "duration": it["duration"], "audio": audio,
            "transcode": "kopie" if (quality == "original" and it["vcodec"] == "h264") else transcode.hw_mode()}


@app.get("/api/direct/{item_id}")
def direct(item_id: int, u=Depends(user_required)):
    it = db.q1("SELECT * FROM items WHERE id=?", (item_id,))
    if not it:
        raise HTTPException(404)
    check_lib(u, it["library_id"])
    if not fsk_ok(u, it["fsk"]):
        raise HTTPException(404)
    return FileResponse(it["path"], media_type="video/mp4")


@app.get("/api/hls/{sid}/index.m3u8")
async def hls_playlist(sid: str, u=Depends(user_required)):
    s = transcode.get(sid)
    if not s:
        raise HTTPException(404, "Sitzung beendet")
    txt = await asyncio.to_thread(s.playlist)
    if txt is None:
        log.warning("Umwandlung startet nicht:\n%s", s.error_log())
        raise HTTPException(500, "Umwandlung fehlgeschlagen")
    return Response(txt, media_type="application/vnd.apple.mpegurl",
                    headers={"Cache-Control": "no-cache"})


@app.get("/api/hls/{sid}/{seg}")
async def hls_segment(sid: str, seg: str, u=Depends(user_required)):
    s = transcode.get(sid)
    if not s:
        raise HTTPException(404)
    p = os.path.join(s.dir, os.path.basename(seg))
    for _ in range(100):
        if os.path.exists(p):
            return FileResponse(p, media_type="video/mp2t")
        await asyncio.sleep(0.2)
    raise HTTPException(404)


@app.post("/api/hls/{sid}/ping")
def hls_ping(sid: str, u=Depends(user_required)):
    return {"alive": transcode.get(sid) is not None}


@app.delete("/api/hls/{sid}")
def hls_stop(sid: str, u=Depends(user_required)):
    transcode.stop(sid)
    return {"ok": True}


@app.post("/api/progress")
async def progress(request: Request, u=Depends(user_required)):
    b = await request.json()
    pos, dur = float(b.get("position") or 0), float(b.get("duration") or 0)
    watched = 1 if dur and pos / dur > 0.92 else 0
    it = db.q1("SELECT * FROM items WHERE id=?", (int(b["item_id"]),))
    if not it:
        raise HTTPException(404)
    now = time.time()
    for x in siblings(it):
        db.run("INSERT INTO progress(user_id,item_id,position,duration,watched,updated) VALUES(?,?,?,?,?,?) "
               "ON CONFLICT(user_id,item_id) DO UPDATE SET position=excluded.position, "
               "duration=excluded.duration, watched=MAX(watched, excluded.watched), updated=excluded.updated",
               (u["id"], x["id"], pos, dur, watched, now if x["id"] == it["id"] else now - 0.001))
    return {"ok": True}


@app.post("/api/watched/{item_id}")
async def set_watched(item_id: int, request: Request, u=Depends(user_required)):
    b = await request.json()
    w = 1 if b.get("watched") else 0
    it = db.q1("SELECT * FROM items WHERE id=?", (item_id,))
    if not it:
        raise HTTPException(404)
    for x in siblings(it):
        db.run("INSERT INTO progress(user_id,item_id,position,duration,watched,updated) VALUES(?,?,0,0,?,?) "
               "ON CONFLICT(user_id,item_id) DO UPDATE SET watched=excluded.watched, position=0, "
               "updated=excluded.updated", (u["id"], x["id"], w, time.time()))
    return {"ok": True}


# ---------------------------------------------------------------- Live-TV

@app.get("/api/live/channels")
def live_channels(u=Depends(user_required)):
    out = []
    sat_ok = bool(u["is_admin"] or u["allow_sat"])
    for i, c in enumerate(livetv.channels()):
        if c.get("sat") and not sat_ok:
            continue
        if livetv.is_page(c["url"]):
            out.append(dict(c, idx=i, url=f"/api/live/open/{i}", proxy=f"/api/live/open/{i}?proxy=1"))
        else:
            out.append(dict(c, idx=i, proxy=livetv.proxied(c["url"])))
    return out


@app.get("/api/live/open/{idx}")
async def live_open(idx: int, proxy: int = 0, u=Depends(user_required)):
    chs = livetv.channels()
    if idx < 0 or idx >= len(chs):
        raise HTTPException(404)
    if chs[idx].get("sat") and not (u["is_admin"] or u["allow_sat"]):
        raise HTTPException(403, "Satellitenfernsehen ist für dich nicht freigegeben")
    try:
        real = await livetv.resolve(chs[idx]["url"], http_client())
    except Exception as e:
        log.warning("Senderadresse nicht ermittelbar: %s", e)
        raise HTTPException(502, "Sender gerade nicht erreichbar")
    target = livetv.proxied(real) if proxy else real
    return Response(status_code=302, headers={"Location": target, "Cache-Control": "no-cache"})


_http = None


def http_client():
    global _http
    if _http is None:
        _http = httpx.AsyncClient(timeout=20, follow_redirects=True,
                                  headers={"User-Agent": "Mozilla/5.0 Kinowerk"})
    return _http


@app.get("/api/live/proxy")
async def live_proxy(request: Request, s: str = "", user=Depends(user_required)):
    url = request.query_params.get("u", "")
    if not livetv.check(url, s):
        raise HTTPException(403)
    if not (user["is_admin"] or user["allow_sat"]):
        sat_hosts = {_re.sub(r"^\w+://([^/]+).*", r"\1", c["url"]) for c in livetv.channels() if c.get("sat")}
        if _re.sub(r"^\w+://([^/]+).*", r"\1", url) in sat_hosts:
            raise HTTPException(403)
    r = await http_client().get(url)
    if r.status_code != 200:
        raise HTTPException(r.status_code)
    ctype = r.headers.get("content-type", "")
    if r.content[:7] == b"#EXTM3U":
        return Response(livetv.rewrite_playlist(r.text, str(r.url)),
                        media_type="application/vnd.apple.mpegurl",
                        headers={"Cache-Control": "no-cache"})
    return Response(r.content, media_type=ctype or "application/octet-stream")


# ---------------------------------------------------------------- Verwaltung

@app.post("/api/admin/translate")
async def admin_translate(request: Request, u=Depends(admin_required)):
    b = await request.json()
    out = {}
    if b.get("genres"):
        out["genres"] = lookup.translate_genres(b["genres"])
    try:
        if b.get("text"):
            out.update(await asyncio.to_thread(lookup.translate, b["text"][:5000]))
    except Exception as e:
        out["error"] = str(e)
    return out


@app.get("/api/admin/settings")
def admin_settings(u=Depends(admin_required)):
    key = db.get_setting("tmdb_key") or ""
    okey = db.get_setting("omdb_key") or ""
    dkey = db.get_setting("deepl_key") or ""
    return {"deepl_key_set": bool(dkey), "deepl_key_hint": ("…" + dkey[-6:]) if dkey else "","tmdb_key_set": bool(key), "tmdb_key_hint": ("…" + key[-4:]) if key else "",
            "omdb_key_set": bool(okey), "omdb_key_hint": ("…" + okey[-4:]) if okey else "",
            "tv_ips": db.get_setting("tv_ips") or "",
            "hw": db.get_setting("hw", "auto"), "hw_active": transcode.hw_mode()}


@app.post("/api/admin/settings")
async def admin_settings_save(request: Request, u=Depends(admin_required)):
    b = await request.json()
    res = {}
    if "tmdb_key" in b:
        db.set_setting("tmdb_key", (b["tmdb_key"] or "").strip())
        res["tmdb_ok"] = await asyncio.to_thread(library.tmdb_test) if b["tmdb_key"] else None
    if "tv_ips" in b:
        db.set_setting("tv_ips", (b["tv_ips"] or "").strip())
    if "omdb_key" in b:
        db.set_setting("omdb_key", (b["omdb_key"] or "").strip())
        try:
            res["omdb_ok"] = bool(await asyncio.to_thread(lookup.search, "omdb", "film", "Matrix"))
        except Exception:
            res["omdb_ok"] = False
    if "deepl_key" in b:
        db.set_setting("deepl_key", (b["deepl_key"] or "").strip())
        if b["deepl_key"]:
            try:
                res["deepl_ok"] = bool((await asyncio.to_thread(lookup.translate, "Good morning"))["text"])
            except Exception as e:
                res["deepl_ok"] = False; res["deepl_err"] = str(e)
    if b.get("hw") in ("auto", "vaapi", "cpu"):
        db.set_setting("hw", b["hw"])
    return res


@app.get("/api/admin/libraries")
def admin_libs(u=Depends(admin_required)):
    out = []
    for l in db.q("SELECT l.*, (SELECT COUNT(*) FROM items WHERE library_id=l.id) n FROM libraries l "
                  "ORDER BY sort, name"):
        l["paths"] = library.roots(l)
        out.append(l)
    return out


@app.post("/api/admin/libraries")
async def admin_lib_save(request: Request, u=Depends(admin_required)):
    b = await request.json()
    name, kind = (b.get("name") or "").strip(), b.get("kind")
    paths = [p.strip().rstrip("/") for p in (b.get("paths") or ([b["path"]] if b.get("path") else [])) if p.strip()]
    paths = list(dict.fromkeys(paths))
    if not name or not paths or kind not in ("filme", "serien", "sonstiges"):
        raise HTTPException(400, "Name, mindestens einen Ordner und die Art angeben")
    for p in paths:
        if not os.path.isdir(p):
            raise HTTPException(400, f"Ordner {p} nicht gefunden")
    if b.get("id"):
        lid = int(b["id"])
        old = db.q1("SELECT * FROM libraries WHERE id=?", (lid,))
        if not old:
            raise HTTPException(404)
        old_paths = library.roots(old)
        db.run("UPDATE libraries SET name=?, path=?, kind=?, sort=? WHERE id=?",
               (name, paths[0], kind, int(b.get("sort") or 0), lid))
        for p in old_paths:
            if p not in paths:
                db.run("DELETE FROM items WHERE library_id=? AND path LIKE ?", (lid, p.rstrip("/") + "/%"))
                db.run("DELETE FROM library_paths WHERE library_id=? AND path=?", (lid, p))
        for p in paths:
            db.run("INSERT OR IGNORE INTO library_paths(library_id,path) VALUES(?,?)", (lid, p))
        lib = db.q1("SELECT * FROM libraries WHERE id=?", (lid,))
        if old["kind"] != kind:
            await asyncio.to_thread(library.reclassify_library, lib)
        else:
            await asyncio.to_thread(library.refresh_folders, lib)
        db.run("DELETE FROM series WHERE library_id=? AND id NOT IN "
               "(SELECT DISTINCT series_id FROM items WHERE series_id IS NOT NULL)", (lid,))
    else:
        lid = db.run("INSERT INTO libraries(name,path,kind,sort) VALUES(?,?,?,?)",
                     (name, paths[0], kind, int(b.get("sort") or 0)))
        for p in paths:
            db.run("INSERT OR IGNORE INTO library_paths(library_id,path) VALUES(?,?)", (lid, p))
    library.scan_all()
    return {"ok": True}


@app.delete("/api/admin/libraries/{lib_id}")
def admin_lib_delete(lib_id: int, u=Depends(admin_required)):
    db.run("DELETE FROM items WHERE library_id=?", (lib_id,))
    db.run("DELETE FROM series WHERE library_id=?", (lib_id,))
    db.run("DELETE FROM library_paths WHERE library_id=?", (lib_id,))
    db.run("DELETE FROM libraries WHERE id=?", (lib_id,))
    return {"ok": True}


@app.post("/api/admin/scan")
async def admin_scan(request: Request, u=Depends(admin_required)):
    b = await request.json() if (await request.body()) else {}
    if b.get("refresh_meta"):
        db.run("UPDATE items SET meta_done=0 WHERE tmdb_id IS NULL AND locked=0")
        db.run("UPDATE series SET meta_done=0 WHERE tmdb_id IS NULL AND locked=0")
    target = None
    if b.get("library_id"):
        target = ("lib", int(b["library_id"]))
    elif b.get("series_id"):
        target = ("series", int(b["series_id"]))
    library.scan_all(target)
    return {"started": True}


@app.get("/api/admin/scan")
def admin_scan_status(u=Depends(admin_required)):
    return library.status


@app.get("/api/admin/browse")
def admin_browse(path: str = MEDIA_ROOT, u=Depends(admin_required)):
    path = os.path.realpath(path or MEDIA_ROOT)
    if not os.path.isdir(path):
        raise HTTPException(400, "Kein Ordner")
    try:
        dirs = sorted(d for d in os.listdir(path)
                      if os.path.isdir(os.path.join(path, d)) and not d.startswith((".", "@", "#recycle")))
    except OSError as e:
        raise HTTPException(400, str(e))
    return {"path": path, "parent": os.path.dirname(path) if path != "/" else None, "dirs": dirs}


@app.get("/api/admin/users")
def admin_users(u=Depends(admin_required)):
    out = []
    for r in db.q("SELECT id,name,is_admin,libraries,max_fsk,need_device,allow_sat,pw FROM users ORDER BY name"):
        r["libraries"] = json.loads(r["libraries"]) if r["libraries"] else None
        r["pw_set"] = bool(r.pop("pw"))
        r["devices"] = db.q("SELECT id,name,approved,created,last_seen,ip FROM devices WHERE user_id=? "
                            "ORDER BY approved, last_seen DESC", (r["id"],))
        out.append(r)
    return out


@app.post("/api/admin/users")
async def admin_user_save(request: Request, u=Depends(admin_required)):
    b = await request.json()
    name = (b.get("name") or "").strip()
    libs = b.get("libraries")
    libs_json = json.dumps([int(x) for x in libs]) if isinstance(libs, list) else None
    is_admin = 1 if b.get("is_admin") else 0
    max_fsk = b.get("max_fsk")
    max_fsk = int(max_fsk) if max_fsk not in (None, "", "null") else None
    need_device = 0 if is_admin else (1 if b.get("need_device") else 0)
    allow_sat = 1 if (is_admin or b.get("allow_sat", True)) else 0
    pw = b.get("password") or ""
    if pw and len(pw) < 6:
        raise HTTPException(400, "Passwort zu kurz (mind. 6 Zeichen) – oder leer lassen, dann vergibt "
                                 "der Benutzer es bei der ersten Anmeldung selbst")
    if not name:
        raise HTTPException(400, "Name angeben")
    other = db.q1("SELECT id FROM users WHERE name=? COLLATE NOCASE", (name,))
    if b.get("id"):
        uid = int(b["id"])
        if other and other["id"] != uid:
            raise HTTPException(400, "Name schon vergeben")
        if uid == u["id"] and not is_admin:
            raise HTTPException(400, "Du kannst dir die Administrator-Rolle nicht selbst nehmen")
        db.run("UPDATE users SET name=?, is_admin=?, libraries=?, max_fsk=?, need_device=?, allow_sat=? WHERE id=?",
               (name, is_admin, libs_json, max_fsk, need_device, allow_sat, uid))
        if pw:
            db.run("UPDATE users SET pw=? WHERE id=?", (hash_pw(pw), uid))
        if b.get("reset_password"):
            db.run("UPDATE users SET pw='' WHERE id=?", (uid,))
        if (pw or b.get("reset_password")) and uid != u["id"]:
            db.run("DELETE FROM sessions WHERE user_id=?", (uid,))
    else:
        if other:
            raise HTTPException(400, "Name schon vergeben")
        db.run("INSERT INTO users(name,pw,is_admin,libraries,max_fsk,need_device,allow_sat) VALUES(?,?,?,?,?,?,?)",
               (name, hash_pw(pw) if pw else "", is_admin, libs_json, max_fsk, need_device, allow_sat))
    return {"ok": True}


@app.delete("/api/admin/users/{uid}")
def admin_user_delete(uid: int, u=Depends(admin_required)):
    if uid == u["id"]:
        raise HTTPException(400, "Du kannst dich nicht selbst löschen")
    db.run("DELETE FROM users WHERE id=?", (uid,))
    db.run("DELETE FROM sessions WHERE user_id=?", (uid,))
    db.run("DELETE FROM progress WHERE user_id=?", (uid,))
    db.run("DELETE FROM devices WHERE user_id=?", (uid,))
    return {"ok": True}


@app.post("/api/admin/devices/{did}")
async def admin_device(did: int, request: Request, u=Depends(admin_required)):
    b = await request.json()
    approved = 1 if b.get("approved") else 0
    db.run("UPDATE devices SET approved=? WHERE id=?", (approved, did))
    if not approved:
        db.run("DELETE FROM sessions WHERE device_id=?", (did,))
    return {"ok": True}


@app.delete("/api/admin/devices/{did}")
def admin_device_delete(did: int, u=Depends(admin_required)):
    db.run("DELETE FROM sessions WHERE device_id=?", (did,))
    db.run("DELETE FROM devices WHERE id=?", (did,))
    return {"ok": True}


@app.get("/api/admin/channels")
def admin_channels(u=Depends(admin_required)):
    return livetv.channels()


@app.put("/api/admin/channels")
async def admin_channels_save(request: Request, u=Depends(admin_required)):
    return livetv.save(await request.json())


@app.get("/api/admin/tmdb")
async def admin_tmdb(kind: str, q: str, u=Depends(admin_required)):
    try:
        return await asyncio.to_thread(library.tmdb_search, kind, q)
    except Exception as e:
        raise HTTPException(400, f"TheMovieDB-Fehler: {e}")


@app.post("/api/admin/match")
async def admin_match(request: Request, u=Depends(admin_required)):
    b = await request.json()
    if b.get("series_id"):
        db.run("UPDATE series SET locked=0 WHERE id=?", (int(b["series_id"]),))
        ok = await asyncio.to_thread(library.match_series, int(b["series_id"]), "", None, int(b["tmdb_id"]))
        if ok:
            await asyncio.to_thread(library.series_details, int(b["series_id"]), int(b["tmdb_id"]))
    else:
        it0 = db.q1("SELECT * FROM items WHERE id=?", (int(b["item_id"]),))
        if it0 and it0["kind"] == "video":
            db.run("UPDATE items SET kind='movie' WHERE id=?", (it0["id"],))
        db.run("UPDATE items SET locked=0 WHERE id=?", (int(b["item_id"]),))
        ok = await asyncio.to_thread(library.match_movie, int(b["item_id"]), "", None, int(b["tmdb_id"]))
        if ok:
            await asyncio.to_thread(library.movie_details, int(b["item_id"]), int(b["tmdb_id"]))
    return {"ok": ok}


@app.get("/api/admin/lookup")
async def admin_lookup(provider: str, kind: str, q: str, u=Depends(admin_required)):
    try:
        return await asyncio.to_thread(lookup.search, provider, kind, q)
    except Exception as e:
        raise HTTPException(400, str(e))


@app.get("/api/admin/lookup_detail")
async def admin_lookup_detail(provider: str, kind: str, id: str, u=Depends(admin_required)):
    try:
        return await asyncio.to_thread(lookup.details, provider, kind, id)
    except Exception as e:
        raise HTTPException(400, f"Abruf fehlgeschlagen: {e}")


def _cast_text(cast_json):
    try:
        c = json.loads(cast_json or "null") or {}
    except Exception:
        c = {}
    return ", ".join(p["name"] + (f" ({p['role']})" if p.get("role") else "") for p in c.get("cast", [])), \
        ", ".join(c.get("director", []))


@app.get("/api/admin/editdata/{kind}/{ref}")
def admin_editdata(kind: str, ref: int, u=Depends(admin_required)):
    if kind == "series":
        r = db.q1("SELECT * FROM series WHERE id=?", (ref,))
        if not r:
            raise HTTPException(404)
        title = r["name"]
    else:
        r = db.q1("SELECT * FROM items WHERE id=?", (ref,))
        if not r:
            raise HTTPException(404)
        title = (r["ep_name"] or r["title"]) if r["kind"] == "episode" else r["title"]
    cast, director = _cast_text(r["cast"])
    return {"kind": kind, "type": r.get("kind", "series"), "title": title, "year": r["year"], "fsk": r["fsk"],
            "genres": ", ".join(json.loads(r["genres"] or "[]")), "director": director, "cast": cast,
            "overview": r["overview"] or "", "poster": r["poster"], "locked": bool(r["locked"])}


def _person_id(name):
    row = db.q1("SELECT person_id, img FROM people WHERE name=? COLLATE NOCASE AND person_id>0 LIMIT 1", (name,))
    if row:
        return row["person_id"], row["img"]
    return -((zlib.crc32(name.lower().encode()) & 0x7fffffff) + 1), None


@app.post("/api/admin/edit")
async def admin_edit(request: Request, u=Depends(admin_required)):
    b = await request.json()
    kind, ref = b.get("kind"), int(b["id"])
    title = (b.get("title") or "").strip()
    if not title:
        raise HTTPException(400, "Titel angeben")
    year = int(b["year"]) if str(b.get("year") or "").strip().isdigit() else None
    fsk = int(b["fsk"]) if str(b.get("fsk") or "") in ("0", "6", "12", "16", "18") else None
    genres = [g.strip() for g in (b.get("genres") or "").split(",") if g.strip()]
    director = [d.strip() for d in (b.get("director") or "").split(",") if d.strip()]
    cast = []
    for p in lookup.parse_cast_text(b.get("cast") or ""):
        pid, img = _person_id(p["name"])
        cast.append({"id": pid, "name": p["name"], "role": p["role"], "img": img})
    cast_json = json.dumps({"cast": cast, "director": director}, ensure_ascii=False)
    overview = (b.get("overview") or "").strip() or None
    poster = None
    if b.get("poster_url"):
        try:
            data, ctype = await asyncio.to_thread(lookup.download_image, b["poster_url"])
            poster = _save_custom_image(kind, ref, data, ctype)
        except Exception as e:
            raise HTTPException(400, f"Cover konnte nicht geladen werden: {e}")
    if kind == "series":
        db.run("UPDATE series SET name=?, year=?, fsk=?, genres=?, cast=?, overview=?, locked=1, meta_done=1, "
               "details_done=1" + (", poster=?" if poster else "") + " WHERE id=?",
               (title, year, fsk, json.dumps(genres, ensure_ascii=False), cast_json, overview,
                *([poster] if poster else []), ref))
        db.run("UPDATE items SET fsk=? WHERE series_id=?", (fsk, ref))
        library._store_links("series", ref, cast, genres, [], [])
        if b.get("tvmaze_id"):
            try:
                await asyncio.to_thread(lookup.tvmaze_episodes, b["tvmaze_id"], ref)
            except Exception as e:
                log.warning("TVmaze-Folgen nicht übernommen: %s", e)
        return {"ok": True}
    it = db.q1("SELECT * FROM items WHERE id=?", (ref,))
    if not it:
        raise HTTPException(404)
    if it["kind"] == "episode":
        db.run("UPDATE items SET ep_name=?, overview=?, locked=1" + (", poster=?" if poster else "") + " WHERE id=?",
               (title, overview, *([poster] if poster else []), ref))
        return {"ok": True}
    for x in siblings(it):
        db.run("UPDATE items SET title=?, sort_title=?, year=?, fsk=?, genres=?, cast=?, overview=?, locked=1, "
               "meta_done=1, details_done=1" + (", poster=?" if poster else "") + " WHERE id=?",
               (title, library.sort_key(title), year, fsk, json.dumps(genres, ensure_ascii=False), cast_json,
                overview, *([poster] if poster else []), x["id"]))
        library._store_links("item", x["id"], cast, genres, [], [])
    return {"ok": True}


def _save_custom_image(kind, ref, data, ctype):
    if len(data) > 15 * 1024 * 1024:
        raise HTTPException(400, "Bild zu groß (max. 15 MB)")
    ext = {"image/png": "png", "image/webp": "webp", "image/gif": "gif"}.get((ctype or "").split(";")[0], "jpg")
    name = f"custom_{kind}_{ref}_{int(time.time())}.{ext}"
    with open(os.path.join(db.DATA_DIR, "images", name), "wb") as f:
        f.write(data)
    return name


@app.post("/api/admin/poster/{kind}/{ref}")
async def admin_poster(kind: str, ref: int, request: Request, u=Depends(admin_required)):
    ctype = request.headers.get("content-type", "")
    if not ctype.startswith("image/"):
        raise HTTPException(400, "Bitte eine Bilddatei wählen")
    data = await request.body()
    name = _save_custom_image(kind, ref, data, ctype)
    if kind == "series":
        db.run("UPDATE series SET poster=?, locked=1 WHERE id=?", (name, ref))
    else:
        it = db.q1("SELECT * FROM items WHERE id=?", (ref,))
        if not it:
            raise HTTPException(404)
        for x in siblings(it):
            db.run("UPDATE items SET poster=?, locked=1 WHERE id=?", (name, x["id"]))
    return {"ok": True, "poster": name}


# ---------------------------------------------------------------- Auf Fernseher abspielen (DLNA)

@app.get("/api/cast/devices")
async def cast_devices(u=Depends(user_required)):
    return await asyncio.to_thread(cast.discover)


@app.post("/api/cast/device_manual")
async def cast_device_manual(request: Request, u=Depends(admin_required)):
    b = await request.json()
    try:
        d = await asyncio.to_thread(cast.add_manual, (b.get("location") or "").strip())
    except Exception as e:
        raise HTTPException(400, str(e))
    return {"id": d["usn"], "name": d["name"]}


@app.post("/api/cast/start")
async def cast_start(request: Request, u=Depends(user_required)):
    b = await request.json()
    it = db.q1("SELECT * FROM items WHERE id=?", (int(b["item_id"]),))
    if not it:
        raise HTTPException(404)
    check_lib(u, it["library_id"])
    if not fsk_ok(u, it["fsk"]):
        raise HTTPException(404)
    if not it["probed"]:
        it = await asyncio.to_thread(library.probe_item, it["id"])
    audio = b.get("audio")
    if audio is None:
        audio = default_audio(it, json.loads(u["prefs"] or "{}").get("audio_lang"))
    title = (it["ep_name"] or it["title"]) if it["kind"] == "episode" else it["title"]
    if it["kind"] == "episode" and it["series_id"]:
        sr = db.q1("SELECT name FROM series WHERE id=?", (it["series_id"],))
        if sr:
            title = f"{sr['name']} – S{it['season']}E{it['episode']} {title}"
    try:
        res = await asyncio.to_thread(cast.start, b["device"], it, float(b.get("start") or 0), int(audio), title)
    except Exception as e:
        raise HTTPException(502, str(e))
    return res


@app.post("/api/cast/control")
async def cast_control(request: Request, u=Depends(user_required)):
    b = await request.json()
    try:
        return await asyncio.to_thread(cast.control, b["device"], b["action"], b.get("value"))
    except Exception as e:
        raise HTTPException(502, str(e))


@app.get("/api/cast/status")
async def cast_status(device: str, u=Depends(user_required)):
    try:
        return await asyncio.to_thread(cast.status, device)
    except Exception as e:
        raise HTTPException(502, str(e))


@app.api_route("/cast/stream/{tok}", methods=["GET", "HEAD"])
async def cast_stream(tok: str, request: Request):
    """Vom Fernseher abgerufen (ohne Anmeldung, nur mit zufälligem, befristetem Schlüssel)."""
    t = cast.token_info(tok)
    if not t:
        raise HTTPException(404)
    headers = cast.dlna_headers(t)
    if t["mode"] == "direct":
        return FileResponse(t["path"], media_type=t["mime"], headers=headers)
    if request.method == "HEAD":
        return Response(status_code=200, media_type=t["mime"], headers=headers)
    return StreamingResponse(cast.stream_transcoded(t), media_type=t["mime"], headers=headers)


@app.get("/api/admin/sessions")
def admin_sessions(u=Depends(admin_required)):
    return [{"id": s.id, "title": s.item["title"], "quality": s.quality, "mode": getattr(s, "mode", ""),
             "start": s.start, "idle": round(time.time() - s.last_seen)}
            for s in transcode.sessions.values()]


# ---------------------------------------------------------------- Oberfläche

@app.get("/")
def index():
    return FileResponse(os.path.join(WEB_DIR, "index.html"), headers={"Cache-Control": "no-cache"})


app.mount("/web", StaticFiles(directory=WEB_DIR), name="web")

# Jellyfin-kompatible Schnittstelle für Apps wie Plezy (Apple TV)
from . import jellyfin  # noqa: E402
app.include_router(jellyfin.router)

"""Jellyfin-kompatible Schnittstelle, damit Apps wie Plezy (Apple TV, iPhone, Mac) Kinowerk nutzen können.

Kinowerk meldet sich als „Jellyfin Server“. Nur der Teil der Jellyfin-API, den Plezy für
Filme und Serien braucht, ist umgesetzt: Anmeldung, Bibliotheken, Filme, Serien, Staffeln,
Folgen, Bilder, Weiterschauen, Als Nächstes, Gesehen/Favorit, Abspielen (direkt oder HLS)
und Fortschritt. Benutzer, Altersfreigaben (FSK), Bibliotheksrechte und Gerätefreigabe
gelten genauso wie in der Kinowerk-Oberfläche.
"""
import asyncio
import json
import logging
import os
import random
import secrets
import socket
import threading
import time
import uuid
from typing import Optional
from urllib.parse import unquote

from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import FileResponse, JSONResponse

from . import db, library, transcode

log = logging.getLogger("kinowerk.jellyfin")
router = APIRouter()

JF_VERSION = "10.10.7"
TICKS = 10_000_000

# ---------------------------------------------------------------- Kennungen
# Jellyfin-Kennungen sind 32 Hex-Zeichen. Wir kodieren Art + Nummer hinein:
#   1… Film/Folge (items.id)   2… Serie   3… Staffel (Serie, Nummer)   4… Bibliothek   9… Benutzer
K_ITEM, K_SERIES, K_SEASON, K_LIB, K_USER = 1, 2, 3, 4, 9


def gid(kind, a, b=0):
    return f"{kind:x}{a:015x}{b:016x}"


def parse_id(s):
    s = (s or "").replace("-", "").lower()
    if len(s) != 32:
        return None
    try:
        return int(s[0], 16), int(s[1:16], 16), int(s[16:], 16)
    except ValueError:
        return None


def server_id():
    sid = db.get_setting("jf_server_id")
    if not sid:
        sid = uuid.uuid4().hex
        db.set_setting("jf_server_id", sid)
    return sid


def server_name():
    return db.get_setting("jf_server_name") or "Kinowerk"


def ticks(sec):
    return int((sec or 0) * TICKS)


def M():
    from . import main
    return main


# ---------------------------------------------------------------- Anmeldung

def _token_from(request: Request):
    for h in ("x-emby-token", "x-mediabrowser-token"):
        v = request.headers.get(h)
        if v:
            return v.strip()
    for h in ("authorization", "x-emby-authorization"):
        v = request.headers.get(h) or ""
        if "token=" in v.lower():
            for part in v.split(","):
                k, _, val = part.strip().partition("=")
                if k.strip().lower().endswith("token"):
                    return unquote(val.strip().strip('"'))
    for k in ("ApiKey", "api_key", "apikey", "X-Emby-Token"):
        v = request.query_params.get(k)
        if v:
            return v
    return None


def _auth_fields(request: Request):
    v = request.headers.get("authorization") or request.headers.get("x-emby-authorization") or ""
    out = {}
    if v.lower().startswith(("mediabrowser", "emby")):
        v = v.split(" ", 1)[1] if " " in v else ""
        for part in v.split(","):
            k, _, val = part.strip().partition("=")
            out[k.strip()] = unquote(val.strip().strip('"'))
    return out


def user_from(request: Request, required=True):
    tok = _token_from(request)
    u = None
    if tok:
        s = db.q1("SELECT * FROM sessions WHERE token=?", (tok,))
        if s and time.time() - s["created"] <= M().SESSION_DAYS * 86400:
            u = db.q1("SELECT id,name,is_admin,libraries,max_fsk,prefs,need_device,allow_sat FROM users WHERE id=?",
                      (s["user_id"],))
            if u and u["need_device"]:
                d = db.q1("SELECT * FROM devices WHERE id=?", (s.get("device_id"),)) if s.get("device_id") else None
                if not d or not d["approved"]:
                    u = None
    if not u and required:
        raise HTTPException(401, "Nicht angemeldet")
    return u


def user_dto(u):
    return {
        "Name": u["name"], "ServerId": server_id(), "Id": gid(K_USER, u["id"]),
        "HasPassword": True, "HasConfiguredPassword": True, "HasConfiguredEasyPassword": False,
        "EnableAutoLogin": False,
        "Configuration": {"PlayDefaultAudioTrack": True, "SubtitleMode": "Default", "DisplayMissingEpisodes": False,
                          "GroupedFolders": [], "OrderedViews": [], "LatestItemsExcludes": [], "MyMediaExcludes": [],
                          "HidePlayedInLatest": True, "RememberAudioSelections": True,
                          "RememberSubtitleSelections": True, "EnableNextEpisodeAutoPlay": True},
        "Policy": {"IsAdministrator": bool(u["is_admin"]), "IsHidden": False, "IsDisabled": False,
                   "EnableAllFolders": True, "EnableMediaPlayback": True, "EnableAudioPlaybackTranscoding": True,
                   "EnableVideoPlaybackTranscoding": True, "EnablePlaybackRemuxing": True,
                   "EnableContentDownloading": True, "EnableRemoteAccess": True, "EnableLiveTvAccess": False,
                   "EnableLiveTvManagement": False, "EnableContentDeletion": False,
                   "AuthenticationProviderId": "Jellyfin.Server.Implementations.Users.DefaultAuthenticationProvider",
                   "PasswordResetProviderId": "Jellyfin.Server.Implementations.Users.DefaultPasswordResetProvider"},
    }


def public_info(request: Request):
    host = request.headers.get("host") or ""
    scheme = request.headers.get("x-forwarded-proto") or request.url.scheme
    return {"LocalAddress": f"{scheme}://{host}" if host else "", "ServerName": server_name(),
            "Version": JF_VERSION, "ProductName": "Jellyfin Server", "OperatingSystem": "Linux",
            "Id": server_id(), "StartupWizardCompleted": True}


@router.get("/System/Info/Public")
def system_info_public(request: Request):
    return public_info(request)


@router.get("/System/Info")
def system_info(request: Request):
    user_from(request)
    d = public_info(request)
    d.update({"OperatingSystemDisplayName": "Linux", "HasPendingRestart": False, "IsShuttingDown": False,
              "SupportsLibraryMonitor": False, "WebSocketPortNumber": 0, "CanSelfRestart": False,
              "CanLaunchWebBrowser": False, "HasUpdateAvailable": False, "TranscodingTempPath": transcode.TMP,
              "LogPath": "", "InternalMetadataPath": "", "CachePath": "", "ProgramDataPath": db.DATA_DIR,
              "ItemsByNamePath": "", "WebPath": "", "ServerName": server_name()})
    return d


@router.get("/System/Ping")
@router.post("/System/Ping")
def ping():
    return Response("Jellyfin Server", media_type="text/plain")


@router.get("/Branding/Configuration")
def branding():
    return {"LoginDisclaimer": "", "CustomCss": "", "SplashscreenEnabled": False}


@router.get("/QuickConnect/Enabled")
def qc_enabled():
    return False


@router.get("/Users/Public")
def users_public():
    return []


@router.post("/Users/AuthenticateByName")
async def authenticate(request: Request):
    m = M()
    b = await request.json()
    name = (b.get("Username") or b.get("username") or "").strip()
    pw = b.get("Pw") or b.get("pw") or b.get("Password") or ""
    ip = m.client_ip(request) or "?"
    n, t = m._fails.get(ip, (0, 0))
    if n >= 5 and time.time() - t < 300:
        raise HTTPException(429, "Zu viele Fehlversuche – bitte 5 Minuten warten")
    u = db.q1("SELECT * FROM users WHERE name=? COLLATE NOCASE", (name,))
    if not u or not u["pw"] or not m.verify_pw(pw, u["pw"]):
        m._fails[ip] = (n + 1, time.time())
        await asyncio.sleep(1)
        raise HTTPException(401, "Name oder Passwort falsch")
    m._fails.pop(ip, None)
    f = _auth_fields(request)
    dev_token = "jf-" + (f.get("DeviceId") or secrets.token_hex(12))
    d, ok = m.register_device(u, dev_token[:200], request)
    if f.get("Device") or f.get("Client"):
        label = " · ".join(x for x in (f.get("Client"), f.get("Device")) if x)
        db.run("UPDATE devices SET name=? WHERE id=?", (label[:80], d["id"]))
    if not ok:
        raise HTTPException(401, "Dieses Gerät ist noch nicht freigegeben – bitte in Kinowerk unter "
                                 "Einstellungen → Benutzer freigeben und erneut anmelden.")
    tok = secrets.token_hex(16)
    db.run("INSERT INTO sessions(token,user_id,created,device_id) VALUES(?,?,?,?)",
           (tok, u["id"], time.time(), d["id"]))
    uu = db.q1("SELECT * FROM users WHERE id=?", (u["id"],))
    return {"User": user_dto(uu), "AccessToken": tok, "ServerId": server_id(),
            "SessionInfo": {"Id": tok, "UserId": gid(K_USER, u["id"]), "UserName": u["name"],
                            "Client": f.get("Client", ""), "DeviceName": f.get("Device", ""),
                            "DeviceId": f.get("DeviceId", ""), "ApplicationVersion": f.get("Version", ""),
                            "IsActive": True, "SupportsRemoteControl": False, "PlayableMediaTypes": ["Video"]}}


@router.get("/Users/Me")
def users_me(request: Request):
    return user_dto(user_from(request))


@router.get("/Users/{uid}")
def users_one(uid: str, request: Request):
    u = user_from(request)
    return user_dto(u)


@router.post("/Sessions/Capabilities/Full")
@router.post("/Sessions/Capabilities")
@router.post("/Sessions/Logout")
def capabilities(request: Request):
    return Response(status_code=204)


@router.get("/DisplayPreferences/{pid}")
def display_prefs(pid: str, request: Request):
    return {"Id": pid, "SortBy": "SortName", "SortOrder": "Ascending", "RememberIndexing": False,
            "PrimaryImageHeight": 250, "PrimaryImageWidth": 250, "CustomPrefs": {}, "ScrollDirection": "Horizontal",
            "ShowBackdrop": True, "RememberSorting": False, "ShowSidebar": False, "Client": "emby"}


@router.post("/DisplayPreferences/{pid}")
def display_prefs_save(pid: str):
    return Response(status_code=204)


# ---------------------------------------------------------------- Daten

def libs_for(u):
    ids = M().allowed_libs(u)
    if not ids:
        return []
    return db.q(f"SELECT * FROM libraries WHERE id IN ({','.join('?' * len(ids))}) ORDER BY sort, name", ids)


def lib_ctype(lib):
    return "tvshows" if lib["kind"] == "serien" else ("homevideos" if lib["kind"] == "sonstiges" else "movies")


def visible_item(u, it):
    m = M()
    return it and it["library_id"] in m.allowed_libs(u) and m.fsk_ok(u, it.get("fsk"))


def series_visible(u, s):
    m = M()
    return s and s["library_id"] in m.allowed_libs(u) and m.fsk_ok(u, s.get("fsk"))


def _json_list(v):
    try:
        x = json.loads(v or "[]")
        return [g if isinstance(g, str) else (g.get("name") or "") for g in x] if isinstance(x, list) else []
    except Exception:
        return []


def _img_tag(*parts):
    return format(abs(hash("|".join(str(p) for p in parts))) % (16 ** 8), "08x")


class Ctx:
    """Pro Anfrage: Benutzer + zwischengespeicherte Fortschritte und Favoriten."""

    def __init__(self, u):
        self.u = u
        self._prog = None
        self._fav = None

    def prog(self):
        if self._prog is None:
            self._prog = {r["item_id"]: r for r in db.q("SELECT * FROM progress WHERE user_id=?", (self.u["id"],))}
        return self._prog

    def fav(self):
        if self._fav is None:
            self._fav = {r["ref"] for r in db.q("SELECT ref FROM jf_favorites WHERE user_id=?", (self.u["id"],))}
        return self._fav


def user_data(ctx, it=None, ref=None, played=None, unplayed=None):
    p = ctx.prog().get(it["id"]) if it else None
    pos = (p or {}).get("position") or 0
    w = bool((p or {}).get("watched"))
    if w:
        pos = 0
    d = {"PlaybackPositionTicks": ticks(pos) if it else 0, "PlayCount": 1 if w else 0,
         "IsFavorite": (ref or "") in ctx.fav(), "Played": w if played is None else played,
         "Key": ref or "", "ItemId": ref or ""}
    if it and it.get("duration") and pos:
        d["PlayedPercentage"] = min(100.0, pos / it["duration"] * 100)
    if p and p.get("updated"):
        d["LastPlayedDate"] = _iso(p["updated"])
    if unplayed is not None:
        d["UnplayedItemCount"] = unplayed
    return d


def _iso(ts):
    return time.strftime("%Y-%m-%dT%H:%M:%S.0000000Z", time.gmtime(ts or 0))


def media_streams(it):
    try:
        _, info = library.media_details(it)
    except Exception:
        info = {}
    streams, idx = [], 0
    for v in info.get("video", []):
        streams.append({"Type": "Video", "Index": idx, "Codec": (v.get("codec") or "").lower(),
                        "Width": v.get("width"), "Height": v.get("height"), "BitRate": v.get("bitrate"),
                        "Profile": v.get("profile"), "Level": v.get("level"), "AspectRatio": v.get("aspect"),
                        "RealFrameRate": v.get("fps"), "AverageFrameRate": v.get("fps"),
                        "IsInterlaced": bool(v.get("interlaced")), "PixelFormat": v.get("pix_fmt"),
                        "ColorTransfer": v.get("transfer"), "ColorPrimaries": v.get("primaries"),
                        "ColorSpace": v.get("space"), "IsDefault": True, "IsExternal": False,
                        "VideoRange": "HDR" if v.get("transfer") in ("smpte2084", "arib-std-b67") else "SDR",
                        "DisplayTitle": f"{v.get('height') or ''}p {(v.get('codec') or '').upper()}".strip()})
        idx += 1
    first_audio = None
    for a in info.get("audio", []):
        if first_audio is None:
            first_audio = idx
        lang = a.get("lang")
        streams.append({"Type": "Audio", "Index": idx, "Codec": (a.get("codec") or "").lower(), "Language": lang,
                        "Title": a.get("title"), "Channels": a.get("channels"), "ChannelLayout": a.get("layout"),
                        "SampleRate": a.get("rate"), "BitRate": a.get("bitrate"), "IsDefault": bool(a.get("default")),
                        "IsExternal": False, "IsForced": False,
                        "DisplayTitle": " · ".join(x for x in (a.get("title") or lang or "", (a.get("codec") or ""),
                                                                a.get("layout") or "") if x)})
        idx += 1
    for s in info.get("subs", []):
        codec = (s.get("codec") or "").lower()
        streams.append({"Type": "Subtitle", "Index": idx, "Codec": codec, "Language": s.get("lang"),
                        "Title": s.get("title"), "IsDefault": bool(s.get("default")), "IsForced": bool(s.get("forced")),
                        "IsExternal": False, "IsTextSubtitleStream": codec in ("subrip", "srt", "ass", "ssa", "mov_text",
                                                                              "webvtt", "text"),
                        "DeliveryMethod": "Embed",
                        "DisplayTitle": " · ".join(x for x in (s.get("title") or s.get("lang") or "", codec.upper()) if x)})
        idx += 1
    return streams, first_audio, info


def media_source(it, full=True):
    path = it["path"]
    ext = os.path.splitext(path)[1].lstrip(".").lower() or "mkv"
    src = {"Protocol": "File", "Id": gid(K_ITEM, it["id"]), "Path": os.path.basename(path), "Type": "Default",
           "Container": ext, "Size": it.get("size"), "Name": os.path.basename(path), "IsRemote": False,
           "RunTimeTicks": ticks(it.get("duration")), "ReadAtNativeFramerate": False, "IgnoreDts": False,
           "IgnoreIndex": False, "GenPtsInput": False, "SupportsTranscoding": True, "SupportsDirectStream": True,
           "SupportsDirectPlay": True, "IsInfiniteStream": False, "RequiresOpening": False,
           "RequiresClosing": False, "RequiresLooping": False, "SupportsProbing": True,
           "VideoType": "VideoFile", "Formats": [], "MediaAttachments": [], "RequiredHttpHeaders": {},
           "HasSegments": False}
    if full:
        streams, first_audio, info = media_streams(it)
        src["MediaStreams"] = streams
        src["Bitrate"] = info.get("bitrate")
        if first_audio is not None:
            src["DefaultAudioStreamIndex"] = first_audio
    return src


def item_dto(ctx, it, lib=None, series=None, full=False):
    ref = gid(K_ITEM, it["id"])
    is_ep = it["kind"] == "episode" and it.get("series_id")
    lib = lib or db.q1("SELECT * FROM libraries WHERE id=?", (it["library_id"],))
    d = {"Name": (it.get("ep_name") or it["title"]) if is_ep else it["title"], "ServerId": server_id(), "Id": ref,
         "Etag": _img_tag(it.get("mtime"), it.get("poster")), "DateCreated": _iso(it.get("added")),
         "CanDelete": False, "CanDownload": True, "SortName": it.get("sort_title") or it["title"],
         "RunTimeTicks": ticks(it.get("duration")), "ProductionYear": it.get("year"),
         "IsFolder": False, "Type": "Episode" if is_ep else "Movie", "MediaType": "Video",
         "LocationType": "FileSystem", "VideoType": "VideoFile", "ParentId": gid(K_LIB, it["library_id"]),
         "Overview": it.get("overview") or "", "Genres": _json_list(it.get("genres")),
         "UserData": user_data(ctx, it, ref), "ImageTags": {}, "BackdropImageTags": [],
         "Container": os.path.splitext(it["path"])[1].lstrip(".").lower(), "HasSubtitles": False,
         "Width": it.get("width"), "Height": it.get("height"), "ChildCount": 0}
    if it.get("year"):
        d["PremiereDate"] = f"{it['year']}-01-01T00:00:00.0000000Z"
    if it.get("fsk") is not None:
        d["OfficialRating"] = f"FSK-{it['fsk']}"
    if it.get("poster") and not is_ep:
        d["ImageTags"]["Primary"] = _img_tag(it["poster"])
    else:
        d["ImageTags"]["Primary"] = _img_tag("thumb", it["id"], it.get("mtime"))
        d["PrimaryImageAspectRatio"] = 1.777 if is_ep or not it.get("poster") else 0.667
    if it.get("backdrop"):
        d["BackdropImageTags"] = [_img_tag(it["backdrop"])]
    d["ImageTags"]["Thumb"] = _img_tag("thumb", it["id"], it.get("mtime"))
    if is_ep:
        s = series or db.q1("SELECT * FROM series WHERE id=?", (it["series_id"],)) or {}
        season = it.get("season") if it.get("season") is not None else 1
        d.update({"SeriesId": gid(K_SERIES, it["series_id"]), "SeriesName": s.get("name") or "",
                  "SeasonId": gid(K_SEASON, it["series_id"], season), "SeasonName": f"Staffel {season}",
                  "ParentIndexNumber": season, "IndexNumber": it.get("episode"),
                  "ParentId": gid(K_SEASON, it["series_id"], season)})
        if s.get("poster"):
            d["SeriesPrimaryImageTag"] = _img_tag(s["poster"])
        if s.get("backdrop"):
            d["ParentBackdropItemId"] = gid(K_SERIES, it["series_id"])
            d["ParentBackdropImageTags"] = [_img_tag(s["backdrop"])]
            if not d["BackdropImageTags"]:
                d["BackdropImageTags"] = []
    if full:
        src = media_source(it, True)
        d["MediaSources"] = [src]
        d["MediaStreams"] = src["MediaStreams"]
        d["HasSubtitles"] = any(s["Type"] == "Subtitle" for s in src["MediaStreams"])
        try:
            d["Chapters"] = [{"StartPositionTicks": ticks(c["start"]), "Name": c.get("title") or f"Kapitel {i + 1}"}
                             for i, c in enumerate(library.chapters(it))]
        except Exception:
            d["Chapters"] = []
        d["People"] = []
        d["Studios"] = []
        d["Tags"] = []
        d["Path"] = os.path.basename(it["path"])
    return d


def _series_items(u, sid):
    m = M()
    extra, args = m.fsk_sql(u)
    return db.q(f"SELECT * FROM items i WHERE series_id=? AND kind='episode'{extra} "
                "ORDER BY COALESCE(season,1), episode, sort_title", (sid, *args))


def series_dto(ctx, s, eps=None):
    ref = gid(K_SERIES, s["id"])
    eps = eps if eps is not None else _series_items(ctx.u, s["id"])
    unplayed = sum(1 for e in eps if not (ctx.prog().get(e["id"]) or {}).get("watched"))
    seasons = sorted({e["season"] if e["season"] is not None else 1 for e in eps})
    added = max([e.get("added") or 0 for e in eps] or [0])
    d = {"Name": s["name"], "ServerId": server_id(), "Id": ref, "Type": "Series", "IsFolder": True,
         "SortName": s["name"], "ProductionYear": s.get("year"), "Overview": s.get("overview") or "",
         "Genres": _json_list(s.get("genres")), "ParentId": gid(K_LIB, s["library_id"]),
         "DateCreated": _iso(added), "DateLastMediaAdded": _iso(added), "LocationType": "FileSystem",
         "ChildCount": len(seasons), "RecursiveItemCount": len(eps), "Status": "Continuing",
         "UserData": user_data(ctx, None, ref, played=(unplayed == 0 and bool(eps)), unplayed=unplayed),
         "ImageTags": {}, "BackdropImageTags": [], "People": [], "Studios": [], "Tags": []}
    if s.get("fsk") is not None:
        d["OfficialRating"] = f"FSK-{s['fsk']}"
    if s.get("year"):
        d["PremiereDate"] = f"{s['year']}-01-01T00:00:00.0000000Z"
    if s.get("poster"):
        d["ImageTags"]["Primary"] = _img_tag(s["poster"])
        d["PrimaryImageAspectRatio"] = 0.667
    elif eps:
        d["ImageTags"]["Primary"] = _img_tag("thumb", eps[0]["id"])
    if s.get("backdrop"):
        d["BackdropImageTags"] = [_img_tag(s["backdrop"])]
    return d


def season_dto(ctx, s, num, eps):
    ref = gid(K_SEASON, s["id"], num)
    unplayed = sum(1 for e in eps if not (ctx.prog().get(e["id"]) or {}).get("watched"))
    d = {"Name": "Specials" if num == 0 else f"Staffel {num}", "ServerId": server_id(), "Id": ref,
         "Type": "Season", "IsFolder": True, "IndexNumber": num, "SortName": f"{num:04d}",
         "SeriesId": gid(K_SERIES, s["id"]), "SeriesName": s["name"], "ParentId": gid(K_SERIES, s["id"]),
         "ChildCount": len(eps), "RecursiveItemCount": len(eps), "LocationType": "FileSystem",
         "UserData": user_data(ctx, None, ref, played=(unplayed == 0 and bool(eps)), unplayed=unplayed),
         "ImageTags": {}, "BackdropImageTags": [], "ProductionYear": s.get("year")}
    if s.get("poster"):
        d["ImageTags"]["Primary"] = _img_tag(s["poster"])
        d["SeriesPrimaryImageTag"] = _img_tag(s["poster"])
        d["PrimaryImageAspectRatio"] = 0.667
    if s.get("backdrop"):
        d["ParentBackdropItemId"] = gid(K_SERIES, s["id"])
        d["ParentBackdropImageTags"] = [_img_tag(s["backdrop"])]
    return d


def lib_dto(ctx, lib):
    ref = gid(K_LIB, lib["id"])
    n = db.q1("SELECT COUNT(*) c FROM items WHERE library_id=?", (lib["id"],))["c"]
    first = db.q1("SELECT id FROM items WHERE library_id=? ORDER BY added DESC LIMIT 1", (lib["id"],))
    d = {"Name": lib["name"], "ServerId": server_id(), "Id": ref, "Type": "CollectionFolder",
         "CollectionType": lib_ctype(lib), "IsFolder": True, "SortName": lib["name"], "ChildCount": n,
         "LocationType": "FileSystem", "ImageTags": {}, "BackdropImageTags": [],
         "UserData": user_data(ctx, None, ref), "Etag": ref[:8], "DisplayPreferencesId": ref, "ParentId": server_id()}
    if first:
        d["ImageTags"]["Primary"] = _img_tag("thumb", first["id"])
    return d


def resolve(ctx, ref, full=False):
    """Kennung → (Art, DTO, Rohdaten) oder HTTPException 404."""
    p = parse_id(ref)
    if not p:
        raise HTTPException(404, "Unbekannte Kennung")
    kind, a, b = p
    u = ctx.u
    if kind == K_ITEM:
        it = db.q1("SELECT * FROM items WHERE id=?", (a,))
        if not visible_item(u, it):
            raise HTTPException(404)
        if full and not it.get("probed"):
            it = library.probe_item(a) or it
        return "item", item_dto(ctx, it, full=full), it
    if kind == K_SERIES:
        s = db.q1("SELECT * FROM series WHERE id=?", (a,))
        if not series_visible(u, s):
            raise HTTPException(404)
        return "series", series_dto(ctx, s), s
    if kind == K_SEASON:
        s = db.q1("SELECT * FROM series WHERE id=?", (a,))
        if not series_visible(u, s):
            raise HTTPException(404)
        eps = [e for e in _series_items(u, a) if (e["season"] if e["season"] is not None else 1) == b]
        return "season", season_dto(ctx, s, b, eps), (s, b, eps)
    if kind == K_LIB:
        lib = db.q1("SELECT * FROM libraries WHERE id=?", (a,))
        if not lib or lib["id"] not in M().allowed_libs(u):
            raise HTTPException(404)
        return "lib", lib_dto(ctx, lib), lib
    raise HTTPException(404)


# ---------------------------------------------------------------- Abfragen

def _params(request: Request):
    """Jellyfin-Parameter sind nicht groß/klein-sensitiv."""
    return {k.lower(): v for k, v in request.query_params.items()}


def _csv(v):
    return [x.strip() for x in (v or "").split(",") if x.strip()]


def all_movies(u, lib_ids):
    if not lib_ids:
        return []
    m = M()
    extra, args = m.fsk_sql(u)
    rows = db.q(f"SELECT * FROM items i WHERE library_id IN ({','.join('?' * len(lib_ids))}) "
                f"AND NOT (kind='episode' AND series_id IS NOT NULL){extra}", (*lib_ids, *args))
    return m.collapse(rows)


def all_series(u, lib_ids):
    if not lib_ids:
        return []
    m = M()
    extra, args = m.fsk_sql(u, alias="s")
    return db.q(f"SELECT * FROM series s WHERE library_id IN ({','.join('?' * len(lib_ids))}){extra} "
                "AND EXISTS (SELECT 1 FROM items WHERE series_id=s.id)", (*lib_ids, *args))


def all_episodes(u, lib_ids):
    if not lib_ids:
        return []
    m = M()
    extra, args = m.fsk_sql(u)
    return db.q(f"SELECT i.*, s.name series_name FROM items i LEFT JOIN series s ON s.id=i.series_id "
                f"WHERE i.library_id IN ({','.join('?' * len(lib_ids))}) AND i.kind='episode' "
                f"AND i.series_id IS NOT NULL{extra}", (*lib_ids, *args))


def _sort_key_fn(ctx, sort_by):
    def key(entry):
        kind, raw, dto = entry
        out = []
        for s in sort_by:
            s = s.lower()
            if s in ("sortname", "name"):
                out.append((dto.get("SortName") or dto.get("Name") or "").lower())
            elif s in ("datecreated", "datelastcontentadded"):
                out.append(dto.get("DateCreated") or "")
            elif s in ("premieredate", "productionyear"):
                out.append(dto.get("ProductionYear") or 0)
            elif s == "dateplayed":
                out.append((dto.get("UserData") or {}).get("LastPlayedDate") or "")
            elif s == "runtime":
                out.append(dto.get("RunTimeTicks") or 0)
            elif s == "parentindexnumber":
                out.append(dto.get("ParentIndexNumber") or 0)
            elif s == "indexnumber":
                out.append(dto.get("IndexNumber") or 0)
            elif s in ("communityrating", "criticrating", "officialrating"):
                out.append(dto.get("CommunityRating") or 0)
            else:
                out.append(0)
        return out
    return key


def query_items(ctx, request: Request, forced_parent=None):
    u = ctx.u
    p = _params(request)
    parent = forced_parent or p.get("parentid")
    types = {t.lower() for t in _csv(p.get("includeitemtypes"))}
    excl = {t.lower() for t in _csv(p.get("excludeitemtypes"))}
    media_types = {t.lower() for t in _csv(p.get("mediatypes"))}
    recursive = (p.get("recursive") or "").lower() == "true"
    filters = {f.lower() for f in _csv(p.get("filters"))}
    if (p.get("isplayed") or "").lower() == "true":
        filters.add("isplayed")
    if (p.get("isplayed") or "").lower() == "false":
        filters.add("isunplayed")
    if (p.get("isfavorite") or "").lower() == "true":
        filters.add("isfavorite")
    term = (p.get("searchterm") or p.get("namestartswith") or "").strip().lower()
    ids = _csv(p.get("ids"))
    genres = {g.lower() for g in _csv((p.get("genres") or "").replace("|", ","))}
    if "music" in media_types or types & {"audio", "musicalbum", "musicartist", "person", "playlist", "boxset",
                                          "tvchannel", "livetvprogram", "folder", "collectionfolder"} and not \
            types & {"movie", "series", "episode", "season", "video"}:
        return [], 0

    entries = []  # (art, rohdaten, dto)
    libs = {l["id"]: l for l in libs_for(u)}

    def add_items(rows):
        for it in rows:
            entries.append(("item", it, item_dto(ctx, it, lib=libs.get(it["library_id"]))))

    def add_series(rows):
        for s in rows:
            entries.append(("series", s, series_dto(ctx, s)))

    if ids:
        for ref in ids:
            try:
                kind, dto, raw = resolve(ctx, ref)
                entries.append((kind, raw, dto))
            except HTTPException:
                pass
    elif parent:
        pp = parse_id(parent)
        if not pp:
            return [], 0
        kind, a, b = pp
        if kind == K_LIB:
            lib = libs.get(a)
            if not lib:
                raise HTTPException(404)
            if lib["kind"] == "serien":
                if types & {"episode"} or (recursive and not types & {"series"} and "isresumable" in filters):
                    add_items(all_episodes(u, [a]))
                elif types & {"season"}:
                    for s in all_series(u, [a]):
                        eps = _series_items(u, s["id"])
                        for n in sorted({e["season"] if e["season"] is not None else 1 for e in eps}):
                            entries.append(("season", s, season_dto(ctx, s, n, [e for e in eps if (
                                e["season"] if e["season"] is not None else 1) == n])))
                else:
                    add_series(all_series(u, [a]))
                    if recursive and (not types or "episode" in types):
                        add_items(all_episodes(u, [a]))
            else:
                add_items(all_movies(u, [a]))
        elif kind == K_SERIES:
            s = db.q1("SELECT * FROM series WHERE id=?", (a,))
            if not series_visible(u, s):
                raise HTTPException(404)
            eps = _series_items(u, a)
            if recursive or types & {"episode"}:
                for e in eps:
                    entries.append(("item", e, item_dto(ctx, e, series=s)))
            else:
                for n in sorted({e["season"] if e["season"] is not None else 1 for e in eps}):
                    entries.append(("season", s, season_dto(ctx, s, n, [e for e in eps if (
                        e["season"] if e["season"] is not None else 1) == n])))
        elif kind == K_SEASON:
            s = db.q1("SELECT * FROM series WHERE id=?", (a,))
            if not series_visible(u, s):
                raise HTTPException(404)
            for e in _series_items(u, a):
                if (e["season"] if e["season"] is not None else 1) == b:
                    entries.append(("item", e, item_dto(ctx, e, series=s)))
        else:
            return [], 0
    else:
        lib_ids = list(libs)
        want_movies = not types or types & {"movie", "video"}
        want_series = not types and not media_types or "series" in types
        want_eps = "episode" in types or ("isresumable" in filters and not types) or \
            ("video" in media_types and not types)
        if want_movies:
            add_items(all_movies(u, [l for l in lib_ids if libs[l]["kind"] != "serien"]))
        if want_series:
            add_series(all_series(u, lib_ids))
        if want_eps:
            add_items(all_episodes(u, lib_ids))

    # Filtern
    def keep(e):
        kind, raw, dto = e
        t = dto["Type"].lower()
        if types and t not in types and not (t == "movie" and "video" in types):
            return False
        if t in excl:
            return False
        if media_types and "video" in media_types and t not in ("movie", "episode"):
            return False
        ud = dto.get("UserData") or {}
        if "isresumable" in filters and not (ud.get("PlaybackPositionTicks") or 0) > 0:
            return False
        if "isplayed" in filters and not ud.get("Played"):
            return False
        if "isunplayed" in filters and ud.get("Played"):
            return False
        if "isfavorite" in filters and not ud.get("IsFavorite"):
            return False
        if term:
            hay = (dto.get("Name") or "").lower() + " " + (dto.get("SeriesName") or "").lower()
            if term not in hay:
                return False
        if genres and not genres & {g.lower() for g in dto.get("Genres") or []}:
            return False
        years = _csv(p.get("years"))
        if years and str(dto.get("ProductionYear")) not in years:
            return False
        return True

    entries = [e for e in entries if keep(e)]
    sort_by = _csv(p.get("sortby"))
    if "isresumable" in filters and not sort_by:
        sort_by, p["sortorder"] = ["DatePlayed"], "Descending"
    if sort_by and sort_by[0].lower() == "random":
        random.shuffle(entries)
    elif sort_by:
        desc = (p.get("sortorder") or "").lower().startswith("desc")
        entries.sort(key=_sort_key_fn(ctx, sort_by), reverse=desc)
    total = len(entries)
    start = int(p.get("startindex") or 0)
    limit = int(p["limit"]) if (p.get("limit") or "").isdigit() else None
    page = entries[start:start + limit] if limit is not None else entries[start:]
    return [e[2] for e in page], total


def _items_response(dtos, total, start=0):
    return {"Items": dtos, "TotalRecordCount": total, "StartIndex": start}


@router.get("/Items")
@router.get("/Users/{uid}/Items")
def items(request: Request, uid: Optional[str] = None):
    ctx = Ctx(user_from(request))
    dtos, total = query_items(ctx, request)
    return _items_response(dtos, total, int(_params(request).get("startindex") or 0))


@router.get("/UserViews")
@router.get("/Users/{uid}/Views")
def views(request: Request, uid: Optional[str] = None):
    ctx = Ctx(user_from(request))
    d = [lib_dto(ctx, l) for l in libs_for(ctx.u)]
    return _items_response(d, len(d))


@router.get("/Items/Root")
@router.get("/Users/{uid}/Items/Root")
def root_folder(request: Request, uid: Optional[str] = None):
    user_from(request)
    return {"Name": "Kinowerk", "ServerId": server_id(), "Id": server_id(), "Type": "UserRootFolder",
            "IsFolder": True, "ImageTags": {}, "BackdropImageTags": []}


@router.get("/UserItems/Resume")
@router.get("/Users/{uid}/Items/Resume")
def resume(request: Request, uid: Optional[str] = None):
    ctx = Ctx(user_from(request))
    p = _params(request)
    rows = []
    for item_id, pr in ctx.prog().items():
        if pr.get("watched") or not (pr.get("position") or 0) > 5:
            continue
        it = db.q1("SELECT * FROM items WHERE id=?", (item_id,))
        if visible_item(ctx.u, it):
            if p.get("parentid"):
                pp = parse_id(p["parentid"])
                if pp and pp[0] == K_LIB and it["library_id"] != pp[1]:
                    continue
            rows.append((pr.get("updated") or 0, it))
    rows.sort(key=lambda r: -r[0])
    seen, out = set(), []
    for _, it in rows:
        k = M()._group_key(it)
        if k in seen:
            continue
        seen.add(k)
        out.append(item_dto(ctx, it))
    total = len(out)
    start = int(p.get("startindex") or 0)
    lim = int(p["limit"]) if (p.get("limit") or "").isdigit() else None
    out = out[start:start + lim] if lim else out[start:]
    return _items_response(out, total, start)


@router.get("/Shows/NextUp")
def next_up(request: Request):
    ctx = Ctx(user_from(request))
    p = _params(request)
    prog = ctx.prog()
    want_series = parse_id(p.get("seriesid") or "")
    candidates = []
    series_rows = db.q("SELECT DISTINCT series_id FROM items WHERE series_id IS NOT NULL AND id IN "
                       "(SELECT item_id FROM progress WHERE user_id=?)", (ctx.u["id"],))
    sids = [r["series_id"] for r in series_rows]
    if want_series and want_series[0] == K_SERIES:
        sids = [want_series[1]]
    for sid in sids:
        s = db.q1("SELECT * FROM series WHERE id=?", (sid,))
        if not series_visible(ctx.u, s):
            continue
        if p.get("parentid"):
            pp = parse_id(p["parentid"])
            if pp and pp[0] == K_LIB and s["library_id"] != pp[1]:
                continue
        eps = _series_items(ctx.u, sid)
        last_idx, last_time = -1, 0
        for i, e in enumerate(eps):
            pr = prog.get(e["id"]) or {}
            if pr.get("watched") and (pr.get("updated") or 0) >= last_time:
                last_idx, last_time = i, pr.get("updated") or 0
        if last_idx < 0:
            continue
        for e in eps[last_idx + 1:]:
            pr = prog.get(e["id"]) or {}
            if not pr.get("watched") and not (pr.get("position") or 0) > 5:
                candidates.append((last_time, e, s))
                break
    candidates.sort(key=lambda c: -c[0])
    out = [item_dto(ctx, e, series=s) for _, e, s in candidates]
    total = len(out)
    start = int(p.get("startindex") or 0)
    lim = int(p["limit"]) if (p.get("limit") or "").isdigit() else None
    out = out[start:start + lim] if lim else out[start:]
    return _items_response(out, total, start)


@router.get("/Items/Latest")
@router.get("/Users/{uid}/Items/Latest")
def latest(request: Request, uid: Optional[str] = None):
    ctx = Ctx(user_from(request))
    p = _params(request)
    lim = int(p["limit"]) if (p.get("limit") or "").isdigit() else 16
    libs = {l["id"]: l for l in libs_for(ctx.u)}
    lib_ids = list(libs)
    pp = parse_id(p.get("parentid") or "")
    if pp and pp[0] == K_LIB:
        lib_ids = [pp[1]] if pp[1] in libs else []
    out = []
    movies = all_movies(ctx.u, [l for l in lib_ids if libs[l]["kind"] != "serien"])
    movies.sort(key=lambda it: -(it.get("added") or 0))
    for it in movies[:lim]:
        out.append((it.get("added") or 0, item_dto(ctx, it, lib=libs.get(it["library_id"]))))
    ser = [l for l in lib_ids if libs[l]["kind"] == "serien"]
    if ser:
        rows = db.q(f"SELECT series_id, MAX(added) a FROM items WHERE library_id IN ({','.join('?' * len(ser))}) "
                    "AND series_id IS NOT NULL GROUP BY series_id ORDER BY a DESC LIMIT ?", (*ser, lim * 2))
        for r in rows:
            s = db.q1("SELECT * FROM series WHERE id=?", (r["series_id"],))
            if series_visible(ctx.u, s):
                out.append((r["a"] or 0, series_dto(ctx, s)))
    out.sort(key=lambda x: -x[0])
    if (p.get("isplayed") or "").lower() == "false":
        out = [x for x in out if not (x[1].get("UserData") or {}).get("Played")]
    return [x[1] for x in out[:lim]]


@router.get("/Items/Filters")
@router.get("/Items/Filters2")
def item_filters(request: Request):
    user_from(request)
    return {"Genres": [], "Tags": [], "OfficialRatings": [], "Years": []}


@router.get("/Genres")
@router.get("/Persons")
@router.get("/Studios")
@router.get("/Artists")
@router.get("/Artists/AlbumArtists")
@router.get("/MusicGenres")
@router.get("/OfficialRatings")
@router.get("/Tags")
@router.get("/Years")
@router.get("/Playlists")
@router.get("/Collections")
@router.get("/LiveTv/Channels")
@router.get("/LiveTv/Programs")
@router.get("/LiveTv/Timers")
@router.get("/LiveTv/SeriesTimers")
@router.get("/Videos/ActiveEncodings")
def empty_list(request: Request):
    user_from(request)
    return _items_response([], 0)


@router.get("/LiveTv/Info")
def livetv_info(request: Request):
    return {"Services": [], "IsEnabled": False, "EnabledUsers": []}


@router.get("/Items/{ref}/Similar")
@router.get("/Items/{ref}/ThemeMedia")
@router.get("/Items/{ref}/SpecialFeatures")
@router.get("/Items/{ref}/LocalTrailers")
@router.get("/Users/{uid}/Items/{ref}/SpecialFeatures")
@router.get("/Users/{uid}/Items/{ref}/LocalTrailers")
@router.get("/Items/{ref}/Trickplay")
def empty_for_item(ref: str, request: Request, uid: Optional[str] = None):
    user_from(request)
    if "Special" in request.url.path or "Trailers" in request.url.path:
        return []
    return _items_response([], 0)


@router.get("/MediaSegments/{ref}")
def media_segments(ref: str, request: Request):
    user_from(request)
    return _items_response([], 0)


@router.get("/Items/{ref}/Ancestors")
def ancestors(ref: str, request: Request):
    ctx = Ctx(user_from(request))
    kind, dto, raw = resolve(ctx, ref)
    out = []
    if kind == "item" and raw.get("series_id") and raw["kind"] == "episode":
        s = db.q1("SELECT * FROM series WHERE id=?", (raw["series_id"],))
        n = raw["season"] if raw["season"] is not None else 1
        out.append(season_dto(ctx, s, n, []))
        out.append(series_dto(ctx, s))
    elif kind == "season":
        out.append(series_dto(ctx, raw[0]))
    lib_id = raw["library_id"] if isinstance(raw, dict) and "library_id" in raw else (
        raw[0]["library_id"] if kind == "season" else None)
    if lib_id:
        lib = db.q1("SELECT * FROM libraries WHERE id=?", (lib_id,))
        if lib:
            out.append(lib_dto(ctx, lib))
    return out


@router.get("/Items/{ref}")
@router.get("/Users/{uid}/Items/{ref}")
def item_one(ref: str, request: Request, uid: Optional[str] = None):
    if ref in ("Root",):
        return root_folder(request)
    ctx = Ctx(user_from(request))
    return resolve(ctx, ref, full=True)[1]


@router.get("/Shows/{ref}/Seasons")
def seasons(ref: str, request: Request):
    ctx = Ctx(user_from(request))
    pp = parse_id(ref)
    if not pp or pp[0] != K_SERIES:
        raise HTTPException(404)
    s = db.q1("SELECT * FROM series WHERE id=?", (pp[1],))
    if not series_visible(ctx.u, s):
        raise HTTPException(404)
    eps = _series_items(ctx.u, s["id"])
    out = []
    for n in sorted({e["season"] if e["season"] is not None else 1 for e in eps}):
        out.append(season_dto(ctx, s, n, [e for e in eps if (e["season"] if e["season"] is not None else 1) == n]))
    return _items_response(out, len(out))


@router.get("/Shows/{ref}/Episodes")
def episodes(ref: str, request: Request):
    ctx = Ctx(user_from(request))
    p = _params(request)
    pp = parse_id(ref)
    if not pp or pp[0] != K_SERIES:
        raise HTTPException(404)
    s = db.q1("SELECT * FROM series WHERE id=?", (pp[1],))
    if not series_visible(ctx.u, s):
        raise HTTPException(404)
    eps = _series_items(ctx.u, s["id"])
    sp = parse_id(p.get("seasonid") or "")
    if sp and sp[0] == K_SEASON:
        eps = [e for e in eps if (e["season"] if e["season"] is not None else 1) == sp[2]]
    elif (p.get("season") or "").isdigit():
        eps = [e for e in eps if (e["season"] if e["season"] is not None else 1) == int(p["season"])]
    out = [item_dto(ctx, e, series=s) for e in eps]
    total = len(out)
    if p.get("startitemid"):
        idx = next((i for i, d in enumerate(out) if d["Id"] == p["startitemid"]), 0)
        out = out[idx:]
    start = int(p.get("startindex") or 0)
    lim = int(p["limit"]) if (p.get("limit") or "").isdigit() else None
    out = out[start:start + lim] if lim else out[start:]
    return _items_response(out, total, start)


# ---------------------------------------------------------------- Bilder

def _image_path(ref, itype):
    pp = parse_id(ref)
    if not pp:
        return None
    kind, a, b = pp
    itype = itype.lower()
    img = os.path.join(db.DATA_DIR, "images")
    if kind == K_ITEM:
        it = db.q1("SELECT * FROM items WHERE id=?", (a,))
        if not it:
            return None
        is_ep = it["kind"] == "episode" and it.get("series_id")
        if itype == "backdrop":
            if it.get("backdrop"):
                return os.path.join(img, os.path.basename(it["backdrop"]))
            if is_ep:
                s = db.q1("SELECT backdrop FROM series WHERE id=?", (it["series_id"],))
                if s and s["backdrop"]:
                    return os.path.join(img, os.path.basename(s["backdrop"]))
            return library.thumbnail(it)
        if itype == "primary" and it.get("poster") and not is_ep:
            return os.path.join(img, os.path.basename(it["poster"]))
        return library.thumbnail(it)
    if kind in (K_SERIES, K_SEASON):
        s = db.q1("SELECT * FROM series WHERE id=?", (a,))
        if not s:
            return None
        if itype == "backdrop" and s.get("backdrop"):
            return os.path.join(img, os.path.basename(s["backdrop"]))
        if s.get("poster"):
            return os.path.join(img, os.path.basename(s["poster"]))
        e = db.q1("SELECT * FROM items WHERE series_id=? ORDER BY season, episode LIMIT 1", (a,))
        return library.thumbnail(e) if e else None
    if kind == K_LIB:
        e = db.q1("SELECT * FROM items WHERE library_id=? ORDER BY added DESC LIMIT 1", (a,))
        if e and e.get("backdrop"):
            return os.path.join(img, os.path.basename(e["backdrop"]))
        return library.thumbnail(e) if e else None
    return None


@router.get("/Items/{ref}/Images/{itype}")
@router.get("/Items/{ref}/Images/{itype}/{index}")
async def item_image(ref: str, itype: str, index: Optional[int] = None):
    p = await asyncio.to_thread(_image_path, ref, itype)
    if not p or not os.path.exists(p):
        raise HTTPException(404)
    return FileResponse(p, headers={"Cache-Control": "max-age=2592000"})


@router.get("/Users/{uid}/Images/{itype}")
def user_image(uid: str, itype: str):
    raise HTTPException(404)


# ---------------------------------------------------------------- Gesehen / Favoriten / Fortschritt

def _item_ids_for(ctx, ref):
    kind, dto, raw = resolve(ctx, ref)
    if kind == "item":
        return [raw], dto
    if kind == "series":
        return _series_items(ctx.u, raw["id"]), dto
    if kind == "season":
        return raw[2], dto
    return [], dto


def _set_watched(ctx, rows, watched):
    now = time.time()
    m = M()
    for it in rows:
        for x in m.siblings(it):
            db.run("INSERT INTO progress(user_id,item_id,position,duration,watched,updated) VALUES(?,?,0,?,?,?) "
                   "ON CONFLICT(user_id,item_id) DO UPDATE SET watched=excluded.watched, position=0, "
                   "updated=excluded.updated", (ctx.u["id"], x["id"], x.get("duration") or 0, watched, now))


@router.post("/UserPlayedItems/{ref}")
@router.post("/Users/{uid}/PlayedItems/{ref}")
def mark_played(ref: str, request: Request, uid: Optional[str] = None):
    ctx = Ctx(user_from(request))
    rows, _ = _item_ids_for(ctx, ref)
    _set_watched(ctx, rows, 1)
    return resolve(Ctx(ctx.u), ref)[1]["UserData"]


@router.delete("/UserPlayedItems/{ref}")
@router.delete("/Users/{uid}/PlayedItems/{ref}")
def mark_unplayed(ref: str, request: Request, uid: Optional[str] = None):
    ctx = Ctx(user_from(request))
    rows, _ = _item_ids_for(ctx, ref)
    _set_watched(ctx, rows, 0)
    return resolve(Ctx(ctx.u), ref)[1]["UserData"]


@router.post("/UserFavoriteItems/{ref}")
@router.post("/Users/{uid}/FavoriteItems/{ref}")
def fav_add(ref: str, request: Request, uid: Optional[str] = None):
    ctx = Ctx(user_from(request))
    resolve(ctx, ref)
    db.run("INSERT OR IGNORE INTO jf_favorites(user_id, ref) VALUES(?,?)", (ctx.u["id"], ref))
    return resolve(Ctx(ctx.u), ref)[1]["UserData"]


@router.delete("/UserFavoriteItems/{ref}")
@router.delete("/Users/{uid}/FavoriteItems/{ref}")
def fav_del(ref: str, request: Request, uid: Optional[str] = None):
    ctx = Ctx(user_from(request))
    db.run("DELETE FROM jf_favorites WHERE user_id=? AND ref=?", (ctx.u["id"], ref))
    return resolve(Ctx(ctx.u), ref)[1]["UserData"]


@router.get("/UserItems/{ref}/UserData")
@router.get("/Users/{uid}/Items/{ref}/UserData")
def get_userdata(ref: str, request: Request, uid: Optional[str] = None):
    ctx = Ctx(user_from(request))
    return resolve(ctx, ref)[1]["UserData"]


@router.post("/UserItems/{ref}/UserData")
@router.post("/Users/{uid}/Items/{ref}/UserData")
async def set_userdata(ref: str, request: Request, uid: Optional[str] = None):
    ctx = Ctx(user_from(request))
    b = await request.json() if await request.body() else {}
    rows, _ = _item_ids_for(ctx, ref)
    if "Played" in b:
        _set_watched(ctx, rows, 1 if b["Played"] else 0)
    if "PlaybackPositionTicks" in b and len(rows) == 1:
        _save_progress(ctx.u, rows[0], (b["PlaybackPositionTicks"] or 0) / TICKS, final=False)
    if "IsFavorite" in b:
        if b["IsFavorite"]:
            db.run("INSERT OR IGNORE INTO jf_favorites(user_id, ref) VALUES(?,?)", (ctx.u["id"], ref))
        else:
            db.run("DELETE FROM jf_favorites WHERE user_id=? AND ref=?", (ctx.u["id"], ref))
    return resolve(Ctx(ctx.u), ref)[1]["UserData"]


def _save_progress(u, it, pos, final=False):
    dur = it.get("duration") or 0
    watched = 1 if dur and pos / dur > 0.92 else 0
    now = time.time()
    for x in M().siblings(it):
        db.run("INSERT INTO progress(user_id,item_id,position,duration,watched,updated) VALUES(?,?,?,?,?,?) "
               "ON CONFLICT(user_id,item_id) DO UPDATE SET position=excluded.position, duration=excluded.duration, "
               "watched=MAX(watched, excluded.watched), updated=excluded.updated",
               (u["id"], x["id"], pos, dur, watched, now if x["id"] == it["id"] else now - 0.001))


@router.post("/Sessions/Playing")
@router.post("/Sessions/Playing/Progress")
@router.post("/Sessions/Playing/Stopped")
@router.post("/Sessions/Playing/Ping")
async def playing(request: Request):
    u = user_from(request)
    b = await request.json() if await request.body() else {}
    ref = b.get("ItemId") or request.query_params.get("itemId")
    pp = parse_id(ref or "")
    if pp and pp[0] == K_ITEM and b.get("PositionTicks") is not None:
        it = db.q1("SELECT * FROM items WHERE id=?", (pp[1],))
        if visible_item(u, it):
            _save_progress(u, it, (b.get("PositionTicks") or 0) / TICKS,
                           final=request.url.path.endswith("Stopped"))
    if request.url.path.endswith("Stopped") and b.get("PlaySessionId"):
        transcode.stop(b["PlaySessionId"])
    return Response(status_code=204)


# ---------------------------------------------------------------- Abspielen

def _bitrate_quality(br):
    if not br:
        return "original"
    if br >= 12_000_000:
        return "hoch"
    if br >= 5_000_000:
        return "mittel"
    return "niedrig"


@router.get("/Items/{ref}/PlaybackInfo")
@router.post("/Items/{ref}/PlaybackInfo")
async def playback_info(ref: str, request: Request):
    u = user_from(request)
    ctx = Ctx(u)
    b = {}
    if request.method == "POST" and await request.body():
        try:
            b = await request.json()
        except Exception:
            b = {}
    p = _params(request)
    pp = parse_id(ref)
    if not pp or pp[0] != K_ITEM:
        raise HTTPException(404)
    it = db.q1("SELECT * FROM items WHERE id=?", (pp[1],))
    if not visible_item(u, it):
        raise HTTPException(404)
    if not it.get("probed"):
        it = await asyncio.to_thread(library.probe_item, it["id"]) or it
    src = await asyncio.to_thread(media_source, it, True)
    play_sid = uuid.uuid4().hex
    br = b.get("MaxStreamingBitrate") or (int(p["maxstreamingbitrate"]) if (p.get("maxstreamingbitrate") or "")
                                          .isdigit() else None)
    quality = _bitrate_quality(br)
    if quality != "original":
        start = (b.get("StartTimeTicks") or int(p.get("starttimeticks") or 0) or 0) / TICKS
        audio = b.get("AudioStreamIndex", p.get("audiostreamindex"))
        tok = _token_from(request)
        q = f"PlaySessionId={play_sid}&MediaSourceId={src['Id']}&StartTimeTicks={int(start * TICKS)}" \
            f"&Quality={quality}&ApiKey={tok}"
        if audio not in (None, ""):
            q += f"&AudioStreamIndex={audio}"
        src["TranscodingUrl"] = f"/Videos/{ref}/master.m3u8?{q}"
        src["TranscodingSubProtocol"] = "hls"
        src["TranscodingContainer"] = "ts"
        src["SupportsDirectPlay"] = False
        src["SupportsDirectStream"] = False
    return {"MediaSources": [src], "PlaySessionId": play_sid}


def _stream_item(request: Request, ref: str):
    u = user_from(request)
    pp = parse_id(ref)
    if not pp or pp[0] != K_ITEM:
        raise HTTPException(404)
    it = db.q1("SELECT * FROM items WHERE id=?", (pp[1],))
    if not visible_item(u, it):
        raise HTTPException(404)
    return u, it


_MIME = {"mp4": "video/mp4", "m4v": "video/mp4", "mov": "video/quicktime", "mkv": "video/x-matroska",
         "avi": "video/x-msvideo", "ts": "video/mp2t", "webm": "video/webm", "wmv": "video/x-ms-wmv"}


@router.get("/Videos/{ref}/stream")
@router.head("/Videos/{ref}/stream")
@router.get("/Videos/{ref}/stream.{ext}")
@router.head("/Videos/{ref}/stream.{ext}")
def video_stream(ref: str, request: Request, ext: Optional[str] = None):
    u, it = _stream_item(request, ref)
    fext = os.path.splitext(it["path"])[1].lstrip(".").lower()
    return FileResponse(it["path"], media_type=_MIME.get(fext, "application/octet-stream"),
                        filename=None, headers={"Accept-Ranges": "bytes"})


@router.get("/Items/{ref}/Download")
def download(ref: str, request: Request):
    u, it = _stream_item(request, ref)
    return FileResponse(it["path"], filename=os.path.basename(it["path"]))


def _audio_index(it, jf_index):
    """Jellyfin-Stream-Index → laufende Nummer der Tonspur in Kinowerk."""
    if jf_index in (None, ""):
        return None
    try:
        jf_index = int(jf_index)
    except ValueError:
        return None
    streams, _, _ = media_streams(it)
    n = 0
    for s in streams:
        if s["Type"] == "Audio":
            if s["Index"] == jf_index:
                return n
            n += 1
    return None


@router.get("/Videos/{ref}/master.m3u8")
@router.get("/Videos/{ref}/main.m3u8")
async def hls_master(ref: str, request: Request):
    u, it = _stream_item(request, ref)
    p = _params(request)
    if not it.get("probed"):
        it = await asyncio.to_thread(library.probe_item, it["id"]) or it
    start = int(p.get("starttimeticks") or 0) / TICKS
    audio = _audio_index(it, p.get("audiostreamindex"))
    if audio is None:
        audio = M().default_audio(it, json.loads(u["prefs"] or "{}").get("audio_lang"))
    quality = p.get("quality") or _bitrate_quality(int(p["maxstreamingbitrate"]) if (
        p.get("maxstreamingbitrate") or "").isdigit() else None)
    if quality not in ("original", "hoch", "mittel", "niedrig"):
        quality = "mittel"
    old = p.get("playsessionid")
    if old:
        transcode.stop(old)
    s = await asyncio.to_thread(transcode.start, it, start, audio, quality)
    _sessions_alias[old or s.id] = s.id
    txt = await asyncio.to_thread(s.playlist)
    if txt is None:
        log.warning("Umwandlung startet nicht:\n%s", s.error_log())
        raise HTTPException(500, "Umwandlung fehlgeschlagen")
    # Haupt-Playlist zeigt auf die laufende Sitzung; Segmente liegen unter /Videos/hls/<Sitzung>/…
    # (die Sitzungsnummer ist geheim und zufällig, daher ohne Schlüssel abrufbar)
    bw = {"hoch": 10_000_000, "mittel": 5_000_000, "niedrig": 2_000_000}.get(quality, 20_000_000)
    body = ("#EXTM3U\n#EXT-X-VERSION:3\n"
            f"#EXT-X-STREAM-INF:BANDWIDTH={bw},AVERAGE-BANDWIDTH={bw}\n"
            f"/Videos/hls/{s.id}/index.m3u8\n")
    return Response(body, media_type="application/vnd.apple.mpegurl", headers={"Cache-Control": "no-cache"})


_sessions_alias = {}


@router.get("/Videos/hls/{sid}/{seg}")
async def hls_segment(sid: str, seg: str):
    s = transcode.get(sid)
    if not s:
        raise HTTPException(404)
    s.last_seen = time.time()
    if seg.endswith(".m3u8"):
        txt = await asyncio.to_thread(s.playlist)
        return Response(txt or "", media_type="application/vnd.apple.mpegurl")
    path = os.path.join(s.dir, os.path.basename(seg))
    for _ in range(150):
        if os.path.exists(path):
            return FileResponse(path, media_type="video/mp2t")
        await asyncio.sleep(0.2)
    raise HTTPException(404)


@router.delete("/Videos/ActiveEncodings")
def stop_encodings(request: Request):
    sid = request.query_params.get("playSessionId") or request.query_params.get("PlaySessionId")
    if sid:
        transcode.stop(_sessions_alias.pop(sid, sid))
    return Response(status_code=204)


# ---------------------------------------------------------------- Websocket (nur Lebenszeichen)

try:
    from fastapi import WebSocket, WebSocketDisconnect

    @router.websocket("/socket")
    async def socket_ep(ws: WebSocket):
        await ws.accept()
        try:
            await ws.send_json({"MessageType": "ForceKeepAlive", "Data": 60})
            while True:
                msg = await ws.receive_text()
                if "KeepAlive" in msg:
                    await ws.send_json({"MessageType": "KeepAlive"})
        except WebSocketDisconnect:
            pass
        except Exception:
            pass
except Exception:  # pragma: no cover
    pass


# ---------------------------------------------------------------- Suche im Heimnetz (UDP 7359)

def discovery_thread(port_http):
    """Antwortet auf „who is JellyfinServer?“, damit Apps Kinowerk im Heimnetz von selbst finden."""
    def run():
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.bind(("", 7359))
        except OSError as e:
            log.info("Jellyfin-Suche (UDP 7359) nicht verfügbar: %s", e)
            return
        while True:
            try:
                data, addr = sock.recvfrom(1024)
                if b"jellyfinserver" not in data.lower() and b"emby" not in data.lower():
                    continue
                probe = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                try:
                    probe.connect((addr[0], 9))
                    my_ip = probe.getsockname()[0]
                finally:
                    probe.close()
                reply = {"Address": f"http://{my_ip}:{port_http}", "Id": server_id(), "Name": server_name(),
                         "EndpointAddress": None}
                sock.sendto(json.dumps(reply).encode(), addr)
            except Exception as e:  # pragma: no cover
                log.debug("Suche: %s", e)
    threading.Thread(target=run, daemon=True).start()


def init():
    db.conn().executescript("CREATE TABLE IF NOT EXISTS jf_favorites (user_id INTEGER NOT NULL, ref TEXT NOT NULL, "
                            "PRIMARY KEY(user_id, ref));")
    db.conn().commit()
    server_id()

"""Auf Fernseher abspielen (DLNA/UPnP): Fernseher im Heimnetz finden, Film hinschicken und fernsteuern.
Der Fernseher holt den Film selbst vom Server – je nach Format direkt oder live umgewandelt (MPEG-TS)."""
import json
import logging
import os
import re
import secrets
import socket
import subprocess
import threading
import time
from urllib.parse import urljoin
from xml.sax.saxutils import escape as xesc

import httpx

from . import db, transcode

log = logging.getLogger("mediathek.cast")

SSDP_ADDR = ("239.255.255.250", 1900)
AVT = "urn:schemas-upnp-org:service:AVTransport:1"
RC = "urn:schemas-upnp-org:service:RenderingControl:1"

devices = {}        # usn -> Gerät
_dev_lock = threading.Lock()
tokens = {}         # Stream-Token -> Auftrag
sessions = {}       # usn -> laufende Wiedergabe (item, offset, mode, token)

# Was der Fernseher selbst abspielen kann (LG webOS & Co.)
DIRECT_VIDEO = {"h264", "hevc", "mpeg2video", "mpeg4"}
DIRECT_AUDIO = {"aac", "ac3", "eac3", "mp3", "mp2"}


# ---------------------------------------------------------------- Geräte finden

def _ssdp_search(timeout=3.0, extra_ips=()):
    msg = ("M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1900\r\nMAN: \"ssdp:discover\"\r\nMX: 2\r\n"
           "ST: urn:schemas-upnp-org:device:MediaRenderer:1\r\n\r\n").encode()
    found = {}
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    s.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 2)
    s.settimeout(0.5)
    try:
        for _ in range(2):
            try:
                s.sendto(msg, SSDP_ADDR)
            except OSError as e:
                log.warning("SSDP-Multicast nicht möglich: %s", e)
            for ip in extra_ips:
                try:
                    s.sendto(msg, (ip, 1900))
                except OSError:
                    pass
        end = time.time() + timeout
        while time.time() < end:
            try:
                data, addr = s.recvfrom(4096)
            except socket.timeout:
                continue
            txt = data.decode(errors="replace")
            loc = re.search(r"^location:\s*(\S+)", txt, re.I | re.M)
            usn = re.search(r"^usn:\s*(\S+)", txt, re.I | re.M)
            if loc:
                found[loc.group(1)] = (usn.group(1).split("::")[0] if usn else loc.group(1), addr[0])
    finally:
        s.close()
    return found


def _tag(xml, name):
    m = re.search(rf"<(?:\w+:)?{name}[^>]*>(.*?)</(?:\w+:)?{name}>", xml, re.S)
    return m.group(1).strip() if m else ""


def _describe(location, usn, ip):
    r = httpx.get(location, timeout=5)
    r.raise_for_status()
    xml = r.text
    base = _tag(xml, "URLBase") or location
    services = {}
    for sv in re.findall(r"<(?:\w+:)?service>(.*?)</(?:\w+:)?service>", xml, re.S):
        st = _tag(sv, "serviceType")
        ctrl = _tag(sv, "controlURL")
        if "AVTransport" in st:
            services["avt"] = (st, urljoin(base, ctrl))
        elif "RenderingControl" in st:
            services["rc"] = (st, urljoin(base, ctrl))
    if "avt" not in services:
        return None
    name = _tag(xml, "friendlyName") or ip
    name = re.sub(r"&amp;", "&", name)
    return {"usn": usn, "name": name, "ip": ip, "location": location, "services": services,
            "manufacturer": _tag(xml, "manufacturer"), "model": _tag(xml, "modelName"), "seen": time.time()}


def discover():
    extra = [x.strip() for x in (db.get_setting("tv_ips") or "").replace(";", ",").split(",") if x.strip()]
    found = _ssdp_search(extra_ips=extra)
    for loc, (usn, ip) in found.items():
        try:
            d = _describe(loc, usn, ip)
        except Exception as e:
            log.info("Gerät %s nicht lesbar: %s", loc, e)
            continue
        if d:
            with _dev_lock:
                devices[d["usn"]] = d
    now = time.time()
    with _dev_lock:
        for k in [k for k, v in devices.items() if now - v["seen"] > 3600]:
            devices.pop(k, None)
        return [{"id": d["usn"], "name": d["name"], "ip": d["ip"], "model": d["model"]} for d in devices.values()]


def add_manual(location):
    """Gerät über seine Beschreibungs-Adresse hinzufügen (falls die automatische Suche nichts findet)."""
    ip = re.sub(r"^https?://([^/:]+).*", r"\1", location)
    d = _describe(location, "manual:" + location, ip)
    if not d:
        raise RuntimeError("Unter dieser Adresse ist kein abspielfähiges Gerät")
    with _dev_lock:
        devices[d["usn"]] = d
    return d


def get_device(usn):
    with _dev_lock:
        d = devices.get(usn)
    if not d:
        discover()
        with _dev_lock:
            d = devices.get(usn)
    if not d:
        raise RuntimeError("Fernseher nicht gefunden – ist er eingeschaltet?")
    return d


# ---------------------------------------------------------------- SOAP

def soap(dev, svc, action, args, timeout=8):
    st, url = dev["services"][svc]
    body = "".join(f"<{k}>{xesc(str(v))}</{k}>" for k, v in args)
    env = ('<?xml version="1.0" encoding="utf-8"?>'
           '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" '
           's:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body>'
           f'<u:{action} xmlns:u="{st}">{body}</u:{action}></s:Body></s:Envelope>')
    r = httpx.post(url, content=env.encode("utf-8"), timeout=timeout, headers={
        "Content-Type": 'text/xml; charset="utf-8"', "SOAPACTION": f'"{st}#{action}"'})
    if r.status_code >= 400:
        err = _tag(r.text, "errorDescription") or _tag(r.text, "faultstring") or r.text[:200]
        raise RuntimeError(f"Fernseher meldet Fehler bei {action}: {err}")
    return r.text


def _hms(sec):
    sec = max(0, int(sec))
    return f"{sec // 3600}:{sec % 3600 // 60:02d}:{sec % 60:02d}"


def _sec(hms):
    try:
        p = [float(x) for x in hms.split(":")]
        return p[0] * 3600 + p[1] * 60 + p[2]
    except Exception:
        return 0.0


# ---------------------------------------------------------------- Abspielen

def local_ip_for(target_ip):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect((target_ip, 9))
        return s.getsockname()[0]
    finally:
        s.close()


def plan(item, audio_idx):
    """Direkt abspielen oder umwandeln? Gibt (mode, mime) zurück."""
    audio = json.loads(item.get("audio") or "[]")
    fmt = item.get("container") or ""
    vc = item.get("vcodec") or ""
    a = audio[audio_idx] if audio and audio_idx < len(audio) else (audio[0] if audio else None)
    default_idx = next((i for i, x in enumerate(audio) if x.get("default")), 0)
    direct_ok = (vc in DIRECT_VIDEO and (a is None or a["codec"] in DIRECT_AUDIO)
                 and (len(audio) <= 1 or audio_idx == default_idx)
                 and (item.get("height") or 0) <= 2160)
    if direct_ok:
        if "matroska" in fmt:
            return "direct", "video/x-matroska"
        if "mp4" in fmt or "mov" in fmt:
            return "direct", "video/mp4"
        if "mpegts" in fmt:
            return "direct", "video/mpeg"
        if "avi" in fmt:
            return "direct", "video/x-msvideo"
    return "transcode", "video/mpeg"


def _state(dev):
    try:
        return _tag(soap(dev, "avt", "GetTransportInfo", [("InstanceID", 0)], timeout=3), "CurrentTransportState") or ""
    except Exception:
        return ""


def _busy_err(e):
    t = str(e).lower()
    return "transition not available" in t or "701" in t or "transitioning" in t


def _start_on_tv(dev, url, didl):
    """Stop → neue Adresse → Play, mit Geduld: LG-Fernseher melden während eines Wechsels gern
    'Transition not available' (Fehler 701), obwohl sie den Befehl kurz danach annehmen bzw. schon spielen."""
    try:
        soap(dev, "avt", "Stop", [("InstanceID", 0)], timeout=4)
    except Exception:
        pass
    for _ in range(8):                       # bis zu 4 s warten, bis der alte Film wirklich aus ist
        if _state(dev) in ("STOPPED", "NO_MEDIA_PRESENT", ""):
            break
        time.sleep(0.5)
    for attempt in range(4):
        try:
            soap(dev, "avt", "SetAVTransportURI", [("InstanceID", 0), ("CurrentURI", url), ("CurrentURIMetaData", didl)])
            break
        except Exception as e:
            if not _busy_err(e) or attempt == 3:
                raise
            time.sleep(1.5)
    for attempt in range(3):
        try:
            soap(dev, "avt", "Play", [("InstanceID", 0), ("Speed", 1)])
            return
        except Exception as e:
            time.sleep(1.5)
            if _state(dev) in ("PLAYING", "TRANSITIONING"):
                return                       # Fernseher hat von selbst losgelegt
            if not _busy_err(e) or attempt == 2:
                raise


def _wait_playing(dev, seconds=10):
    """Prüfen, ob der Fernseher die Datei annimmt (sonst Rückfall auf Umwandlung)."""
    seen_transition = False
    for _ in range(seconds * 2):
        try:
            st = _tag(soap(dev, "avt", "GetTransportInfo", [("InstanceID", 0)], timeout=3), "CurrentTransportState")
        except Exception:
            st = ""
        if st in ("PLAYING", "PAUSED_PLAYBACK"):
            return True
        if st == "TRANSITIONING":
            seen_transition = True
        elif st in ("STOPPED", "NO_MEDIA_PRESENT") and seen_transition:
            return False
        time.sleep(0.5)
    return True   # keine eindeutige Rückmeldung: lieber nicht umschalten


def start(usn, item, start_pos, audio_idx, title, poster_url=None, force_transcode=False):
    dev = get_device(usn)
    mode, mime = plan(item, audio_idx)
    if force_transcode:
        mode, mime = "transcode", "video/mpeg"
    tok = secrets.token_urlsafe(18)
    tokens[tok] = {"item_id": item["id"], "path": item["path"], "start": float(start_pos or 0) if mode == "transcode" else 0,
                   "audio": audio_idx, "mode": mode, "mime": mime, "created": time.time(), "item": item}
    host = local_ip_for(dev["ip"])
    port = int(os.environ.get("MEDIATHEK_PORT", "8080"))
    url = f"http://{host}:{port}/cast/stream/{tok}"
    if mode == "direct":
        pinfo = f"http-get:*:{mime}:DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000"
    else:
        pinfo = f"http-get:*:{mime}:DLNA.ORG_OP=00;DLNA.ORG_CI=1;DLNA.ORG_FLAGS=01700000000000000000000000000000"
    dur = item.get("duration") or 0
    art = f"<upnp:albumArtURI>{xesc(poster_url)}</upnp:albumArtURI>" if poster_url else ""
    didl = ('<DIDL-Lite xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/" '
            'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/">'
            f'<item id="{item["id"]}" parentID="0" restricted="1"><dc:title>{xesc(title)}</dc:title>'
            f'<upnp:class>object.item.videoItem.movie</upnp:class>{art}'
            f'<res protocolInfo="{pinfo}" duration="{_hms(dur)}.000">{xesc(url)}</res></item></DIDL-Lite>')
    try:
        _start_on_tv(dev, url, didl)
    except Exception:
        time.sleep(1)
        if _state(dev) in ("PLAYING", "TRANSITIONING"):
            log.info("Fernseher meldete einen Fehler, spielt aber – weiter mit Fernbedienung")
        elif mode == "direct" and not force_transcode:
            log.info("Direktwiedergabe abgelehnt – versuche Umwandlung")
            tokens.pop(tok, None)
            return start(usn, item, start_pos, audio_idx, title, poster_url, force_transcode=True)
        else:
            raise
    if mode == "direct" and not force_transcode and not _wait_playing(dev):
        log.info("Fernseher spielt die Datei nicht direkt – versuche Umwandlung")
        tokens.pop(tok, None)
        return start(usn, item, start_pos, audio_idx, title, poster_url, force_transcode=True)
    old = sessions.get(usn)
    if old:
        tokens.pop(old["token"], None)
    sessions[usn] = {"item_id": item["id"], "offset": tokens[tok]["start"], "mode": mode, "token": tok,
                     "audio": audio_idx, "title": title, "duration": dur, "started": time.time(),
                     "pending_seek": float(start_pos or 0) if (mode == "direct" and start_pos) else 0}
    if mode == "direct" and start_pos and start_pos > 5:
        threading.Thread(target=_seek_when_ready, args=(usn, float(start_pos)), daemon=True).start()
    return {"mode": mode, "device": dev["name"]}


def _seek_when_ready(usn, pos):
    """Bei Direktwiedergabe: warten, bis der Fernseher spielt, dann an die gewünschte Stelle springen."""
    dev = get_device(usn)
    for _ in range(30):
        time.sleep(1)
        try:
            st = _tag(soap(dev, "avt", "GetTransportInfo", [("InstanceID", 0)], timeout=4), "CurrentTransportState")
            if st == "PLAYING":
                time.sleep(1)
                soap(dev, "avt", "Seek", [("InstanceID", 0), ("Unit", "REL_TIME"), ("Target", _hms(pos))])
                break
        except Exception:
            continue
    s = sessions.get(usn)
    if s:
        s["pending_seek"] = 0


def control(usn, action, value=None):
    dev = get_device(usn)
    s = sessions.get(usn)
    if action in ("play", "pause"):
        want = ("PLAYING", "TRANSITIONING") if action == "play" else ("PAUSED_PLAYBACK",)
        try:
            if action == "play":
                soap(dev, "avt", "Play", [("InstanceID", 0), ("Speed", 1)])
            else:
                soap(dev, "avt", "Pause", [("InstanceID", 0)])
        except Exception as e:
            # Doppelter Befehl oder Fernseher gerade im Wechsel: kein Fehler, wenn er schon im gewünschten Zustand ist
            time.sleep(0.6)
            if not (_busy_err(e) and _state(dev) in want + ("TRANSITIONING",)):
                raise
    elif action == "stop":
        try:
            soap(dev, "avt", "Stop", [("InstanceID", 0)])
        finally:
            if s:
                tokens.pop(s["token"], None)
            sessions.pop(usn, None)
    elif action == "seek":
        target = max(0.0, float(value or 0))
        if s and s["mode"] == "transcode":
            # Umgewandelter Stream: neu ab der gewünschten Stelle starten
            item = db.q1("SELECT * FROM items WHERE id=?", (s["item_id"],))
            return start(usn, item, target, s["audio"], s["title"])
        soap(dev, "avt", "Seek", [("InstanceID", 0), ("Unit", "REL_TIME"), ("Target", _hms(target))])
    elif action == "volume":
        if "rc" in dev["services"]:
            soap(dev, "rc", "SetVolume", [("InstanceID", 0), ("Channel", "Master"),
                                          ("DesiredVolume", max(0, min(100, int(value))))])
    elif action == "mute":
        if "rc" in dev["services"]:
            soap(dev, "rc", "SetMute", [("InstanceID", 0), ("Channel", "Master"), ("DesiredMute", 1 if value else 0)])
    return {"ok": True}


def status(usn):
    dev = get_device(usn)
    s = sessions.get(usn) or {}
    out = {"device": dev["name"], "state": "STOPPED", "position": 0, "duration": s.get("duration") or 0,
           "item_id": s.get("item_id"), "title": s.get("title"), "mode": s.get("mode"), "volume": None}
    try:
        ti = soap(dev, "avt", "GetTransportInfo", [("InstanceID", 0)], timeout=4)
        out["state"] = _tag(ti, "CurrentTransportState") or "UNKNOWN"
        pi = soap(dev, "avt", "GetPositionInfo", [("InstanceID", 0)], timeout=4)
        rel = _sec(_tag(pi, "RelTime"))
        out["position"] = (s.get("offset") or 0) + rel
        if s.get("pending_seek"):
            out["position"] = s["pending_seek"]
        td = _sec(_tag(pi, "TrackDuration"))
        if not out["duration"] and td:
            out["duration"] = td
        uri = _tag(pi, "TrackURI")
        if s and uri and s["token"] not in uri and out["state"] in ("PLAYING", "PAUSED_PLAYBACK"):
            out["foreign"] = True   # Fernseher spielt inzwischen etwas anderes
    except Exception as e:
        out["error"] = str(e)
    if "rc" in dev["services"]:
        try:
            out["volume"] = int(_tag(soap(dev, "rc", "GetVolume", [("InstanceID", 0), ("Channel", "Master")], timeout=3),
                                     "CurrentVolume") or 0)
        except Exception:
            pass
    return out


# ---------------------------------------------------------------- Stream für den Fernseher

def token_info(tok):
    t = tokens.get(tok)
    if not t or time.time() - t["created"] > 12 * 3600:
        return None
    return t


def transcode_cmd(t):
    it = t["item"]
    vc = it.get("vcodec") or ""
    mode = transcode.hw_mode()
    copy_video = vc in ("h264", "hevc") and (it.get("height") or 0) <= 2160
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin"]
    if not copy_video and mode == "vaapi":
        if vc in transcode.HW_DECODE:
            cmd += ["-hwaccel", "vaapi", "-hwaccel_device", transcode.RENDER, "-hwaccel_output_format", "vaapi"]
        else:
            cmd += ["-vaapi_device", transcode.RENDER]
    if t["start"] > 0:
        cmd += ["-ss", f"{t['start']:.2f}"]
    cmd += ["-i", it["path"], "-map", "0:v:0", "-map", f"0:a:{t['audio']}?", "-sn", "-dn"]
    if copy_video:
        cmd += ["-c:v", "copy"]
    elif mode == "vaapi":
        vf = "scale_vaapi=w=-2:h=1080:format=nv12" if (it.get("height") or 0) > 1080 else "scale_vaapi=format=nv12"
        if vc not in transcode.HW_DECODE:
            vf = "format=nv12,hwupload," + vf
        cmd += ["-vf", vf, "-c:v", "h264_vaapi", "-b:v", "12000k", "-maxrate", "16000k", "-bufsize", "24000k", "-g", "50"]
    else:
        cmd += ["-vf", "scale=-2:'min(1080,ih)'", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-g", "50"]
    cmd += ["-c:a", "ac3", "-b:a", "448k", "-ac", "6" if _channels(it, t["audio"]) >= 6 else "2",
            "-f", "mpegts", "-muxdelay", "0", "pipe:1"]
    return cmd


def _channels(it, idx):
    try:
        return int(json.loads(it.get("audio") or "[]")[idx].get("ch") or 2)
    except Exception:
        return 2


def stream_transcoded(t):
    cmd = transcode_cmd(t)
    log.info("Fernseher-Stream: %s", " ".join(cmd))
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, bufsize=0)
    try:
        while True:
            chunk = proc.stdout.read(188 * 1024)
            if not chunk:
                break
            yield chunk
    finally:
        if proc.poll() is None:
            proc.kill()
        proc.wait()


def dlna_headers(t):
    if t["mode"] == "direct":
        cf = f"DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000"
    else:
        cf = f"DLNA.ORG_OP=00;DLNA.ORG_CI=1;DLNA.ORG_FLAGS=01700000000000000000000000000000"
    return {"transferMode.dlna.org": "Streaming", "contentFeatures.dlna.org": cf}

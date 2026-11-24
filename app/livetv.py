"""Live-TV: Senderliste und optionaler Durchleitungs-Proxy für HLS-Streams."""
import html as htmlmod
import hashlib
import re
import time
import hmac
import json
import os
import secrets
from urllib.parse import quote, urljoin

from . import db

DEFAULT_CHANNELS = [
    {"name": "Das Erste", "group": "ARD", "url": "https://daserste-live.ard-mcdn.de/daserste/live/hls/int/master.m3u8"},
    {"name": "ZDF", "group": "ZDF", "url": "https://zdf-hls-15.akamaized.net/hls/live/2016498/de/high/master.m3u8"},
    {"name": "NDR Niedersachsen", "group": "Dritte", "url": "https://mcdn.ndr.de/ndr/hls/ndr_fs/ndr_nds/master.m3u8"},
    {"name": "MDR Sachsen-Anhalt", "group": "Dritte", "url": "https://mdrtvsahls.akamaized.net/hls/live/2016879/mdrtvsa/index.m3u8"},
    {"name": "MDR Sachsen", "group": "Dritte", "url": "https://mdrtvsnhls.akamaized.net/hls/live/2016928/mdrtvsn/index.m3u8"},
    {"name": "MDR Thüringen", "group": "Dritte", "url": "https://mdrtvthhls.akamaized.net/hls/live/2016880/mdrtvth/index.m3u8"},
    {"name": "WDR", "group": "Dritte", "url": "https://wdr-live.ard-mcdn.de/wdr/live/hls/de/master.m3u8"},
    {"name": "BR Süd", "group": "Dritte", "url": "https://mcdn.br.de/br/fs/bfs_sued/hls/de/master.m3u8"},
    {"name": "hr-fernsehen", "group": "Dritte", "url": "https://hrhls.akamaized.net/hls/live/2024525/hrhls/index.m3u8"},
    {"name": "SWR BW", "group": "Dritte", "url": "https://swrbwd-hls.akamaized.net/hls/live/2018672/swrbwd/master.m3u8"},
    {"name": "rbb Berlin", "group": "Dritte", "url": "https://rbb-hls-berlin.akamaized.net/hls/live/2017824/rbb_berlin/index.m3u8"},
    {"name": "Radio Bremen", "group": "Dritte", "url": "https://rbhlslive.akamaized.net/hls/live/2020435/rbfs/master.m3u8"},
    {"name": "ZDFneo", "group": "ZDF", "url": "https://zdf-hls-16.akamaized.net/hls/live/2016499/de/high/master.m3u8"},
    {"name": "ZDFinfo", "group": "ZDF", "url": "https://zdf-hls-17.akamaized.net/hls/live/2016500/de/high/master.m3u8"},
    {"name": "3sat", "group": "ZDF", "url": "https://zdf-hls-18.akamaized.net/hls/live/2016501/dach/high/master.m3u8"},
    {"name": "phoenix", "group": "ZDF", "url": "https://zdf-hls-19.akamaized.net/hls/live/2016502/de/high/master.m3u8"},
    {"name": "arte", "group": "Weitere", "url": "https://artesimulcast.akamaized.net/hls/live/2030993/artelive_de/index.m3u8"},
    {"name": "KiKA", "group": "Weitere", "url": "https://kikageohls.akamaized.net/hls/live/2022693/livetvkika_de/master.m3u8"},
    {"name": "tagesschau24", "group": "ARD", "url": "https://tagesschau.akamaized.net/hls/live/2020115/tagesschau/tagesschau_1/master.m3u8"},
    {"name": "ARD alpha", "group": "ARD", "url": "https://mcdn.br.de/br/fs/ard_alpha/hls/de/master.m3u8"},
    {"name": "WELT", "group": "Nachrichten", "url": "seite:https://www.welt.de/tv-programm-live-stream/"},
]

# Sender, die mit einem späteren Update dazukommen (werden einmalig an bestehende Listen angehängt)
ADDED = {"welt_v1": {"name": "WELT", "group": "Nachrichten",
                     "url": "seite:https://www.welt.de/tv-programm-live-stream/"}}


def path():
    return os.path.join(db.DATA_DIR, "channels.json")


def channels():
    p = path()
    if not os.path.exists(p):
        save(DEFAULT_CHANNELS)
        for k in ADDED:
            db.set_setting("channel_" + k, "1")
    with open(p, encoding="utf-8") as f:
        chs = json.load(f)
    changed = False
    for k, ch in ADDED.items():
        if not db.get_setting("channel_" + k):
            db.set_setting("channel_" + k, "1")
            if not any(c["url"] == ch["url"] for c in chs):
                chs.append(ch)
                changed = True
    if changed:
        save(chs)
    return chs


def is_page(url):
    return url.startswith("seite:")


_resolved = {}


async def resolve(url, client):
    """Bei Sendern, deren Stream-Adresse sich ändert, die aktuelle Adresse von der Senderseite holen."""
    page = url[len("seite:"):]
    hit = _resolved.get(page)
    if hit and time.time() - hit[0] < 600:
        return hit[1]
    r = await client.get(page, headers={"Accept-Language": "de-DE,de"})
    r.raise_for_status()
    text = r.text
    found = None
    # 1. Player-Konfiguration (JSON in einem <script>-Block, z. B. bei welt.de)
    for m in re.finditer(r"<script[^>]*(?:VideoPlayer\.Config|WeltVideoPlayer-)[^>]*>(.*?)</script>", text, re.S):
        try:
            cfg = json.loads(htmlmod.unescape(m.group(1)))
            for src in cfg.get("sources", []):
                if src.get("extension") == "m3u8" or ".m3u8" in src.get("src", ""):
                    found = src["src"]
                    break
        except Exception:
            continue
        if found:
            break
    # 2. Rückfall: erste .m3u8-Adresse auf der Seite
    if not found:
        m = re.search(r"https?:[^\s\"'<>]+?\.m3u8[^\s\"'<>]*", text.replace("\\/", "/"))
        if m:
            found = htmlmod.unescape(m.group(0))
    if not found:
        raise RuntimeError("keine Stream-Adresse auf " + page)
    _resolved[page] = (time.time(), found)
    return found


def save(chs):
    clean = []
    for c in chs:
        if c.get("name") and c.get("url"):
            clean.append({"name": str(c["name"]), "group": str(c.get("group") or ""),
                          "url": str(c["url"]), "sat": bool(c.get("sat"))})
    with open(path(), "w", encoding="utf-8") as f:
        json.dump(clean, f, ensure_ascii=False, indent=1)
    return clean


def _secret():
    s = db.get_setting("proxy_secret")
    if not s:
        s = secrets.token_hex(16)
        db.set_setting("proxy_secret", s)
    return s.encode()


def sign(url):
    return hmac.new(_secret(), url.encode(), hashlib.sha256).hexdigest()[:24]


def check(url, sig):
    return hmac.compare_digest(sign(url), sig or "")


def proxied(url):
    return f"/api/live/proxy?u={quote(url, safe='')}&s={sign(url)}"


def rewrite_playlist(text, base):
    out = []
    for line in text.splitlines():
        s = line.strip()
        if not s:
            out.append(line)
            continue
        if s.startswith("#"):
            if 'URI="' in s:
                pre, rest = s.split('URI="', 1)
                uri, post = rest.split('"', 1)
                s = f'{pre}URI="{proxied(urljoin(base, uri))}"{post}'
            out.append(s)
        else:
            out.append(proxied(urljoin(base, s)))
    return "\n".join(out) + "\n"

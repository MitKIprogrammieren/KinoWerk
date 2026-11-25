"""Weitere Datenquellen für die Handsuche: Wikipedia (deutsch), OMDb (IMDb-Daten), TVmaze (Serien).
Alle Ergebnisse werden in ein gemeinsames Format gebracht und im Bearbeiten-Formular angezeigt."""
import html as htmlmod
import re

import httpx

from . import db, library

UA = {"User-Agent": "Kinowerk/1.1 (private Heim-Mediathek)"}

GENRE_DE = {
    "Action": "Action", "Adventure": "Abenteuer", "Animation": "Animation", "Biography": "Biografie",
    "Comedy": "Komödie", "Crime": "Krimi", "Documentary": "Dokumentarfilm", "Drama": "Drama",
    "Family": "Familie", "Fantasy": "Fantasy", "History": "Historie", "Horror": "Horror", "Music": "Musik",
    "Musical": "Musical", "Mystery": "Mystery", "Romance": "Liebesfilm", "Sci-Fi": "Science Fiction",
    "Science-Fiction": "Science Fiction", "Sport": "Sport", "Thriller": "Thriller", "War": "Kriegsfilm",
    "Western": "Western", "Talk-Show": "Talkshow", "Reality-TV": "Reality-TV", "News": "Nachrichten",
    "Legal": "Justiz", "Medical": "Medizin", "Supernatural": "Übernatürlich", "Espionage": "Spionage",
    "Children": "Kinder", "Anime": "Anime", "Food": "Essen", "Travel": "Reisen", "Nature": "Natur",
}


def _strip(h):
    h = re.sub(r"<sup[^>]*>.*?</sup>", "", h or "", flags=re.S)
    h = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", h, flags=re.S)
    h = re.sub(r"<br\s*/?>|</p>|</li>", "\n", h)
    h = re.sub(r"<[^>]+>", "", h)
    h = htmlmod.unescape(h)
    h = re.sub(r"\[\d+\]", "", h)
    return re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]+", " ", h)).strip()


def _year(s):
    m = re.search(r"(19|20)\d\d", s or "")
    return int(m.group(0)) if m else None


def _client():
    return httpx.Client(timeout=15, headers=UA, follow_redirects=True)


# ---------------------------------------------------------------- Suche

def search(provider, kind, q):
    with _client() as c:
        if provider == "wiki":
            r = c.get("https://de.wikipedia.org/w/api.php", params={
                "action": "query", "list": "search", "srsearch": q, "format": "json", "srlimit": 12})
            r.raise_for_status()
            out = []
            for x in r.json().get("query", {}).get("search", []):
                out.append({"id": x["title"], "title": x["title"], "year": "",
                            "info": _strip(x.get("snippet", ""))[:140], "poster": None})
            return out
        if provider == "omdb":
            return _omdb_search(c, kind, q)
        if provider == "tvmaze":
            r = c.get("https://api.tvmaze.com/search/shows", params={"q": q})
            r.raise_for_status()
            out = []
            for x in r.json()[:12]:
                sh = x["show"]
                out.append({"id": sh["id"], "title": sh["name"], "year": (sh.get("premiered") or "")[:4],
                            "info": _strip(sh.get("summary") or "")[:140],
                            "poster": (sh.get("image") or {}).get("medium")})
            return out
        if provider == "tmdb":
            return library.tmdb_search(kind, q)
        if provider == "kfw":
            return _kfw_search(c, q)
    raise RuntimeError("Unbekannte Quelle")


# ---------------------------------------------------------------- KinoFilmWelt (Kinder- und Jugendfilmzentrum)

KFW = "https://www.kinofilmwelt.de"


def _kfw_query(c, q):
    r = c.post(KFW + "/filmsuche/suchergebnisse", files={"suche": (None, q)})
    r.raise_for_status()
    out = []
    for slug, img, title in re.findall(r'<a href="/filme/details/([^"]+)"\s*>\s*<img src="([^"]*)".*?<h2>(.*?)</h2>', r.text, re.S):
        out.append({"id": slug, "title": _strip(title), "year": "", "info": "", "poster": img or None})
    return out


def _kfw_search(c, q):
    """Die Suche dort findet nur zusammenhängende Wortfolgen – daher mehrere Varianten probieren."""
    q = re.sub(r"\s*[\(\[]?(19|20)\d{2}[\)\]]?\s*$", "", q.strip())
    tries = [q, q.replace(":", " -"), q.split(" - ")[0], q.split(":")[0], " ".join(q.split()[:2])]
    seen, out = set(), []
    for t in tries:
        t = t.strip()
        if len(t) < 2 or t in seen:
            continue
        seen.add(t)
        for x in _kfw_query(c, t):
            if x["id"] not in {o["id"] for o in out}:
                out.append(x)
        if len(out) >= 3:
            break
    from .check import score
    out.sort(key=lambda x: -score(x["title"], q))
    return out[:15]


def _kfw_details(c, slug):
    r = c.get(f"{KFW}/filme/details/{slug}")
    r.raise_for_status()
    h = r.text
    title = _strip((re.search(r"<h1>(.*?)</h1>", h, re.S) or [None, slug])[1])
    info = {_strip(k).lower(): _strip(v) for k, v in
            re.findall(r'<div class="col-xs-4 titel">(.*?):?\s*</div>\s*<div class="col-xs-8">(.*?)</div>', h, re.S)}
    m = re.search(r'<div class="row filmtext">\s*<div class="col-sm-12">(.*?)</div>', h, re.S)
    text = m.group(1) if m else ""
    plot = _strip(re.split(r"<br\s*/?>\s*<br\s*/?>", text)[0]) if text else ""
    fsk = None
    f = info.get("fsk-freigabe", "")
    if re.search(r"ohne|frei", f, re.I):
        fsk = 0
    else:
        mf = re.search(r"(\d+)", f)
        fsk = int(mf.group(1)) if mf and int(mf.group(1)) in (0, 6, 12, 16, 18) else None
    img = re.search(r'<figure[^>]*>\s*<img src="([^"]+)"', h)
    split = lambda s: [x.strip() for x in re.split(r"\s*,\s*", s or "") if x.strip()]
    return {"title": title, "year": _year(info.get("land", "")), "overview": plot[:6000], "fsk": fsk,
            "genres": split(info.get("genre")), "director": split(info.get("regie")),
            "cast": [{"name": n, "role": ""} for n in split(info.get("darsteller"))][:40],
            "poster_url": img.group(1) if img else None, "source": "KinoFilmWelt"}


def _omdb_search(c, kind, q):
    """OMDb-Suche, großzügig: IMDb-Nummer direkt, Jahr in Klammern als Filter, genauer Titel ('t') zuerst,
    dann Stichwortsuche ('s') mit und ohne Film/Serie-Einschränkung und mit ':' statt ' - '."""
    key = (db.get_setting("omdb_key") or "").strip()
    if not key:
        raise RuntimeError("Für OMDb fehlt noch der Schlüssel (Einstellungen → Filminfos)")
    q = (q or "").strip()
    year = None
    m = re.search(r"\((\d{4})\)\s*$", q) or re.search(r"\s(\d{4})\s*$", q)
    if m and len(q) > len(m.group(0)):
        year, q = m.group(1), q[:m.start()].strip()
    typ = "series" if kind == "serie" else "movie"
    out, seen, err = [], set(), None

    def ask(params):
        nonlocal err
        r = c.get("https://www.omdbapi.com/", params=dict(params, apikey=key))
        r.raise_for_status()
        d = r.json()
        if d.get("Response") == "False":
            e = (d.get("Error") or "").lower()
            if "not found" not in e and "too many" not in e:
                err = d.get("Error") or "Fehler"
            return []
        return d.get("Search") or [d]

    def add(rows):
        for x in rows:
            i = x.get("imdbID")
            if not i or i in seen:
                continue
            seen.add(i)
            info = " · ".join(v for v in (i, {"movie": "Film", "series": "Serie", "episode": "Folge"}.get(x.get("Type"), "")) if v)
            out.append({"id": i, "title": x.get("Title", ""), "year": x.get("Year", ""), "info": info,
                        "poster": x["Poster"] if x.get("Poster", "N/A") != "N/A" else None})

    if re.fullmatch(r"tt\d{5,10}", q):
        add(ask({"i": q}))
        return out
    variants = list(dict.fromkeys([q, re.sub(r"\s+[-–]\s+", ": ", q), re.sub(r"\s+[-–:]\s*", " ", q)]))
    y = {"y": year} if year else {}
    for v in variants:
        add(ask(dict({"t": v}, **y)))
    for v in variants:
        add(ask(dict({"s": v, "type": typ}, **y)))
        if len(out) >= 12:
            break
    if len(out) < 3:
        for v in variants:
            add(ask(dict({"s": v}, **y)))
    if not out and err:
        raise RuntimeError("OMDb: " + err)
    return out[:12]


# ---------------------------------------------------------------- Details

def _wiki_section(c, title, names):
    r = c.get("https://de.wikipedia.org/w/api.php", params={
        "action": "parse", "page": title, "prop": "sections", "format": "json", "redirects": 1})
    secs = r.json().get("parse", {}).get("sections", [])
    for s in secs:
        if _strip(s.get("line", "")).lower() in names:
            r2 = c.get("https://de.wikipedia.org/w/api.php", params={
                "action": "parse", "page": title, "section": s["index"], "prop": "text",
                "format": "json", "redirects": 1})
            return r2.json().get("parse", {}).get("text", {}).get("*", "")
    return ""


def parse_cast_text(text):
    """Darsteller aus freiem Text: 'Name (Rolle), Name: Rolle, Name als Rolle' – komma- oder zeilengetrennt."""
    out = []
    text = (text or "").replace(";", "\n")
    parts = []
    for line in text.splitlines():
        line = line.strip(" •-*\t")
        if not line:
            continue
        # Kommas außerhalb von Klammern trennen
        depth, cur = 0, ""
        for ch in line:
            if ch == "(":
                depth += 1
            elif ch == ")":
                depth = max(0, depth - 1)
            if ch == "," and depth == 0:
                parts.append(cur)
                cur = ""
            else:
                cur += ch
        parts.append(cur)
    for p in parts:
        p = p.strip()
        if not p:
            continue
        name, role = p, ""
        m = re.match(r"^(.*?)\s*\((.*)\)\s*$", p)
        if m:
            name, role = m.group(1), m.group(2)
        elif ":" in p:
            name, role = p.split(":", 1)
        elif re.search(r"\s(als|as)\s", p):
            name, role = re.split(r"\s(?:als|as)\s", p, 1)
        name, role = name.strip(), role.strip()
        if name and len(name) < 80:
            out.append({"name": name, "role": role})
    return out


def details(provider, kind, ident):
    """Einheitliches Ergebnis: title, year, overview, genres[], director[], cast[{name,role}], poster_url."""
    with _client() as c:
        if provider == "kfw":
            return _kfw_details(c, str(ident))
        if provider == "tmdbtv":
            return library.tmdb_tv_details(ident)
        if provider == "vsmeta":
            from . import vsmeta
            return vsmeta.form_data(int(ident))
        if provider == "wiki":
            title = str(ident)
            r = c.get("https://de.wikipedia.org/api/rest_v1/page/summary/" + title.replace(" ", "_"))
            r.raise_for_status()
            sm = r.json()
            intro = sm.get("extract") or ""
            plot = _strip(_wiki_section(c, title, ("handlung", "inhalt", "handlung und hintergrund")))
            cast_html = _wiki_section(c, title, ("besetzung", "darsteller", "besetzung und synchronisation",
                                                 "synchronisation"))
            cast = []
            for li in re.findall(r"<li[^>]*>(.*?)</li>", cast_html, re.S):
                t = _strip(li)
                m = re.match(r"^(.*?)\s*(?::|–|-|als)\s+(.*)$", t)
                if m and len(m.group(1)) < 60:
                    cast.append({"name": m.group(1).strip(), "role": re.sub(r"\(.*?\)", "", m.group(2)).strip()})
            if not cast:
                for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", cast_html, re.S):
                    cells = [_strip(x) for x in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, re.S)]
                    if len(cells) >= 2 and cells[0] and cells[0].lower() not in ("rolle", "darsteller"):
                        cast.append({"name": cells[0], "role": cells[1]})
            director = []
            m = re.search(r"Regie (?:von|führte) ([A-ZÄÖÜ][\w\.\- ]+?)(?:[,\.]| der| und)", intro)
            if m:
                director = [m.group(1).strip()]
            overview = plot or intro
            if plot and intro:
                overview = intro + "\n\n" + plot
            img = (sm.get("originalimage") or sm.get("thumbnail") or {}).get("source")
            return {"title": re.sub(r"\s*\((Film|Fernsehfilm|Fernsehserie)[^)]*\)$", "", sm.get("title", title)),
                    "year": _year(intro), "overview": overview[:6000], "genres": [], "director": director,
                    "cast": cast[:40], "poster_url": img, "source": "Wikipedia"}
        if provider == "omdb":
            key = (db.get_setting("omdb_key") or "").strip()
            r = c.get("https://www.omdbapi.com/", params={"apikey": key, "i": ident, "plot": "full"})
            r.raise_for_status()
            d = r.json()
            na = lambda v: "" if v in (None, "N/A") else v
            return {"title": na(d.get("Title")), "year": _year(na(d.get("Year"))), "overview": na(d.get("Plot")),
                    "genres": [GENRE_DE.get(g.strip(), g.strip()) for g in na(d.get("Genre")).split(",") if g.strip()],
                    "director": [x.strip() for x in na(d.get("Director")).split(",") if x.strip()],
                    "cast": [{"name": x.strip(), "role": ""} for x in na(d.get("Actors")).split(",") if x.strip()],
                    "poster_url": na(d.get("Poster")) or None, "source": "OMDb/IMDb"}
        if provider == "tvmaze":
            r = c.get(f"https://api.tvmaze.com/shows/{int(ident)}", params={"embed[]": "cast"})
            r.raise_for_status()
            d = r.json()
            cast = [{"name": x["person"]["name"], "role": (x.get("character") or {}).get("name", "")}
                    for x in (d.get("_embedded") or {}).get("cast", [])]
            return {"title": d.get("name"), "year": _year(d.get("premiered")), "overview": _strip(d.get("summary")),
                    "genres": [GENRE_DE.get(g, g) for g in d.get("genres", [])], "director": [],
                    "cast": cast[:40], "poster_url": (d.get("image") or {}).get("original"),
                    "source": "TVmaze", "tvmaze_id": d.get("id")}
    raise RuntimeError("Unbekannte Quelle")


def tvmaze_episodes(show_id, sid):
    """Folgentitel von TVmaze übernehmen, wo noch keine vorhanden sind."""
    with _client() as c:
        r = c.get(f"https://api.tvmaze.com/shows/{int(show_id)}/episodes")
        r.raise_for_status()
        cn = db.conn()
        for ep in r.json():
            cn.execute("UPDATE items SET ep_name=COALESCE(ep_name, ?), overview=COALESCE(overview, ?) "
                       "WHERE series_id=? AND season=? AND episode=?",
                       (ep.get("name"), _strip(ep.get("summary")) or None, sid, ep.get("season"), ep.get("number")))
        cn.commit()


def download_image(url):
    with _client() as c:
        r = c.get(url)
        r.raise_for_status()
        if not r.headers.get("content-type", "").startswith("image/"):
            raise RuntimeError("Unter der Adresse liegt kein Bild")
        return r.content, r.headers.get("content-type")


# ---------------------------------------------------------------- Übersetzen

GENRES_DE = {"action": "Action", "adventure": "Abenteuer", "animation": "Animation", "biography": "Biografie",
             "comedy": "Komödie", "crime": "Krimi", "documentary": "Dokumentarfilm", "drama": "Drama",
             "family": "Familie", "fantasy": "Fantasy", "film-noir": "Film noir", "history": "Historie",
             "horror": "Horror", "music": "Musik", "musical": "Musical", "mystery": "Mystery",
             "romance": "Liebesfilm", "sci-fi": "Science-Fiction", "science fiction": "Science-Fiction",
             "short": "Kurzfilm", "sport": "Sport", "thriller": "Thriller", "war": "Krieg", "western": "Western",
             "talk-show": "Talkshow", "reality-tv": "Reality-TV", "news": "Nachrichten", "game-show": "Spielshow"}


def translate_genres(text):
    parts = [p.strip() for p in (text or "").split(",") if p.strip()]
    return ", ".join(GENRES_DE.get(p.lower(), p) for p in parts)


def _chunks(text, size=450):
    """Text an Satzgrenzen in Stücke teilen (MyMemory nimmt nur ca. 500 Zeichen pro Anfrage)."""
    sents = re.split(r"(?<=[.!?])\s+", text.strip())
    out, cur = [], ""
    for s in sents:
        while len(s) > size:
            cut = s.rfind(" ", 0, size) or size
            out.append((cur + " " + s[:cut]).strip()) if cur else out.append(s[:cut])
            cur, s = "", s[cut:].strip()
        if len(cur) + len(s) + 1 > size and cur:
            out.append(cur); cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur:
        out.append(cur)
    return out


def translate(text, target="DE"):
    """Übersetzt ins Deutsche. Mit DeepL-Schlüssel über DeepL (beste Qualität), sonst kostenlos über MyMemory."""
    text = (text or "").strip()
    if not text:
        return {"text": "", "provider": ""}
    key = (db.get_setting("deepl_key") or "").strip()
    with _client() as c:
        if key:
            host = "api-free.deepl.com" if key.endswith(":fx") else "api.deepl.com"
            r = c.post(f"https://{host}/v2/translate", headers={"Authorization": "DeepL-Auth-Key " + key},
                       data={"text": text, "target_lang": target})
            if r.status_code == 456:
                raise RuntimeError("DeepL: Monatskontingent aufgebraucht")
            if r.status_code in (401, 403):
                raise RuntimeError("DeepL: Schlüssel ungültig")
            r.raise_for_status()
            return {"text": "\n".join(t["text"] for t in r.json().get("translations", [])), "provider": "DeepL"}
        parts = []
        for ch in _chunks(text):
            r = c.get("https://api.mymemory.translated.net/get", params={"q": ch, "langpair": "en|de"})
            r.raise_for_status()
            d = r.json()
            if str(d.get("responseStatus")) not in ("200", "") and d.get("responseDetails"):
                raise RuntimeError("Übersetzung: " + str(d.get("responseDetails"))[:120])
            parts.append((d.get("responseData") or {}).get("translatedText") or ch)
        return {"text": " ".join(parts), "provider": "MyMemory"}

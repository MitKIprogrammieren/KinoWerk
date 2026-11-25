"""Plausibilitätsprüfung: passt der gefundene Film-/Serientitel zum Datei- bzw. Ordnernamen?"""
import os
import re
from difflib import SequenceMatcher
from functools import lru_cache

from . import library

_ARTS = {"der", "die", "das", "the", "a", "an", "ein", "eine", "le", "la", "les", "el", "il", "und", "and", "of", "von"}
_ROMAN = {"ii": "2", "iii": "3", "iv": "4", "v": "5", "vi": "6", "vii": "7", "viii": "8", "ix": "9", "x": "10"}
_GENERIC = re.compile(r"^(video_ts|vts_\d+_\d+|movie|film|main|title\s*\d*|track\s*\d*|disc\s*\d*|cd\s*\d*|\d+)$", re.I)


def _norm(s):
    s = (s or "").lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss").replace("&", " und ")
    s = re.sub(r"[^a-z0-9]+", " ", s)
    toks = [_ROMAN.get(t, t) for t in s.split()]
    return [t for t in toks if t not in _ARTS]


@lru_cache(maxsize=50000)
def score(a, b):
    """0 … 1 – wie gut zwei Titel zusammenpassen."""
    ta, tb = _norm(a), _norm(b)
    if not ta or not tb:
        return 0.0
    ja, jb = " ".join(ta), " ".join(tb)
    if ja == jb:
        return 1.0
    seq = SequenceMatcher(None, ja, jb).ratio()
    sa, sb = set(ta), set(tb)
    overlap = len(sa & sb) / min(len(sa), len(sb))
    if (ja in jb or jb in ja) and min(len(ja), len(jb)) >= 4:
        overlap = max(overlap, 0.95)
    return max(seq, overlap)


def file_titles(path):
    """Titel aus Dateiname und (bei nichtssagendem Dateinamen) aus dem Ordnernamen."""
    out = []
    base = os.path.splitext(os.path.basename(path or ""))[0]
    folder = os.path.basename(os.path.dirname(path or ""))
    for n in (library.split_part(base)[0], folder):
        t, y = library.clean_title(n)
        if t and not _GENERIC.match(t.strip()):
            out.append((t, y))
    return out


def movie_flag(it):
    """0 = in Ordnung, 1 = Titel passt nicht zur Datei, 2 = keine Filminfos gefunden."""
    if it.get("kind") != "movie" or it.get("locked") or it.get("ok_check") or it.get("meta_src") == "vsmeta":
        return 0
    if not it.get("tmdb_id"):
        return 2 if it.get("meta_done") else 0
    names = [x for x in (it.get("title"), it.get("orig_title")) if x]
    best = 0.0
    for ft, fy in file_titles(it.get("path")):
        for n in names:
            s = score(ft, n)
            if fy and it.get("year") and abs(fy - it["year"]) <= 1:
                s += 0.15                      # gleiches Jahr macht es wahrscheinlicher
            best = max(best, s)
    if not names or best == 0.0 and not file_titles(it.get("path")):
        return 0
    return 1 if best < 0.55 else 0


def series_flag(s):
    if s.get("locked") or s.get("ok_check"):
        return 0
    if not s.get("tmdb_id"):
        return 2 if s.get("meta_done") else 0
    names = [x for x in (s.get("tmdb_name"), s.get("orig_name")) if x]
    if not names:
        return 0                               # noch nicht nachgeladen
    ft, fy = library.clean_title(s.get("name") or "")
    best = max(score(ft, n) + (0.15 if fy and s.get("year") and abs(fy - s["year"]) <= 1 else 0) for n in names)
    return 1 if best < 0.55 else 0

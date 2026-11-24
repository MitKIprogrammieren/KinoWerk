"""SQLite-Datenbank der Mediathek."""
import os
import sqlite3
import threading

DATA_DIR = os.environ.get("MEDIATHEK_DATA", "/var/lib/mediathek")
DB_PATH = os.path.join(DATA_DIR, "mediathek.db")

_local = threading.local()

SCHEMA = """
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, pw TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0, libraries TEXT DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY, user_id INTEGER NOT NULL, created REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS libraries (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, path TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'filme', sort INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS series (
    id INTEGER PRIMARY KEY, library_id INTEGER NOT NULL, name TEXT NOT NULL,
    tmdb_id INTEGER, overview TEXT, poster TEXT, backdrop TEXT, year INTEGER,
    meta_done INTEGER DEFAULT 0,
    UNIQUE(library_id, name)
);
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY, library_id INTEGER NOT NULL, path TEXT UNIQUE NOT NULL,
    kind TEXT NOT NULL, title TEXT, sort_title TEXT, year INTEGER,
    series_id INTEGER, season INTEGER, episode INTEGER,
    size INTEGER, mtime REAL, added REAL,
    probed INTEGER DEFAULT 0, duration REAL, container TEXT, vcodec TEXT,
    width INTEGER, height INTEGER, audio TEXT,
    tmdb_id INTEGER, overview TEXT, poster TEXT, backdrop TEXT, meta_done INTEGER DEFAULT 0,
    folder TEXT
);
CREATE INDEX IF NOT EXISTS idx_items_lib ON items(library_id);
CREATE INDEX IF NOT EXISTS idx_items_series ON items(series_id);
CREATE TABLE IF NOT EXISTS library_paths (
    id INTEGER PRIMARY KEY, library_id INTEGER NOT NULL, path TEXT NOT NULL,
    UNIQUE(library_id, path)
);
CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, token TEXT UNIQUE NOT NULL, name TEXT,
    approved INTEGER DEFAULT 0, created REAL, last_seen REAL, ip TEXT
);
CREATE TABLE IF NOT EXISTS people (
    ref_kind TEXT NOT NULL, ref_id INTEGER NOT NULL, person_id INTEGER NOT NULL, name TEXT, role TEXT,
    img TEXT, ord INTEGER
);
CREATE INDEX IF NOT EXISTS idx_people_person ON people(person_id);
CREATE INDEX IF NOT EXISTS idx_people_ref ON people(ref_kind, ref_id);
CREATE TABLE IF NOT EXISTS tags (
    ref_kind TEXT NOT NULL, ref_id INTEGER NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(type, name);
CREATE INDEX IF NOT EXISTS idx_tags_ref ON tags(ref_kind, ref_id);
CREATE TABLE IF NOT EXISTS recs (ref_kind TEXT NOT NULL, ref_id INTEGER NOT NULL, tmdb_id INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS idx_recs_ref ON recs(ref_kind, ref_id);
CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER NOT NULL, item_id INTEGER NOT NULL, position REAL, duration REAL,
    watched INTEGER DEFAULT 0, updated REAL,
    PRIMARY KEY(user_id, item_id)
);
"""


def conn() -> sqlite3.Connection:
    c = getattr(_local, "conn", None)
    if c is None:
        c = sqlite3.connect(DB_PATH, timeout=30)
        c.row_factory = sqlite3.Row
        c.execute("PRAGMA journal_mode=WAL")
        c.execute("PRAGMA foreign_keys=OFF")
        _local.conn = c
    return c


NEW_COLUMNS = [
    ("items", "fsk", "INTEGER"), ("items", "cast", "TEXT"), ("items", "chapters", "TEXT"),
    ("items", "details_done", "INTEGER DEFAULT 0"), ("items", "genres", "TEXT"), ("items", "mediainfo", "TEXT"), ("items", "ep_name", "TEXT"), ("items", "locked", "INTEGER DEFAULT 0"), ("series", "locked", "INTEGER DEFAULT 0"),
    ("series", "fsk", "INTEGER"), ("series", "cast", "TEXT"), ("series", "details_done", "INTEGER DEFAULT 0"),
    ("series", "genres", "TEXT"),
    ("users", "max_fsk", "INTEGER"), ("users", "allow_sat", "INTEGER DEFAULT 1"), ("users", "prefs", "TEXT"), ("users", "need_device", "INTEGER DEFAULT 0"),
    ("sessions", "device_id", "INTEGER"),
]


def init():
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(os.path.join(DATA_DIR, "images"), exist_ok=True)
    os.makedirs(os.path.join(DATA_DIR, "thumbs"), exist_ok=True)
    c = conn()
    c.executescript(SCHEMA)
    for table, col, decl in NEW_COLUMNS:
        cols = [r[1] for r in c.execute(f"PRAGMA table_info({table})").fetchall()]
        if col not in cols:
            c.execute(f"ALTER TABLE {table} ADD COLUMN {col} {decl}")
    c.commit()


def q(sql, args=()):
    return [dict(r) for r in conn().execute(sql, args).fetchall()]


def q1(sql, args=()):
    r = conn().execute(sql, args).fetchone()
    return dict(r) if r else None


def run(sql, args=()):
    c = conn()
    cur = c.execute(sql, args)
    c.commit()
    return cur.lastrowid


def get_setting(key, default=None):
    r = q1("SELECT value FROM settings WHERE key=?", (key,))
    return r["value"] if r else default


def set_setting(key, value):
    run("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        (key, value))

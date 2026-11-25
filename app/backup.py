"""Tägliche Sicherung der Mediathek-Daten auf die NAS: Datenbank (mehrere Stände) + Bilder (gespiegelt)."""
import gzip
import logging
import os
import shutil
import sqlite3
import threading
import time

from . import db

log = logging.getLogger("mediathek.backup")
DIRNAME = "_Mediathek-Sicherung"
_lock = threading.Lock()

README = """Sicherung von Kinowerk
====================================

datenbank/   tägliche Stände der Datenbank (Filminfos, Gesehen-Markierungen, Playlisten,
             Benutzer, Einstellungen) – die ältesten werden automatisch gelöscht.
bilder/      Cover, Hintergrundbilder, Musik- und Interpretenbilder (laufend gespiegelt).

Zurückholen (in der Proxmox-Shell):
  pct exec 102 -- systemctl stop mediathek
  pct exec 102 -- bash -c 'gunzip -c "/media/…/datenbank/mediathek-DATUM.db.gz" > /var/lib/mediathek/mediathek.db'
  pct exec 102 -- bash -c 'cp -rn "/media/…/bilder/." /var/lib/mediathek/images/'
  pct exec 102 -- systemctl start mediathek
(„/media/…“ = der Sicherungsordner, wie er in den Einstellungen steht.)

Hinweis: Die Datenbank enthält auch die gespeicherten Schlüssel (TheMovieDB, OMDb, DeepL).
"""


def target():
    return (db.get_setting("backup_dir") or "").strip()


def status():
    return {"dir": target(), "keep": int(db.get_setting("backup_keep", "14") or 14),
            "last": float(db.get_setting("backup_last", "0") or 0),
            "result": db.get_setting("backup_result", "") or "", "running": _lock.locked()}


def run(manual=False):
    """Eine Sicherung anlegen. Rückgabe: Ergebnistext."""
    if not _lock.acquire(blocking=False):
        return "Läuft schon"
    try:
        dest = target()
        if not dest:
            return "Kein Sicherungsordner eingestellt"
        os.makedirs(os.path.join(dest, "datenbank"), exist_ok=True)
        os.makedirs(os.path.join(dest, "bilder"), exist_ok=True)
        stamp = time.strftime("%Y-%m-%d_%H%M")
        tmp = os.path.join(db.DATA_DIR, "sicherung.tmp.db")
        # konsistente Kopie, auch während die Mediathek läuft
        src = sqlite3.connect(db.DB_PATH, timeout=30)
        dst = sqlite3.connect(tmp)
        with dst:
            src.backup(dst)
        dst.close()
        src.close()
        out = os.path.join(dest, "datenbank", f"mediathek-{stamp}.db.gz")
        with open(tmp, "rb") as fi, gzip.open(out + ".part", "wb", compresslevel=6) as fo:
            shutil.copyfileobj(fi, fo)
        os.replace(out + ".part", out)
        os.remove(tmp)
        size_db = os.path.getsize(out)
        # alte Stände aufräumen
        keep = max(3, int(db.get_setting("backup_keep", "14") or 14))
        olds = sorted(f for f in os.listdir(os.path.join(dest, "datenbank")) if f.startswith("mediathek-") and f.endswith(".db.gz"))
        for f in olds[:-keep]:
            try:
                os.remove(os.path.join(dest, "datenbank", f))
            except OSError:
                pass
        # Bilder spiegeln (nur neue/geänderte kopieren)
        new = 0
        idir = os.path.join(db.DATA_DIR, "images")
        for f in os.listdir(idir) if os.path.isdir(idir) else []:
            s = os.path.join(idir, f)
            d = os.path.join(dest, "bilder", f)
            try:
                if os.path.isfile(s) and (not os.path.exists(d) or os.path.getsize(d) != os.path.getsize(s)):
                    shutil.copyfile(s, d)
                    new += 1
            except OSError:
                pass
        with open(os.path.join(dest, "LIESMICH.txt"), "w", encoding="utf-8") as f:
            f.write(README)
        res = (f"{time.strftime('%d.%m.%Y %H:%M')}: Datenbank gesichert ({size_db // 1024} KB), "
               f"{new} neue Bilder, {min(len(olds), keep)} {'Stand' if min(len(olds), keep) == 1 else 'Stände'} vorhanden")
        db.set_setting("backup_last", str(time.time()))
        db.set_setting("backup_result", res)
        log.info("Sicherung: %s", res)
        return res
    except Exception as e:
        res = f"{time.strftime('%d.%m.%Y %H:%M')}: FEHLER – {e}"
        db.set_setting("backup_result", res)
        log.exception("Sicherung fehlgeschlagen")
        return res
    finally:
        _lock.release()


def loop():
    """Einmal am Tag (nachts ab 3:30 Uhr) sichern."""
    time.sleep(120)
    while True:
        try:
            last = float(db.get_setting("backup_last", "0") or 0)
            lt = time.localtime()
            due_today = (lt.tm_hour, lt.tm_min) >= (3, 30)
            if target() and due_today and time.strftime("%Y-%m-%d", time.localtime(last)) != time.strftime("%Y-%m-%d"):
                run()
            elif target() and time.time() - last > 2 * 86400:   # Mediathek war nachts aus → nachholen
                run()
        except Exception:
            log.exception("Sicherungs-Zeitplan")
        time.sleep(600)

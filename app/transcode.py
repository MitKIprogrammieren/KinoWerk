"""Live-Umwandlung (HLS) mit der Intel-Grafik (VAAPI), Rückfall auf den Prozessor."""
import logging
import os
import shutil
import subprocess
import threading
import time
import uuid

from . import db

log = logging.getLogger("mediathek.transcode")

TMP = os.environ.get("MEDIATHEK_TMP", "/tmp/mediathek-hls")
RENDER = "/dev/dri/renderD128"
HW_DECODE = {"h264", "hevc", "vp9", "av1", "mpeg2video", "vp8"}

# Qualitätsstufen: Höhe, Videobitrate (kbit/s)
QUALITY = {
    "original": (None, None),
    "hoch": (1080, 8000),
    "mittel": (720, 4000),
    "niedrig": (480, 1500),
}

sessions = {}
_lock = threading.Lock()


def hw_mode():
    mode = db.get_setting("hw", "auto")
    if mode == "auto":
        return "vaapi" if os.path.exists(RENDER) else "cpu"
    return mode


class Session:
    def __init__(self, item, start, audio_idx, quality):
        self.id = uuid.uuid4().hex
        self.item = item
        self.start = float(start or 0)
        self.audio_idx = audio_idx
        self.quality = quality
        self.dir = os.path.join(TMP, self.id)
        self.last_seen = time.time()
        self.proc = None
        self.log_path = os.path.join(self.dir, "ffmpeg.log")
        os.makedirs(self.dir, exist_ok=True)

    def build_cmd(self, mode):
        it = self.item
        height, kbps = QUALITY.get(self.quality, QUALITY["original"])
        src_h = it.get("height") or 1080
        if height and src_h <= height:
            height = None  # nicht hochskalieren
        if self.quality == "original":
            kbps = 20000 if src_h > 1100 else 10000
        copy_video = (self.quality == "original" and it.get("vcodec") == "h264")

        cmd = ["ffmpeg", "-hide_banner", "-loglevel", "warning", "-nostdin"]
        vcodec = it.get("vcodec") or ""
        if not copy_video and mode == "vaapi":
            if vcodec in HW_DECODE:
                cmd += ["-hwaccel", "vaapi", "-hwaccel_device", RENDER,
                        "-hwaccel_output_format", "vaapi"]
            else:
                cmd += ["-vaapi_device", RENDER]
        if self.start > 0:
            cmd += ["-ss", f"{self.start:.2f}"]
        cmd += ["-i", it["path"], "-map", "0:v:0", "-map", f"0:a:{self.audio_idx}?",
                "-sn", "-dn", "-map_metadata", "-1", "-map_chapters", "-1"]

        if copy_video:
            cmd += ["-c:v", "copy"]
        elif mode == "vaapi":
            scale = f"scale_vaapi=w=-2:h={height}:format=nv12" if height else "scale_vaapi=format=nv12"
            vf = scale if vcodec in HW_DECODE else f"format=nv12,hwupload,{scale}"
            cmd += ["-vf", vf, "-c:v", "h264_vaapi", "-profile:v", "high",
                    "-b:v", f"{kbps}k", "-maxrate", f"{int(kbps * 1.5)}k",
                    "-bufsize", f"{kbps * 2}k", "-g", "48", "-bf", "0"]
        else:
            vf = f"scale=-2:{height}" if height else "scale=trunc(iw/2)*2:trunc(ih/2)*2"
            cmd += ["-vf", vf + ",format=yuv420p", "-c:v", "libx264", "-preset", "veryfast",
                    "-b:v", f"{kbps}k", "-maxrate", f"{int(kbps * 1.5)}k",
                    "-bufsize", f"{kbps * 2}k", "-g", "48", "-sc_threshold", "0"]

        cmd += ["-c:a", "aac", "-ac", "2", "-b:a", "192k", "-ar", "48000",
                "-f", "hls", "-hls_time", "4", "-hls_list_size", "0",
                "-hls_playlist_type", "event", "-hls_flags", "independent_segments",
                "-hls_segment_filename", os.path.join(self.dir, "seg%05d.ts"),
                os.path.join(self.dir, "index.m3u8")]
        return cmd

    def run(self):
        mode = hw_mode()
        self._spawn(mode)
        # Falls die Grafik scheitert: sofort mit dem Prozessor neu versuchen
        if mode == "vaapi":
            threading.Thread(target=self._watch_fallback, daemon=True).start()

    def _spawn(self, mode):
        cmd = self.build_cmd(mode)
        log.info("Starte: %s", " ".join(cmd))
        self.mode = mode
        logf = open(self.log_path, "ab")
        self.proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=logf)

    def _watch_fallback(self):
        time.sleep(0.5)
        for _ in range(40):
            if self.proc is None:
                return
            rc = self.proc.poll()
            if os.path.exists(os.path.join(self.dir, "seg00000.ts")):
                return
            if rc is not None:
                if rc != 0:
                    log.warning("VAAPI fehlgeschlagen (rc=%s), nehme Prozessor", rc)
                    self._spawn("cpu")
                return
            time.sleep(0.25)

    def playlist(self, wait=25):
        path = os.path.join(self.dir, "index.m3u8")
        t0 = time.time()
        while time.time() - t0 < wait:
            if os.path.exists(path):
                with open(path) as f:
                    txt = f.read()
                if "#EXTINF" in txt:
                    return txt
            if self.proc and self.proc.poll() not in (None, 0) and getattr(self, "mode", "") == "cpu":
                break
            time.sleep(0.2)
        return None

    def error_log(self):
        try:
            with open(self.log_path, errors="replace") as f:
                return f.read()[-2000:]
        except OSError:
            return ""

    def stop(self):
        if self.proc and self.proc.poll() is None:
            self.proc.terminate()
            try:
                self.proc.wait(5)
            except subprocess.TimeoutExpired:
                self.proc.kill()
        self.proc = None
        shutil.rmtree(self.dir, ignore_errors=True)


def start(item, start_pos, audio_idx, quality, replace=None):
    if replace:
        stop(replace)
    s = Session(item, start_pos, audio_idx, quality)
    with _lock:
        sessions[s.id] = s
    s.run()
    return s


def get(sid):
    s = sessions.get(sid)
    if s:
        s.last_seen = time.time()
    return s


def stop(sid):
    with _lock:
        s = sessions.pop(sid, None)
    if s:
        s.stop()


def reaper():
    """Verwaiste Umwandlungen beenden (kein Abruf mehr seit 2 Minuten)."""
    shutil.rmtree(TMP, ignore_errors=True)
    os.makedirs(TMP, exist_ok=True)
    frames = TMP + "-frames"
    shutil.rmtree(frames, ignore_errors=True)
    n = 0
    while True:
        time.sleep(30)
        now = time.time()
        n += 1
        if n % 20 == 0 and os.path.isdir(frames):
            # Vorschaubilder begrenzen (älteste zuerst löschen)
            files = sorted((os.path.join(frames, f) for f in os.listdir(frames)), key=lambda f: os.path.getmtime(f))
            for f in files[:-3000]:
                try:
                    os.remove(f)
                except OSError:
                    pass
        for sid, s in list(sessions.items()):
            if now - s.last_seen > 120:
                log.info("Beende verwaiste Sitzung %s", sid)
                stop(sid)

# Kinowerk – Container-Image
FROM debian:12-slim

ENV DEBIAN_FRONTEND=noninteractive \
    MEDIATHEK_DATA=/data \
    MEDIATHEK_MEDIA=/media \
    PORT=8080 \
    PYTHONUNBUFFERED=1

# ffmpeg zum Umwandeln; Intel-Treiber nur auf x86 (für Hardware-Umwandlung über /dev/dri)
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg python3 python3-venv ca-certificates tzdata \
 && if [ "$(dpkg --print-architecture)" = "amd64" ]; then apt-get install -y --no-install-recommends intel-media-va-driver i965-va-driver vainfo; fi \
 && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/venv \
 && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
 && /opt/venv/bin/pip install --no-cache-dir "fastapi>=0.110" "uvicorn>=0.29" "httpx>=0.27"

WORKDIR /opt/mediathek
COPY app ./app
COPY web ./web

VOLUME ["/data"]
EXPOSE 8080

HEALTHCHECK --interval=60s --timeout=5s --start-period=30s \
  CMD python3 -c "import urllib.request,os;urllib.request.urlopen('http://127.0.0.1:%s/api/status' % os.environ.get('PORT','8080'),timeout=4)" || exit 1

CMD ["sh", "-c", "exec /opt/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --proxy-headers --forwarded-allow-ips='*'"]

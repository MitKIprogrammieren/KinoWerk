# Kinowerk

Eigener Medien-Player für Filme und Serien von der Synology – übernommen aus der „Ernsthaften Mediathek“ 0.8.9,
mit eigenem Namen, Logo und Farben und zusätzlich einer **Jellyfin-kompatiblen Schnittstelle**.

## Plezy (Apple TV, iPhone, iPad, Mac)
Kinowerk meldet sich als Jellyfin-Server. In Plezy: Server hinzufügen → **Jellyfin** → Adresse
`http://192.168.1.30:8180` → mit deinem Kinowerk-Benutzer anmelden.
Im Heimnetz findet Plezy Kinowerk meist auch von selbst.

Funktioniert: Bibliotheken, Filme, Serien/Staffeln/Folgen, Cover und Hintergründe, Weiterschauen,
Als Nächstes, Zuletzt hinzugefügt, Suche, Gesehen/Ungesehen, Favoriten, Abspielen direkt (Original)
oder umgewandelt (niedrigere Qualität), Fortschritt pro Benutzer, FSK-Sperre, Gerätefreigabe.
Noch nicht: Live-TV, Musik, Personen/Genres-Filter in Plezy.

## Weboberfläche
`http://192.168.1.30:8180` im Browser. Erster Aufruf: Admin anlegen, TMDB-Schlüssel eintragen,
Bibliotheken unter `/media/...` anlegen, Einlesen.

# 05 · Backend & Admin-Portal

**Ziel:** Die API aus Briefing 03 läuft produktiv auf einem Hetzner-GPU-Server in Deutschland. Dazu ein Admin-Portal, in dem Firmen Geräte, Wörterbuch und Einstellungen selbst verwalten. Kein Ton und kein Text wird gespeichert.

**Führt:** Claude · **Accounts und Bestellung:** Du · **Start:** KW 44 · **Vertrag:** Briefing 03

## 1. Technik

| Bereich | Wahl |
|---|---|
| Sprache | Python 3.12 |
| Web | FastAPI, uvicorn, Pydantic v2 |
| Datenbank | Postgres 16, SQLAlchemy 2 (async, asyncpg), Alembic |
| Tests | pytest, httpx, testcontainers (Postgres) |
| Qualität | ruff, mypy (strict für `services/api`), pre-commit |
| E-Mail | SMTP eines EU-Anbieters (z. B. Brevo, Frankreich) nur für Magic Links und Lead-Benachrichtigung |
| Portal | React, Vite, TypeScript, TanStack Query, eigene CSS-Tokens aus Briefing 02, keine UI-Bibliothek außer Radix-Primitives für Dialoge und Tabs |
| Betrieb | docker compose, Caddy 2, restic, Uptime Kuma |

**Nicht** Supabase, Firebase oder andere US-Dienste für Kundendaten: Das Versprechen „kein US-Anbieter in der Kette“ steht auf der Website.

## 2. Aufgaben

### Grundgerüst (KW 44)
- [ ] `services/api` mit Projektstruktur `app/routers`, `app/models`, `app/services`, `app/engines`, `app/settings.py`
- [ ] Migration `0001_init` aus Briefing 03 per Alembic
- [ ] Health-Endpunkte `/healthz` (Prozess) und `/readyz` (DB und Engine erreichbar)
- [ ] Strukturiertes Logging (JSON) mit fester Feldliste: `ts, level, event, tenant_id, device_id, status, duration_ms`. Kein freier Text aus Anfragen
- [ ] `infra/compose.yaml` mit `caddy`, `api`, `stt`, `postgres`; `infra/Caddyfile` mit IP-freiem Log-Format

### Geräte und Anmeldung
- [ ] `POST /v1/enroll`: Schlüssel prüfen (Hash, nicht widerrufen, nicht abgelaufen, Gerätegrenze), Gerät anlegen, Token einmalig ausgeben
- [ ] Auth-Abhängigkeit für `/v1/*`: Token-Hash nachschlagen, gesperrte Geräte → 403 `device_revoked`
- [ ] `GET /v1/config`, `POST /v1/heartbeat`

### Diktat
- [ ] `POST /v1/transcribe`: Streaming-Upload in den Speicher, Grenzen 4 MB und 900 s, Opus mit `soundfile` oder `ffmpeg`-Pipe (ohne Datei) nach 16-kHz-PCM dekodieren
- [ ] Engine-Adapter-Schnittstelle `transcribe(audio: np.ndarray, language: str | None, hints: list[str]) -> RawResult`
  - `whisper-de`: HTTP an internen Dienst `stt:8001/transcribe` (Briefing 06)
  - `mistral-eu`: Mistral-Transkriptions-API, nur aktivierbar, wenn die AVV-Prüfung durch ist (Briefing 07)
- [ ] `postprocess`-Paket aufrufen (Briefing 06), `corrections` zählen
- [ ] Zähler `usage_daily` per `insert … on conflict do update` erhöhen
- [ ] Rate-Limits laut Briefing 03 (Speicher, z. B. Token-Bucket pro Gerät)
- [ ] Test: Nach einem E2E-Diktat mit dem Satz „Testsatz Zitronenfalter 4711“ taucht dieser in keinem Log und keiner Tabelle auf

### Wörterbuch
- [ ] Persönliche Begriffe (`/v1/dictionary/personal…`) und Vorschläge
- [ ] Zusammenbau der Begriffe pro Diktat: Firma + aktive Pakete − ausgeblendete + persönliche des Geräts, im Speicher gecacht und bei Änderung invalidiert

### Updates
- [ ] `GET /v1/updates/{target}/{arch}/{current_version}` aus Tabelle `releases (version, channel, target, arch, url, signature, notes, pub_date)`
- [ ] Logik: feste Version der Firma vor Kanal, Testgruppe bekommt `test`-Kanal
- [ ] Installer liegen auf Hetzner Object Storage oder bunny.net, mit Firmen-Download-Seite `get.tonfeder.de/<code>`: liefert `Tonfeder-Setup_<code>.exe` (gleiche Datei, anderer Dateiname per `Content-Disposition`) und den Mac-Download

### Admin-API und Portal (KW 46–48)
- [ ] Magic-Link-Login, Sessions, CSRF, Audit-Log für jede schreibende Admin-Aktion
- [ ] Endpunkte laut Briefing 03, Abschnitt 4
- [ ] Portal-Seiten:

| Seite | Inhalt |
|---|---|
| Übersicht | Geräte angemeldet, heute aktiv, Minuten im Monat, Balken „aktive Geräte pro Tag“ (14 Tage), Hinweis ab wann anonym ausgewertet wird |
| Geräte | Tabelle mit Suche, „zuletzt gesehen“ als Tag, sperren, entsperren, Testgruppe |
| Installation | Firmenschlüssel anlegen und rotieren, Firmen-Link kopieren, MSI-Befehl, Anleitung Mac |
| Wörterbuch | Firmenbegriffe mit gesprochenen Varianten, CSV-Import, Vorschläge freigeben, Branchenpakete |
| Einstellungen | Datenstandort, Tasten-Vorgabe, Sprache, Einfügemodus, Update-Kanal, feste Version |
| Unterlagen | AVV, TOM, Unterauftragnehmer, DSFA-Vorlage, Betriebsrats-Info |
| Admins | Einladen, entfernen |

- [ ] Superadmin: Firmen anlegen, Pläne, Leads mit Löschdatum
- [ ] Optik wie der Portal-Mock im Designentwurf

### Leads
- [ ] `POST /api/leads`: JSON oder Formular-POST, Honeypot und Mindestdauer prüfen, speichern, Benachrichtigung per E-Mail, ohne JS `303` auf `https://tonfeder.de/danke`
- [ ] Täglicher Job: Leads älter als 180 Tage löschen

### Betrieb (KW 45, parallel)
- [ ] **Du:** Hetzner GEX44 bestellen (Falkenstein oder Nürnberg), kleine Cloud-VM (Monitoring), Storage Box
- [ ] Setup-Skript `infra/bootstrap.sh`: Ubuntu 24.04, NVIDIA-Treiber und Container-Toolkit, Docker, LUKS-Datenpartition, unattended-upgrades, SSH nur mit Schlüssel, Hetzner-Firewall (22 nur eigene IP, 80, 443)
- [ ] Swap aus oder verschlüsselt
- [ ] restic: nächtlich nur Postgres-Dump, 30 Tage aufbewahren, monatlicher Wiederherstellungstest
- [ ] Uptime Kuma auf der Cloud-VM: `/readyz` jede Minute, Alarm per E-Mail
- [ ] Deployment per GitHub Actions: Image bauen, auf GHCR pushen, per SSH `docker compose pull && up -d`, danach Smoke-Test

## 3. Akzeptanzkriterien

- [ ] OpenAPI aus FastAPI stimmt mit `docs/api/openapi.yaml` überein (CI-Check)
- [ ] Testabdeckung ≥ 90 % für Auth, Mandantentrennung und Leads
- [ ] Mandantentest: Gerät und Admin der Firma A sehen mit keiner ID Daten von Firma B
- [ ] API-Overhead ohne Erkennung P95 ≤ 150 ms
- [ ] Kein Inhalt in Logs oder Datenbank (automatisierter Test, siehe oben)
- [ ] Caddy-Logs ohne IP-Adressen (Stichprobe in CI mit Testanfrage)
- [ ] Firmenstatistik bei unter 5 aktiven Geräten ausgeblendet
- [ ] Backup und Wiederherstellung einmal erfolgreich geprobt

## Kickoff-Prompt für Claude Code

```
Lies docs/briefings/00-README.md, 03-architektur-api.md und 05-backend-portal.md.
Baue services/api nach dem Vertrag in docs/api/openapi.yaml: Grundgerüst, Migrationen,
Anmeldung, Auth, /v1/config, /v1/heartbeat, /v1/transcribe mit einem Fake-Engine-Adapter
(gibt festen Text zurück), Zähler, Rate-Limits und den Test "kein Inhalt in Logs".
Dazu infra/compose.yaml und infra/Caddyfile. Portal und Updates kommen in einer
eigenen Session. Alle Tests müssen in CI laufen (GitHub Actions, Postgres per Service).
```

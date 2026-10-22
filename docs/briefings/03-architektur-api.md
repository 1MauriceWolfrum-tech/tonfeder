# 03 · Architektur & API

**Ziel:** Ein verbindlicher Vertrag zwischen Desktop-App, Backend, Portal und Erkennung, damit Briefing 04, 05 und 06 parallel laufen können. Änderungen an diesem Dokument nur per PR mit Hinweis an alle laufenden Sessions.

**Führt:** Claude · **Review:** Du · **Start:** KW 43

## 1. Komponenten

```
Rechner im Kunden-Netz                    Rechenzentrum Deutschland (Hetzner)
┌─────────────────────┐   HTTPS    ┌───────────────────────────────────────────┐
│ Tonfeder-App        │──────────▶ │ Caddy (TLS, keine IP-Logs)                │
│ Tauri v2 / Rust     │            │   ├─ api        FastAPI, Python 3.12      │
│ Hotkey, Aufnahme,   │ ◀────────  │   │    ├─ postprocess (Befehle, Wörterb.) │
│ Overlay, Einfügen   │   Text     │   │    └─ Engine-Adapter ─┐               │
└─────────────────────┘            │   ├─ stt    faster-whisper auf GPU ◀──┘   │
┌─────────────────────┐            │   ├─ postgres 16                          │
│ Admin-Portal (Web)  │──────────▶ │   └─ portal (statisch)                    │
└─────────────────────┘            └───────────────────────────────────────────┘
                                         optional: Mistral (EU-Cloud) per Adapter
```

| Komponente | Technik | Repo-Pfad | Briefing |
|---|---|---|---|
| Desktop-App | Tauri v2, Rust, React/TS (Fork von Handy) | `tonfeder-desktop` | 04 |
| API | FastAPI, SQLAlchemy 2, Alembic, Pydantic v2 | `services/api` | 05 |
| Nachbearbeitung | Python-Paket, ohne Abhängigkeit zu FastAPI | `packages/postprocess` | 06 |
| Erkennung | faster-whisper (CTranslate2), interner HTTP-Dienst | `services/stt` | 06 |
| Admin-Portal | React, Vite, TypeScript, TanStack Query | `apps/portal` | 05 |
| Website | Astro, statisch | `apps/website` | 02 |

**MVP-Betrieb:** Ein Hetzner GEX44 betreibt `caddy`, `api`, `stt` und `postgres` per docker compose. Website und Monitoring laufen getrennt (bunny.net bzw. kleine Cloud-VM). Später trennen wir API und GPU, sobald ein zweiter GPU-Server nötig ist.

**Box und Kunden-Rechenzentrum (später):** Dieselben Images `api`, `stt`, `postgres` laufen beim Kunden. Die App spricht dann direkt mit `https://tonfeder.<kunde>.local`. An die Tonfeder-Cloud gehen nur Lizenzprüfung, Update-Abfrage und anonyme Tageszähler.

## 2. Begriffe

- **Firma (tenant):** Kunde. Hat einen Slug (`halbach`), eine Engine-Einstellung, ein Wörterbuch.
- **Firmenschlüssel (enrollment key):** `tfk_<slug>_<20 Zeichen Base32>`. Damit meldet sich ein Gerät an. Kann rotiert, begrenzt (max. Geräte) und befristet werden. Server speichert nur den SHA-256-Hash.
- **Gerät (device):** Eine Installation **pro Benutzerprofil**. Auf einem Terminalserver ist jede Windows-Sitzung ein eigenes Gerät. Hat ein eigenes Token (`tfd_<32 Byte Base64url>`), Server speichert nur den Hash.
- **Admin:** Person mit Portal-Zugang zu einer Firma. Superadmin: wir.

## 3. Geräte-API (`/v1`, Bearer-Token des Geräts)

Alle Antworten JSON, UTF-8. Fehler immer als `{"error": {"code": "...", "message": "..."}}` mit deutschem `message` für die Anzeige.

### `POST /v1/enroll` (ohne Token)
```json
// Anfrage
{ "enroll_key": "tfk_halbach_K7Q2M9X4P8R3T6V1W5Y2", "device_name": "NB-SERVICE-11",
  "os": "windows", "os_version": "10.0.26100", "app_version": "0.3.0" }
// Antwort 201
{ "device_id": "0b9c…", "device_token": "tfd_…", "config": { …wie GET /v1/config… } }
```
Fehler: `invalid_key` (401), `key_revoked` (403), `device_limit` (409).

### `GET /v1/config`
```json
{ "tenant": { "name": "Halbach Kältetechnik GmbH", "slug": "halbach" },
  "engine": { "id": "whisper-de", "badge": "DE", "label": "Verarbeitet in Deutschland" },
  "hotkey": { "windows": "RightCtrl", "macos": "RightOption", "user_may_change": true },
  "language": "auto", "max_seconds": 900, "warn_at_seconds": 840,
  "paste_mode": "clipboard", "voice_commands": true,
  "update": { "channel": "stable", "pinned_version": null } }
```
App lädt beim Start und alle 6 Stunden. `paste_mode`: `clipboard` oder `type` (Tippen per Unicode-Eingabe, für Programme, die Einfügen blockieren).

### `POST /v1/transcribe`
- Header: `Content-Type: audio/ogg` (Opus, 16 kHz, mono, 24 kbit/s), `X-Tf-Language: auto|de|en`, `X-Tf-Client: windows/0.3.0`
- Body: Audiodatei, max. 4 MB und 900 s. Der Upload zeigt in der App Fortschritt.
```json
// Antwort 200
{ "text": "Die Messwerte der Lüftungsanlage in Halle 3 liegen vor.",
  "language": "de", "audio_ms": 18340, "took_ms": 1720,
  "engine": "whisper-de", "corrections": 2 }
```
Fehler: `too_long` (413), `device_revoked` (403), `rate_limited` (429, mit `Retry-After`), `engine_unavailable` (503).

Ablauf im Server, alles im Arbeitsspeicher: Gerät prüfen → Firma laden → Audio an Engine-Adapter → Rohtext → `postprocess` (Befehle, Wörterbuch) → Zähler erhöhen → Antwort → Puffer freigeben.

### Persönliche Begriffe
- `GET /v1/dictionary/personal` → `{ "entries": [ { "id", "written", "spoken": [], "status": "personal|suggested" } ] }`
- `POST /v1/dictionary/personal` `{ "written": "Kälteanlage Nord", "spoken": ["kälte anlage nord"] }` (`spoken` optional)
- `DELETE /v1/dictionary/personal/{id}`
- `POST /v1/dictionary/personal/{id}/suggest` → Status `suggested`, Admin gibt im Portal frei

### `POST /v1/heartbeat`
`{ "app_version": "0.3.0", "os_version": "…" }`, einmal täglich beim ersten Diktat oder Start. Setzt `last_seen_day` (nur Datum).

### `GET /v1/updates/{target}/{arch}/{current_version}`
Format des Tauri-Updaters. `204`, wenn nichts ansteht. Berücksichtigt Kanal, Testgruppe und festgelegte Version der Firma.

## 4. Admin-API (`/admin/v1`, Session-Cookie)

Login per Magic Link (`POST /admin/v1/login` → E-Mail, `GET /admin/v1/login/callback?token=`). Später OIDC mit Microsoft Entra ID. Cookie: `HttpOnly`, `Secure`, `SameSite=Strict`, 12 h. CSRF-Token bei allen schreibenden Aufrufen.

| Methode und Pfad | Zweck |
|---|---|
| `GET /admin/v1/overview` | Kennzahlen der Firma (siehe Nutzung) |
| `GET /admin/v1/devices` | Liste: Name, System, Version, `last_seen_day`, Testgruppe, gesperrt |
| `POST /admin/v1/devices/{id}/revoke` · `/restore` | Zugang sperren oder wiederherstellen |
| `PATCH /admin/v1/devices/{id}` | `{ "test_group": true }` |
| `GET/POST /admin/v1/enroll-keys` · `POST …/{id}/rotate` · `DELETE …/{id}` | Firmenschlüssel |
| `GET/POST/PATCH/DELETE /admin/v1/dictionary` | Firmenbegriffe, CSV-Import `POST …/import` |
| `GET /admin/v1/dictionary/suggestions` · `POST …/{id}/approve` · `/reject` | Vorschläge freigeben |
| `GET/PUT /admin/v1/packs` | Branchenpakete an- und abschalten, einzelne Begriffe ausblenden |
| `GET/PUT /admin/v1/settings` | Engine, Tasten-Vorgabe, Sprache, Paste-Modus, Update-Kanal, feste Version |
| `GET /admin/v1/usage?from=&to=` | Tageswerte der Firma |
| `GET /admin/v1/documents` | AVV, TOM, Unterauftragnehmer, DSFA-Vorlage als PDF |
| `GET/POST/DELETE /admin/v1/admins` | Weitere Admins einladen |

Superadmin zusätzlich: `/admin/v1/tenants` (anlegen, Paket, sperren), `/admin/v1/leads`.

## 5. Datenmodell (Postgres)

```sql
create table tenants (
  id uuid primary key, slug text unique not null, name text not null,
  plan text not null default 'pilot', status text not null default 'active',
  engine text not null default 'whisper-de',
  hotkey_windows text not null default 'RightCtrl', hotkey_macos text not null default 'RightOption',
  user_may_change_hotkey boolean not null default true,
  language text not null default 'auto', paste_mode text not null default 'clipboard',
  update_channel text not null default 'stable', pinned_version text,
  max_seconds int not null default 900, created_at timestamptz not null default now());

create table enroll_keys (
  id uuid primary key, tenant_id uuid not null references tenants,
  key_hash bytea unique not null, label text, max_devices int, expires_at timestamptz,
  revoked_at timestamptz, created_at timestamptz not null default now());

create table devices (
  id uuid primary key, tenant_id uuid not null references tenants,
  token_hash bytea unique not null, name text, os text, os_version text, app_version text,
  last_seen_day date, test_group boolean not null default false,
  revoked_at timestamptz, created_at timestamptz not null default now());

create table dictionary_entries (
  id uuid primary key, tenant_id uuid not null references tenants,
  device_id uuid references devices,          -- null = Firmenbegriff
  status text not null check (status in ('tenant','personal','suggested')),
  written text not null, spoken text[] not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table packs (id text primary key, name text not null);
create table pack_entries (id uuid primary key, pack_id text references packs, written text, spoken text[]);
create table tenant_packs (tenant_id uuid references tenants, pack_id text references packs,
  hidden_entry_ids uuid[] not null default '{}', primary key (tenant_id, pack_id));

create table usage_daily (
  tenant_id uuid references tenants, day date, dictations int not null default 0,
  audio_seconds int not null default 0, primary key (tenant_id, day));

create table admins (id uuid primary key, tenant_id uuid references tenants, -- null = Superadmin
  email citext unique not null, role text not null default 'admin',
  created_at timestamptz not null default now(), last_login_day date);

create table magic_links (token_hash bytea primary key, admin_id uuid references admins,
  expires_at timestamptz not null, used_at timestamptz);

create table audit_log (id bigserial primary key, tenant_id uuid, admin_id uuid,
  action text not null, target text, created_at timestamptz not null default now());

create table leads (id uuid primary key, firma text, name text, email text, telefon text,
  groesse text, ort text, nachricht text, created_at timestamptz not null default now());
```

**Es gibt keine Tabelle für Ton oder Text.** Persönliche Begriffe sind die einzigen Inhalte, die ein Gerät dauerhaft beisteuert.

## 6. Datenschutz in der Technik

- **Keine Inhalte auf Platte:** Audio und Text nur im Arbeitsspeicher, keine temporären Dateien (faster-whisper bekommt ein NumPy-Array). Swap auf dem Server verschlüsselt oder aus.
- **Keine IP-Adressen:** Caddy-Log mit `format filter`, Felder `request>remote_ip`, `request>client_ip` und `request>headers` löschen. Rate-Limit arbeitet nur im Speicher.
- **Keine Inhalte in Logs:** Anwendungslogs enthalten nur Tenant-ID, Gerät-ID, Dauer, Status. Ein Test prüft nach einem E2E-Lauf, dass der diktierte Testsatz in keinem Log steht.
- **Keine Leistungskontrolle:** Pro Gerät nur `last_seen_day` (für Aufräumen und Updates), keine Minuten pro Gerät. Firmenstatistik erst ab 5 aktiven Geräten, sonst „zu wenige Geräte für eine anonyme Auswertung“.
- **Mandantentrennung:** Jede Abfrage filtert nach `tenant_id` aus dem Token, nie aus der Anfrage. Tests versuchen gezielt fremde IDs.

## 7. Sicherheit

- TLS 1.2+ (Caddy, automatische Zertifikate), HSTS
- Rate-Limits pro Gerät: 120 Diktate pro Stunde, 600 Audiominuten pro Tag; pro Firmenschlüssel 30 Anmeldungen pro Stunde
- Body-Limit 4 MB auf `/v1/transcribe`, 64 KB sonst
- Postgres nur im internen Docker-Netz, Hetzner-Firewall: nur 22 (Schlüssel, eigene IP), 80, 443
- Festplatten mit LUKS, nächtliche Backups mit restic auf Hetzner Storage Box (verschlüsselt)
- Abhängigkeiten: Dependabot oder Renovate, SBOM pro Release (CycloneDX), siehe CRA in Briefing 07
- Geheimnisse per `.env` aus einem Passwortmanager, nie im Repo

## 8. Versionierung

API-Version im Pfad (`/v1`). Neue Felder sind erlaubt, Entfernen nur mit `/v2`. Die App sendet `X-Tf-Client`; der Server kann alte Versionen mit `426 upgrade_required` zum Update zwingen.

## Kickoff-Prompt für Claude Code

```
Lies docs/briefings/00-README.md und docs/briefings/03-architektur-api.md.
Erzeuge docs/api/openapi.yaml (OpenAPI 3.1) für alle Endpunkte aus Abschnitt 3 und 4,
mit Beispielen und Fehlercodes, und services/api/migrations/0001_init.sql aus Abschnitt 5.
Schreibe dazu docs/api/README.md mit einem Sequenzdiagramm (mermaid) für Anmeldung
und für ein Diktat. Keine Implementierung, nur der Vertrag. Liste im PR alle Stellen,
an denen du vom Briefing abweichen würdest, mit Begründung.
```

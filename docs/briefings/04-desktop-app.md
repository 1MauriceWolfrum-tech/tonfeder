# 04 · Desktop-App

**Ziel:** Eine signierte Windows-App, die man ohne Adminrechte installiert. Sie meldet sich mit dem Firmenschlüssel an. Danach gilt: Taste halten, sprechen, loslassen, Text am Cursor, mit dem Backend aus Briefing 05. macOS folgt in der Pilotphase.

**Führt:** Claude · **Tests auf Hardware:** Du · **Start:** KW 43 (Spike) · **Vertrag:** Briefing 03, Abschnitt 3

## 1. Grundentscheidung: Fork von Handy

[Handy](https://github.com/cjpais/Handy) (cjpais) ist eine quelloffene Diktier-App unter MIT-Lizenz, gebaut mit Tauri v2 (Rust plus React/TypeScript), für Windows, macOS und Linux. Sie kann schon:
- Push-to-Talk mit konfigurierbarer Taste
- Aufnahme mit Stimmerkennung (Silero VAD)
- Einfügen am Cursor über die Zwischenablage, mit einstellbaren Verzögerungen
- Aufnahme-Overlay
- Automatische Updates über den Tauri-Updater

Damit sparen wir mehrere Wochen. Wir ersetzen die lokale Erkennung durch unser Backend und bauen Firmenanmeldung, Wörterbuch und Verwaltung dazu.

**Bedingungen:**
- MIT-Lizenzhinweis bleibt erhalten (Info-Dialog und `THIRD_PARTY_NOTICES`)
- Name, Logo und Markenzeichen von Handy sind nicht frei, wir benennen und gestalten komplett um
- Upstream-Remote behalten, um Fehlerbehebungen übernehmen zu können

## 2. Phase A · Spike (3–4 Tage, KW 43)

- [ ] Fork anlegen als `tonfeder-desktop`, `upstream` auf cjpais/Handy, Build in GitHub Actions auf `windows-latest` und `macos-latest`
- [ ] `AGENTS.md` und Code lesen, `docs/ARCHITEKTUR.md` schreiben: Module für Audio, Tastatur, Transkription, Einfügen, Overlay, Einstellungen, Verlauf
- [ ] **Alles Persistente finden:** Wo speichert Handy Verlauf, Aufnahmen, Logs, Einstellungen? Liste mit Pfad und Inhalt. Ziel: keine Diktatinhalte auf Platte
- [ ] **Taste prüfen:** Lässt sich das Halten einer einzelnen Modifier-Taste (rechte Strg unter Windows, rechte Option unter macOS) umsetzen? Falls die vorhandene Lösung das nicht kann: Prototyp mit Low-Level-Hook (Windows `SetWindowsHookExW(WH_KEYBOARD_LL)`, `VK_RCONTROL`; macOS `CGEventTap` auf `flagsChanged`, Keycode 61)
- [ ] **Einfügen prüfen:** Erste 10 Programme der Testmatrix (Abschnitt 6) mit der vorhandenen Lösung
- [ ] **Entscheidungsnotiz** `docs/ENTSCHEIDUNG-FORK.md`. Fork fortführen, wenn: Build auf beiden Systemen grün, Taste lösbar, Persistenz in unter einem Tag entfernbar, Code verständlich. Sonst Neubau mit Tauri nach Handys Muster

## 3. Phase B · MVP Windows (KW 44–48)

### Umbenennen und Gestalten
- Name „Tonfeder“, Bundle-ID `de.tonfeder.app`, Icons aus dem Logo (gelbes Quadrat, Cursor aus Pegelbalken)
- Farben und Schriften aus den Tokens in Briefing 02, Oberfläche auf Deutsch (Englisch als zweite Sprache)

### Erkennung über das Backend
- Neuer Anbieter `RemoteEngine`: `POST /v1/transcribe`
- Lokale Modelle und deren Download aus dem Onboarding entfernen. Den Code hinter dem Feature-Flag `local-engine` behalten, als Grundlage für einen späteren Offline-Modus
- Audio: 16 kHz, mono, Opus in Ogg mit 24 kbit/s (etwa 0,2 MB pro Minute). Stille am Anfang und Ende per VAD abschneiden
- Grenze: 900 s, Warnung bei 840 s („Noch 60 Sekunden“)
- Bei Netzfehler: Audio im Speicher halten, 3 Versuche nach 1, 3 und 8 s. Danach Meldung und Eintrag „Diktat erneut senden“ im Tray-Menü, nur bis die App beendet wird

### Anmeldung (ohne Konto)
Reihenfolge beim ersten Start, das Erste, was greift, gewinnt:
1. **Richtlinie:** Registry `HKLM\SOFTWARE\Policies\Tonfeder\EnrollKey` (wird vom MSI gesetzt, Phase C)
2. **Dateiname:** Die Firmen-Download-Seite liefert `Tonfeder-Setup_<Code>.exe`. Der NSIS-Installer liest `$EXEFILE`, schreibt den Code nach `%APPDATA%\de.tonfeder.app\enroll.pending`, die App liest und löscht die Datei. Der Dateiname gehört nicht zur Authenticode-Signatur, eine Datei reicht also für alle Firmen
3. **Manuell:** Dialog „Firmenschlüssel eingeben“ (Einfügen aus Zwischenablage erlaubt)

Das Geräte-Token liegt im Windows-Anmeldeinformationsspeicher bzw. im macOS-Schlüsselbund (`keyring`-Crate), nie in einer Datei.

### Overlay

| Zustand | Anzeige | Auslöser |
|---|---|---|
| Hört zu | Gelbe Pegelbalken, „Hört zu“, Ortskennung (DE, EU oder LAN) | Taste gedrückt |
| Kein Ton | „Ich höre nichts. Mikrofon prüfen“ | Mehr als 3 s Pegel unter der Schwelle |
| Wird gesendet | „Wird gesendet · 43 %“ | Upload dauert länger als 1 s |
| Schreibt | „Schreibt …“ | Upload fertig, Antwort steht aus |
| Eingefügt | „Eingefügt · 2,4 s“, 1,5 s sichtbar | Text eingefügt |
| Kopiert | „In die Zwischenablage kopiert“ | Kein Textfeld im Fokus |
| Offline | „Keine Verbindung. Neuer Versuch …“ | Netzfehler |
| Gesperrt | „Dieses Gerät ist gesperrt. Bitte an Ihre IT wenden“ | 403 `device_revoked` |
| Noch 60 s | Zähler rückwärts | 840 s erreicht |

Das Overlay lässt sich verschieben, die Position wird gemerkt. Stil wie die Pille im Designentwurf.

### Einfügen
- Standard `clipboard`: Zwischenablage sichern, Text setzen, Strg+V senden, Zwischenablage wiederherstellen (auch Bilder und Formate, nicht nur Text)
- `type`: Unicode-Eingabe per `SendInput` mit `KEYEVENTF_UNICODE`, für Programme, die Einfügen blockieren, und für Remote-Sitzungen ohne Zwischenablage-Umleitung
- Modus kommt aus `GET /v1/config`, die Person kann ihn überschreiben
- Grenze dokumentieren: Programme, die mit Adminrechten laufen, nehmen von einer normalen App keine Eingaben an (UIPI). Dann „In die Zwischenablage kopiert“

### Keine Inhalte auf Platte
- Verlauf (falls vorhanden) entfernen. Die letzten 5 Texte nur im Arbeitsspeicher für „Letztes Diktat erneut einfügen“ im Tray-Menü
- Keine Aufnahmen speichern
- Log-Datei (rotierend, max. 1 MB) enthält nur Ereignisse und Dauern, nie Text

### Einstellungen (klein halten)
Taste (falls erlaubt), Mikrofon, Sprache (Automatisch, Deutsch, Englisch), Einfügemodus, **Meine Begriffe** (Liste, hinzufügen, löschen, „für alle vorschlagen“), Info (Version, Firma, Datenstandort, Lizenzen).

### Weiteres
- `POST /v1/heartbeat` einmal täglich
- Konfiguration beim Start und alle 6 h neu laden
- Autostart bei Anmeldung (abschaltbar), Tray-Symbol

### Installer, Signierung, Updates
- NSIS mit `bundle.windows.nsis.installMode: "currentUser"`, also ohne Adminrechte, nach `%LOCALAPPDATA%`
- Authenticode über **Azure Artifact Signing** (für Organisationen in der EU verfügbar, ca. 9,99 $/Monat), eingebunden per `bundle.windows.signCommand` und `trusted-signing-cli` in GitHub Actions. Ersatz: OV-Zertifikat (150–300 $/Jahr)
- SmartScreen warnt anfangs trotzdem, bis die Reputation aufgebaut ist. Den Pilotfirmen vorher sagen, für IT-Rollout per MSI ist das egal
- Tauri-Updater mit eigenem Endpunkt (`/v1/updates/…`), eigener Ed25519-Schlüssel (getrennt vom Authenticode-Zertifikat). Updates still im Hintergrund, Neustart der App beim nächsten Leerlauf

## 4. Phase C · Pilotphase (KW 3–10 2027)

### MSI für IT
- WiX-MSI, Installation pro Rechner, Eigenschaft `FIRMA=<Schlüssel>` → schreibt `HKLM\SOFTWARE\Policies\Tonfeder\EnrollKey`
- Weitere Richtlinien in demselben Schlüssel: `Hotkey`, `PasteMode`, `DisableUserHotkey`, `UpdateChannel`
- Doku `docs/IT-ROLLOUT.md`: Intune (Win32-App), GPO, stilles Setup `msiexec /i Tonfeder.msi FIRMA=… /qn`, Deinstallation

### Terminalserver und Citrix
- Installation pro Rechner auf dem RDS-Host, Anmeldung pro Benutzerprofil (jede Sitzung ein Gerät)
- Ton per RDP-Audioumleitung bzw. Citrix HDX
- Alternative: App läuft auf dem Client und schreibt in das Remote-Fenster (Modus `type`)
- Beide Wege testen und in `docs/IT-ROLLOUT.md` mit Einstellungen dokumentieren

### macOS
- DMG, Developer-ID-Signatur, Hardened Runtime, Notarisierung per `notarytool` in CI
- `NSMicrophoneUsageDescription`, Onboarding für Mikrofon, Bedienungshilfen und ggf. Eingabeüberwachung, mit Screenshots, wo der Haken zu setzen ist
- Anmeldung per Deep Link `tonfeder://enroll?key=…` von der Download-Seite, per Code-Eingabe oder per MDM-Konfigurationsprofil (Managed Preferences `de.tonfeder.app`, Schlüssel `EnrollKey`)

### Update-Kanäle
Testgruppe bekommt neue Versionen zuerst, Firma kann eine Version festlegen (kommt über den Update-Endpunkt).

## 5. Akzeptanzkriterien MVP

- [ ] Installation ohne Adminrechte auf frischem Windows 11 und Windows 10 22H2
- [ ] Anmeldung per Dateiname und per Code funktioniert, Token liegt im Anmeldeinformationsspeicher
- [ ] 20-s-Diktat: Loslassen bis Text P50 ≤ 2 s, P95 ≤ 3 s (gegen Cloud DE)
- [ ] 15-min-Diktat kommt vollständig an, Warnung bei 14 min
- [ ] Zwischenablage nach dem Einfügen in ≥ 99 % von 200 Testläufen wiederhergestellt
- [ ] Gesperrtes Gerät zeigt beim nächsten Diktat „gesperrt“
- [ ] Nach 50 Diktaten liegt keiner der Texte auf der Platte (Prüfung mit Process Monitor und Volltextsuche im Profil)
- [ ] Alle Programme der Testmatrix mit Ergebnis dokumentiert
- [ ] Release signiert, Update von 0.x auf 0.x+1 läuft still durch

## 6. Testmatrix

| Programm | Windows | macOS |
|---|---|---|
| Outlook klassisch / neues Outlook | ☐ / ☐ | ☐ |
| Word, Excel (Zelle) | ☐ | ☐ |
| Teams (neu) | ☐ | ☐ |
| Edge, Chrome: Gmail, Webformular eines CRM | ☐ | ☐ |
| Safari | – | ☐ |
| Editor / TextEdit | ☐ | ☐ |
| Windows Terminal / Terminal | ☐ | ☐ |
| SAP GUI (falls verfügbar) | ☐ | – |
| RDP-Fenster (mstsc), Citrix Workspace | ☐ | ☐ |
| Programm mit Adminrechten (erwartet: Zwischenablage) | ☐ | – |

## Kickoff-Prompt für Claude Code (Spike)

```
Du arbeitest im Repo tonfeder-desktop, einem Fork von cjpais/Handy.
Lies docs/briefings/03-architektur-api.md und docs/briefings/04-desktop-app.md
sowie AGENTS.md des Upstreams. Führe Phase A aus: CI für Windows und macOS,
docs/ARCHITEKTUR.md, Liste aller persistenten Daten, Prüfung der Einzeltaste
(rechte Strg/rechte Option), Entscheidungsnotiz docs/ENTSCHEIDUNG-FORK.md.
Ändere in dieser Phase noch keine Funktionen. Melde, was ich auf echter Hardware
testen soll, als Checkliste im PR.
```

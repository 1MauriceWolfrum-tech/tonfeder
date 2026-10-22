# Tonfeder · Briefings

Stand: 16.10.2026 · „Tonfeder“ ist ein Arbeitstitel
Designentwurf: https://claude.ai/artifact/TMTka2R61zs4NgTCoDhKwy (lokal: `design/tonfeder-landingpage.html`)

## Worum es geht

Eine Spracheingabe für Firmen: Taste halten, sprechen, loslassen, der Text steht am Cursor. Verarbeitet in Deutschland oder im Firmennetz des Kunden. Vorbild ist fixvox.de, die Positionierung ist eine andere: Wir bauen das Produkt, das die **IT-Abteilung im Mittelstand** gern ausrollt (MSI/Intune, keine Benutzerkonten, Terminalserver, Selbstbedienungs-Portal, Preise auf der Website).

## Die Briefings

| Nr | Briefing | Inhalt | Führt | Start |
|---|---|---|---|---|
| 01 | [Produkt & Positionierung](01-produkt-positionierung.md) | Zielgruppe, Wettbewerb, MVP-Umfang, Preise, Erfolgskriterien | Du, ich zuarbeitend | KW 43 |
| 02 | [Website](02-website.md) | Landingpage nach Entwurf, Formular, SEO, Hosting | Claude | KW 45 |
| 03 | [Architektur & API](03-architektur-api.md) | Komponenten, Schnittstellen, Datenmodell, Sicherheit | Claude, Review du | KW 43 |
| 04 | [Desktop-App](04-desktop-app.md) | Fork von Handy (Tauri), Windows zuerst, dann macOS | Claude | KW 43 (Spike) |
| 05 | [Backend & Admin-Portal](05-backend-portal.md) | API, Datenbank, Portal, Betrieb auf Hetzner | Claude | KW 44 |
| 06 | [Spracherkennung & Wörterbuch](06-spracherkennung-woerterbuch.md) | Engine-Benchmark, Korrektur-Pipeline, Kapazität | Claude, Testaufnahmen du | KW 43 |
| 07 | [Recht & Compliance](07-recht-compliance.md) | AVV, TOM, DSFA, Betriebsrat, CRA, Marke | Du mit Beratung, Entwürfe Claude | KW 43 |
| 08 | [Fahrplan & Kosten](08-fahrplan-kosten.md) | Wochenplan, Meilensteine, Budget, Risiken | Du | laufend |

Reihenfolge der Abhängigkeiten: 01 und 03 zuerst. 04, 05 und 06 laufen parallel und nutzen den API-Vertrag aus 03. 02 und 07 laufen nebenher.

## So arbeiten wir zusammen

1. **Ein Briefing, eine Session.** Für jede Arbeitseinheit öffnest du eine neue Claude-Code-Session im passenden Repo und fügst den **Kickoff-Prompt** am Ende des Briefings ein. Das Briefing selbst liegt im Repo unter `docs/briefings/`.
2. **Ich arbeite auf Branches.** Jede Session endet mit einem Pull Request: was gebaut wurde, wie getestet, was offen ist.
3. **Du testest auf echter Hardware** (Windows-Rechner, Mac, ein Testrechner mit Citrix oder RDP) und mergst.
4. **Entscheidungen werden festgehalten.** Jede Entscheidung trägst du (oder ich auf deine Ansage) unten mit Datum ein. Spätere Sessions lesen diese Datei zuerst.
5. **Einmal pro Woche** gleichen wir mit [08-fahrplan-kosten.md](08-fahrplan-kosten.md) ab: fertig, hängt, nächste Woche.

| Rolle | Aufgaben |
|---|---|
| **Du** | Entscheidungen, Accounts und Verträge (Hetzner, Apple, Azure, Domain), Firmendaten, Pilotkunden, Testaufnahmen, Tests auf echter Hardware, Abnahme der PRs |
| **Claude** | Code, Tests, CI, Infrastruktur als Code, Textentwürfe (Website, AVV, TOM, DSFA-Vorlage), Benchmarks, Doku |
| **Extern** | Datenschutzberatung (AVV/TOM/DSFA prüfen), Anwalt (AGB, Marke), Steuerberatung (Rechtsform, Preise) |

## Entscheidungen

| Nr | Frage | Meine Empfehlung | Status |
|---|---|---|---|
| D1 | Name | „Tonfeder“ als Arbeitstitel. Vor Domainkauf Markenrecherche bei DPMA und EUIPO (Klassen 9 und 42) | offen |
| D2 | Positionierung | IT-Rollout im Mittelstand (25–500 Personen). Kanzleien und Praxen erst später, dort sind Sprecho und Diktiro stark | offen |
| D3 | Desktop-Technik | Fork von Handy (MIT, Tauri v2 mit Rust), nach 3–4 Tagen Spike endgültig entscheiden | offen |
| D4 | Standard-Spracherkennung | Selbst betriebenes Whisper (large-v3-turbo oder deutsches Fine-Tune) auf Hetzner GEX44. Mistral als „EU-Cloud“-Option erst nach AVV-Prüfung | offen |
| D5 | Preise | Team 1,50 €, Business 2,50 €, On-Premise 3,00 € pro Person und Monat, Pilot 30 Tage kostenlos | entschieden 16.10.2026 |
| D6 | Rechtsträger | Welche Firma ist Anbieter? Davon hängen Apple-, Azure- und Hetzner-Konten, AVV und Impressum ab | offen, **blockiert Signierung** |
| D7 | Plattform-Reihenfolge | Windows zuerst (MVP), macOS ab Pilotphase | offen |
| D8 | Repos | GitHub, privat: Monorepo `tonfeder` plus Fork `tonfeder-desktop` | offen |

## Was ich von dir vor dem Start brauche

- [ ] GitHub-Organisation mit zwei privaten Repos (`tonfeder`, `tonfeder-desktop`)
- [ ] Antwort zu D6: Rechtsträger, Anschrift, USt-IdNr.
- [ ] Hetzner-Konto auf die Firma (für GPU-Server GEX44 und eine kleine Cloud-VM)
- [ ] Apple Developer Program als Organisation (braucht eine D-U-N-S-Nummer, Vorlauf 1–2 Wochen)
- [ ] Azure-Konto für Artifact Signing (Identitätsprüfung der Firma, einige Werktage)
- [ ] Ergebnis der Markenrecherche, danach Domain sichern (Arbeitsannahme in den Briefings: `tonfeder.de`)
- [ ] Postfach für Pilotanfragen
- [ ] 5–10 Personen, die Testdiktate aufnehmen (Briefing 06)
- [ ] 2–3 Firmen, die einen Pilot machen würden (Briefing 01)

## Repo-Struktur

```
tonfeder/                        Monorepo, privat
  apps/website/                  Astro, statisch (Briefing 02)
  apps/portal/                   Admin-Portal, React + Vite (Briefing 05)
  services/api/                  FastAPI, Postgres (Briefing 05)
  services/stt/                  Engine-Worker, faster-whisper (Briefing 06)
  packages/postprocess/          Sprachbefehle und Wörterbuchkorrektur (Briefing 06)
  infra/                         docker compose, Caddyfile, Skripte
  docs/briefings/                diese Dateien
  docs/compliance/               AVV, TOM, DSFA-Vorlage (Briefing 07)
tonfeder-desktop/                Fork von cjpais/Handy, upstream-Remote behalten (Briefing 04)
```

## Quellen der Recherche (Oktober 2026)

- Handy (MIT, Tauri, Push-to-Talk): https://github.com/cjpais/Handy
- Hetzner GEX44 (RTX 4000 SFF Ada, 20 GB): https://bex.co/blog/2026/07/13/hetzner-gex44-gpu-pricing-break-even, https://www.whtop.com/plans/hetzner.com/128304
- Mistral Voxtral Transcribe 2 (0,003 $/min Batch): https://the-decoder.com/voxtral-transcribe-2-offers-speech-recognition-at-0-003-per-minute/
- Azure Speech Fast Transcription (0,36 $/h): https://apio.sh/apis/azure-speech-to-text
- Code-Signing für Windows, Azure Artifact Signing: https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options
- Tauri: Windows-Signierung: https://v2.tauri.app/distribute/sign/windows/
- Deutsches Whisper-Turbo-Fine-Tune (CTranslate2): https://huggingface.co/TheChola/whisper-large-v3-turbo-german-faster-whisper
- Wettbewerb: https://diktiro.ai/, https://sprecho.ai/, https://sprecho.ai/blog/wispr-flow-alternatives-germany, https://wisprflow.ai/pricing, https://fixvox.de/

# 08 · Fahrplan & Kosten

**Ziel:** Ein Wochenplan von heute bis Version 1.0 im März 2027, mit klaren Zuständigkeiten, Budget und Risiken. Wird jeden Freitag aktualisiert.

**Führt:** Du · Stand: 16.10.2026 · Start: Montag, 19.10.2026 (KW 43)

## 1. Meilensteine

| | Datum | Ergebnis |
|---|---|---|
| **M0** | Fr 23.10.2026 | Entscheidungen D1–D8 getroffen, Konten beantragt (Apple, Azure, Hetzner), Spikes laufen |
| **M1** | Fr 06.11.2026 | Fork entschieden, Standard-Engine gewählt, API-Vertrag fertig, GPU-Server läuft |
| **M2** | Fr 27.11.2026 | MVP intern: Windows-App diktiert gegen Cloud DE, Portal v1, Website auf Staging |
| **M3** | Fr 11.12.2026 | Alpha mit 3–5 Testpersonen, Website live, Compliance-Entwürfe bei der Beratung |
| | KW 51–53 | Feiertage: Puffer, macOS-Signierung, Fehler beheben |
| **M4** | Fr 22.01.2027 | Pilotstart bei 2–3 Firmen (Windows, Mac optional) |
| **M5** | Fr 19.02.2027 | Erste Pilotauswertung, MSI und Terminalserver dokumentiert |
| **M6** | Fr 12.03.2027 | Version 1.0 für Windows und macOS, Preise final, erste zahlende Kunden |

## 2. Wochenplan

| KW | Zeitraum | Du | Claude | Briefing |
|---|---|---|---|---|
| 43 | 19.–23.10. | D1–D8 entscheiden, Markenrecherche, Apple (D-U-N-S), Azure, Hetzner beantragen, Interviews anfragen | Repos und CI, Fork-Spike Phase A, API-Vertrag, Einwilligung für Testaufnahmen | 01, 03, 04, 07 |
| 44 | 26.–30.10. | 4 Interviews, Testaufnahmen organisieren | Aufnahmewerkzeug, Benchmark-Skript, `postprocess`, API-Grundgerüst | 01, 05, 06 |
| 45 | 02.–06.11. | 4 Interviews, GEX44 bestellen, Benchmark-Ergebnis abnehmen | Server-Setup, Benchmark und Lasttest, `RemoteEngine` in der App | 05, 06, 04 |
| 46 | 09.–13.11. | Auswertung Interviews, Positionierung schärfen | App: Anmeldung, Overlay, Einfügen. API: Wörterbuch, Updates. Website-Grundgerüst | 04, 05, 02 |
| 47 | 16.–20.11. | Testmatrix auf deinem Rechner, Impressum-Daten | Portal v1, Website-Inhalte, Impressum und Datenschutzerklärung (Entwurf) | 05, 02, 07 |
| 48 | 23.–27.11. | **M2 abnehmen**, Alpha-Testpersonen einladen | Signierung, Updater, Fehler aus der Testmatrix | 04 |
| 49 | 30.11.–04.12. | Alpha begleiten, Datenschutzberatung beauftragen | AVV, TOM, DSFA-Vorlage, Betriebsrats-Info (Entwürfe), Alpha-Fehler | 07, 04 |
| 50 | 07.–11.12. | **M3:** Website live schalten, Pilotfirmen fest zusagen lassen | Website live, Fehler, Branchenpaket SHK | 02, 06 |
| 51–53 | 14.12.–01.01. | Feiertage | macOS: Signierung, Notarisierung, Berechtigungen | 04 |
| 1–2 | 04.–15.01. | Unterlagen nach Prüfung freigeben, Pilotverträge | MSI und Richtlinien, Portal: Admins, Unterlagen, Testgruppen | 04, 05, 07 |
| 3 | 18.–22.01. | **M4: Pilotstart** | Rollout-Unterstützung, Monitoring | – |
| 4–7 | 25.01.–19.02. | Wöchentlicher Termin mit den Pilotfirmen | Terminalserver und Citrix, Fehler, Paket Logistik, Entra-ID-Login | 04, 05, 06 |
| 8–10 | 22.02.–12.03. | Preise festlegen, AGB, Verkauf starten | Version 1.0, macOS freigeben, SBOM und Sicherheitsseite | 01, 04, 07 |

## 3. Budget

### Laufend (Pilotbetrieb)

| Posten | pro Monat |
|---|---|
| Hetzner GEX44 (RTX 4000 SFF Ada, 20 GB), Preis vor Bestellung prüfen, ggf. Einrichtungsgebühr | 184–234 € |
| Hetzner Cloud-VM für Monitoring | ca. 5 € |
| Hetzner Storage Box (Backups) | ca. 4 € |
| Azure Artifact Signing (Basic) | ca. 9,99 $ |
| bunny.net (Website, Installer-Downloads) | 1–5 € |
| E-Mail-Versand (kostenloser Tarif reicht anfangs) | 0 € |
| Domains | ca. 2 € |
| **Summe** | **ca. 210–265 €** |

Variabel: Mistral als Ausfallreserve oder EU-Cloud-Option ca. 0,003 $ pro Audiominute (10.000 Minuten ≈ 30 $).

### Jährlich
Apple Developer Program 99 €/Jahr.

### Einmalig (Schätzungen, Angebote einholen)

| Posten | Betrag |
|---|---|
| Markenanmeldung DPMA (online, bis 3 Klassen) | 290 € |
| optional EU-Marke (1 Klasse) | 850 € |
| Datenschutzberatung: Prüfung AVV, TOM, DSFA-Vorlage | 1.500–4.000 € |
| Anwalt: AGB, Muster-Betriebsvereinbarung | 1.000–2.500 € |
| Testhardware (Headset, ggf. gebrauchter Mac) | 50–800 € |

### Rechnung pro Kunde (Hypothese)
- Preise seit 16.10.2026: 1,50 € / 2,50 € / 3,00 € pro Person und Monat
- Die laufende Infrastruktur (ca. 210–265 €/Monat) ist erst ab etwa 100–130 zahlenden Plätzen gedeckt (Durchschnitt 2 €), noch ohne Support- und Entwicklungszeit
- 500 Plätze × 2 € ≈ 1.000 € Umsatz pro Monat, 2.000 Plätze ≈ 4.000 €
- Daraus folgt: Der Vertrieb muss auf Masse zielen (Systemhäuser, größere Firmen), und der Lasttest in Briefing 06 entscheidet, wie viele Plätze ein GPU-Server trägt. Mistral als Engine kostet ca. 0,003 $/min. Bei 150 Diktierminuten pro Person und Monat sind das rund 0,45 $, also ein großer Teil des Team-Preises.
- Ab wann ein zweiter GPU-Server nötig ist, zeigt der Lasttest in Briefing 06. Spätestens dann wird auch der Ausfall eines Servers abgesichert

## 4. Risiken

| Risiko | Wahrscheinlichkeit | Wirkung | Gegenmaßnahme |
|---|---|---|---|
| Markt ist schon voll (FixVox, Sprecho, Diktiro, Wispr Flow) | hoch | hoch | IT-Positionierung schärfen, 8 Interviews vor dem großen Bauen, Systemhäuser als Kanal |
| Rechtsträger ungeklärt (D6) | offen | hoch | Blockiert Apple, Azure, AVV → in KW 43 klären |
| Apple-Konto verzögert sich (D-U-N-S) | mittel | mittel | Sofort beantragen, macOS erst in der Pilotphase nötig |
| Fork wird schwer wartbar | mittel | mittel | Spike-Kriterien (Briefing 04), Upstream monatlich zusammenführen |
| SmartScreen-Warnungen bei neuen Versionen | hoch | niedrig | Von Anfang an signieren, MSI-Rollout empfehlen, Pilotfirmen vorwarnen |
| Fachbegriffe werden falsch erkannt | mittel | hoch | Benchmark mit echten Diktaten, Wörterbuch-Pipeline, Branchenpakete |
| Whisper erfindet Text bei Stille | hoch | mittel | VAD, Blockliste, Leerproben im Benchmark |
| Ein GPU-Server fällt aus | mittel | hoch | Monitoring, Mistral als Reserve mit Zustimmung der Firma, zweiter Server ab Lasttest-Grenze |
| Betriebsrat blockiert | mittel | hoch | Keine Personendaten, Betriebsrats-Info und Mustervereinbarung |
| CRA-Pflichten unterschätzt | mittel | mittel | Meldeweg ab sofort, SBOM und Supportzeitraum bis v1.0 |

## 5. Wochenabgleich (jeden Freitag, 20 Minuten)

```
## KW __
Fertig:
Hängt (und woran):
Entscheidungen diese Woche:
Nächste Woche – du:
Nächste Woche – Claude:
Risiken neu/verändert:
```

Den Block hier unten anhängen, älteste Woche zuunterst.

## Kickoff-Prompt für Claude Code

```
Lies docs/briefings/00-README.md und 08-fahrplan-kosten.md.
Lege für jede Zeile im Wochenplan GitHub-Issues an (Label = Briefing-Nummer,
Meilenstein = M0–M6, Zuständigkeit "du" oder "claude" als Label) und ein GitHub-Project
mit Spalten Offen, In Arbeit, Review, Fertig. Gib mir am Ende eine Liste aller Issues,
die mir zugeordnet sind, sortiert nach Fälligkeit.
```

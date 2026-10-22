# 06 · Spracherkennung & Wörterbuch

**Ziel:** Bis Ende KW 45 ist mit echten Diktaten belegt, welche Erkennung wir als Standard betreiben. Die Nachbearbeitung (Sprachbefehle, Wörterbuch) bringt Fachbegriffe auf ≥ 95 % Treffer, ohne normale Wörter zu verfälschen.

**Führt:** Claude · **Testaufnahmen und Referenztexte:** Du (mit 5–10 Freiwilligen) · **Start:** KW 43

## 1. Kandidaten

| Engine | Betrieb | Lizenz / Preis | Warum testen |
|---|---|---|---|
| Whisper large-v3-turbo | selbst, faster-whisper auf GPU | MIT | Standard, gut erprobt, etwa 6× schneller als large-v3 |
| Whisper-Turbo, deutsches Fine-Tune (CTranslate2-Varianten auf Hugging Face, z. B. `TheChola/whisper-large-v3-turbo-german-faster-whisper`) | selbst | Lizenz pro Modell prüfen | Besseres Deutsch laut Modellkarten, eigene Messung nötig |
| NVIDIA Parakeet TDT 0.6B v3 | selbst | CC-BY-4.0 | Sehr schnell, mehrsprachig, Handy nutzt es bereits |
| Mistral Voxtral (offene Gewichte) | selbst, vLLM | Lizenz der jeweiligen Version prüfen | Kontext-Biasing für Fachbegriffe |
| Mistral Voxtral Transcribe 2 (API) | Mistral, Frankreich | ca. 0,003 $/min (Batch) | Kandidat für „EU-Cloud“-Option und als Ausfallreserve |
| Azure Speech Fast Transcription | Microsoft, Region Germany West Central | ca. 0,36 $/h | Nur als Option für Firmen, die es ausdrücklich wollen (US-Konzern) |

## 2. Testset (KW 43–44)

**Du organisierst die Aufnahmen**, ich baue Werkzeug und Auswertung.

- **120 Diktate** von 5–10 Personen, mit schriftlicher Einwilligung (Vorlage liefere ich), gespeichert nur im privaten Testset-Repo bzw. verschlüsselt, nie im Produktivsystem
- **Gruppe A (40):** Büro-E-Mails und Notizen
- **Gruppe B (40):** Fachdiktate mit Begriffen aus den Branchenpaketen (Heizung/Kälte/Klima, Logistik, Steuer & Recht)
- **Gruppe C (40):** schwierig: Werkstatt- oder Autogeräusch, Dialekt und Akzent, schnelles Sprechen, Zahlen, Daten, Uhrzeiten, Deutsch-Englisch-Mischung
- **Längen:** 80 × 5–20 s, 30 × 1–3 min, 10 × 8–15 min
- **Referenztext** pro Diktat von Hand korrigiert, Begriffsliste pro Diktat markiert
- Aufnahme mit dem Mikrofon, das Nutzer wirklich haben (Laptop-Mikro, Headset), über ein kleines Aufnahmewerkzeug, das ich in `tools/recorder` baue

## 3. Messung

Skript `services/stt/bench/run.py`, Ergebnis als Tabelle und `bench/results/<datum>.json`.

| Messgröße | Definition |
|---|---|
| WER | Wortfehlerrate nach Normalisierung (Kleinschreibung, Satzzeichen weg, Zahlen vereinheitlicht), `jiwer` |
| Begriffstreffer | Anteil der markierten Fachbegriffe, die exakt richtig geschrieben sind, vor und nach Nachbearbeitung |
| Zahlen | Anteil richtig formatierter Zahlen, Daten, Uhrzeiten |
| Halluzinationen | Text bei reiner Stille oder Geräusch (10 Leerproben) |
| Latenz | Ende der Aufnahme bis Text, P50 und P95 je Längenklasse, auf dem GEX44 |
| Kosten | pro Audiominute (API) bzw. GPU-Anteil (selbst betrieben) |

**Entscheidungsregel für den Standard:** höchste Begriffstrefferquote nach Nachbearbeitung, sofern WER ≤ 1,2 × beste WER und P95 ≤ 3 s für 20-s-Diktate. Bei Gleichstand gewinnt die selbst betriebene Engine.

## 4. Engine-Dienst `services/stt`

- Interner HTTP-Dienst, nur im Docker-Netz erreichbar: `POST /transcribe` mit PCM (float32, 16 kHz) und JSON-Parametern `language`, `hints`
- faster-whisper mit `compute_type="float16"`, `vad_filter=True`, `condition_on_previous_text=False` (weniger Wiederholungen), Beam-Größe per Benchmark (1 vs. 5)
- Fachbegriffe als `hotwords` bzw. kurzer `initial_prompt` („Begriffe: FrostLine 300, Frau Jäschke, …“), höchstens 100 Begriffe, Firmenbegriffe zuerst. Wirkung im Benchmark messen, Prompt kann den Stil beeinflussen
- Lange Diktate über `BatchedInferencePipeline`
- Modell beim Start laden und aufwärmen, `/readyz` erst danach grün
- Mehrere Worker-Prozesse auf einer GPU, Anzahl aus dem Lasttest

## 5. Kapazität (KW 45)

Lasttest mit `locust` oder eigenem Skript: simulierte Geräte schicken 20-s-Diktate, Spitze 3 Anfragen pro Sekunde, danach steigern bis P95 > 3 s.
Ergebnis: **aktive Geräte pro GEX44** bei 10 Diktaten pro Person und Stunde in der Spitze. Daraus folgt, ab wann ein zweiter Server nötig ist (Briefing 08). Hypothese vor der Messung: mehrere hundert aktive Geräte.

## 6. Nachbearbeitung `packages/postprocess`

Reines Python-Paket, ohne Abhängigkeit zu FastAPI, damit es auch in der Box läuft. Reihenfolge:

### 6.1 Aufräumen
- Leerraum normalisieren
- **Bekannte Whisper-Halluzinationen** entfernen, wenn die Aufnahme wenig Sprachanteil hat, z. B. „Untertitel im Auftrag des ZDF …“, „Untertitelung des ZDF“, „Untertitel der Amara.org-Community“, „Vielen Dank fürs Zuschauen“. Liste in `postprocess/data/halluzinationen_de.txt`, erweiterbar aus dem Benchmark

### 6.2 Sprachbefehle

| Gesprochen | Ergebnis |
|---|---|
| „neuer Absatz“ | zwei Zeilenumbrüche |
| „neue Zeile“ | ein Zeilenumbruch |
| „Doppelpunkt“ | `:` |
| „Spiegelstrich“ | Zeilenumbruch + `– ` |
| „Klammer auf“ / „Klammer zu“ | `(` / `)` |
| „Anführungszeichen unten“ / „oben“ | `„` / `“` |

Erkennung tolerant gegenüber den Satzzeichen, die Whisper drumherum setzt („Neuer Absatz.“). Abschaltbar pro Firma. Groß- und Kleinschreibung des Folgeworts anpassen.

### 6.3 Wörterbuch
Eingabe: Liste von Einträgen `{written, spoken[]}` aus Firma, Paketen und persönlichen Begriffen.

1. **Feste Zuordnungen:** Für alle `spoken`-Varianten exakter Vergleich auf normalisierten Wortfolgen (klein, Umlaute vereinheitlicht, Satzzeichen weg), längste Folge zuerst. Treffer → `written`
2. **Phonetischer Abgleich** für Einträge ohne passende Variante: Kandidaten sind alle Wortfolgen mit 1–4 Wörtern. Ersetzen, wenn
   - der Code nach **Kölner Phonetik** gleich ist oder bei Codes ab 5 Zeichen eine Levenshtein-Distanz ≤ 1 hat, **und**
   - die Jaro-Winkler-Ähnlichkeit der Schreibweisen ≥ 0,85 ist, **und**
   - der Kandidat kein häufiges deutsches Wort ist (Liste der 5.000 häufigsten Wörter), außer es gibt eine feste Zuordnung
3. Satzzeichen am Rand und Großschreibung am Satzanfang erhalten
4. Ergebnis: Text und Anzahl der Korrekturen

Bibliotheken: `cologne-phonetics` (PyPI), `rapidfuzz`.

Beispiel: Whisper schreibt „Frost Lein“, im Wörterbuch steht „FrostLine“. Beide haben den Kölner-Phonetik-Code `378256`, die Ähnlichkeit der Schreibweisen liegt über der Schwelle, also wird ersetzt. „Jeschke“ und „Jäschke“ teilen den Code `084`. Bei so kurzen Codes ist nur exakte Gleichheit erlaubt.

### 6.4 Tests
- Tabellen-Tests pro Branchenpaket: `tests/cases/<paket>.tsv` mit Eingabe und Erwartung
- **Falsch-positiv-Test:** 500 normale Sätze (Nachrichten, E-Mails) mit allen Paketen aktiv → keine Änderung erwartet
- Laufzeit: ≤ 20 ms für 1.000 Wörter und 2.000 Einträge

## 7. Branchenpakete (erste Fassung)

Je Paket 150–300 Begriffe mit gesprochenen Varianten, als YAML in `packages/postprocess/packs/`:
- `shk.yaml`: Heizung, Kälte, Klima (z. B. VDI 2035, Luft-Wasser-Wärmepumpe, R-290, hydraulischer Abgleich, Brennwerttherme)
- `logistik.yaml`: EDIFACT, Europalette, ADR, Kommissionierzone, Lieferscheinnummer
- `recht-steuer.yaml`: § 13b UStG, Umsatzsteuer-Voranmeldung, Aktenzeichen-Muster, E-Rechnung, XRechnung

Ich erstelle Entwürfe, du lässt sie von je einer Person aus der Branche gegenlesen.

## 8. Akzeptanzkriterien

- [ ] Benchmark mit allen Kandidaten aus Abschnitt 1 gelaufen, Ergebnis in `bench/results/`, Entscheidung in `00-README.md` (D4) eingetragen
- [ ] Begriffstreffer nach Nachbearbeitung ≥ 95 % auf Gruppe B
- [ ] Falsch-positiv-Test: 0 Änderungen auf 500 Sätzen
- [ ] Keine Halluzination auf den 10 Leerproben
- [ ] Lasttest-Ergebnis „aktive Geräte pro GEX44“ dokumentiert

## Kickoff-Prompt für Claude Code

```
Lies docs/briefings/00-README.md, 03-architektur-api.md und 06-spracherkennung-woerterbuch.md.
Baue (1) tools/recorder: kleines Aufnahmewerkzeug, speichert WAV und Metadaten in einen
lokalen Ordner, (2) services/stt/bench: Benchmark-Skript für die Kandidaten aus Abschnitt 1
mit den Messgrößen aus Abschnitt 3, (3) packages/postprocess mit Abschnitt 6 inklusive
aller Tests. Für die APIs nimm Schlüssel aus Umgebungsvariablen und überspringe Engines
ohne Schlüssel. Das Testset selbst liegt nicht im Repo.
```

# 01 · Produkt & Positionierung

**Ziel:** Bis Ende KW 44 steht fest, für wen Tonfeder gebaut wird, was im MVP drin ist und was nicht, und was es kostet. Alle anderen Briefings richten sich danach.

**Führt:** Du. Ich liefere Entwürfe, Interviewleitfaden und Auswertung.

## 1. Problem

In vielen Firmen tippen Menschen jeden Tag lange Texte, obwohl Sprechen dreimal schneller wäre: Service-Techniker schreiben Berichte, der Vertrieb Gesprächsnotizen, die Assistenz E-Mails. Die eingebaute Diktierfunktion von Windows oder macOS scheitert an Fachbegriffen und schickt Sprache an US-Konzerne. Datenschutz und Betriebsrat stoppen deshalb amerikanische Tools wie Wispr Flow. Die IT will außerdem nichts, das jede Person einzeln einrichten muss.

## 2. Zielgruppe

**Kernmarkt:** Mittelständische Firmen mit 25 bis 500 Beschäftigten, eigener IT oder einem Systemhaus, Microsoft 365 und Softwareverteilung (Intune, GPO, Baramundi, Matrix42). Branchen mit viel Text und Fachsprache: technischer Service und Handwerk (Heizung, Kälte, Klima, Elektro), Logistik, Großhandel, Ingenieurbüros.

| Rolle | Will | Entscheidet über |
|---|---|---|
| IT-Leitung | Stiller Rollout, keine Konten, Updates im Griff, läuft im Terminalserver | Technische Freigabe |
| Datenschutzbeauftragte(r) | AVV, TOM, klarer Datenfluss, nichts gespeichert | Datenschutzfreigabe |
| Betriebsrat | Keine Leistungs- oder Verhaltenskontrolle | Zustimmung nach § 87 BetrVG |
| Geschäftsführung | Zeitersparnis, planbare Kosten | Budget |
| Nutzer | Funktioniert sofort, schreibt Fachbegriffe richtig | Ob es genutzt wird |

**Später:** Kanzleien, Steuerberatung, Praxen (§ 203 StGB), öffentliche Verwaltung. **Vertriebskanal später:** Systemhäuser, die Tonfeder bei vielen Kunden ausrollen (Partner-Zugang mit mehreren Firmen im Portal).

## 3. Wettbewerb

| Anbieter | Herkunft, Hosting | Preis pro Person/Monat | Stärken | Lücke für uns |
|---|---|---|---|---|
| FixVox (R2 Consult) | DE, Server EU/DE, Box | nur auf Anfrage | Kein Konto, Firmen-Link, zentrales Wörterbuch | Nur Managed Service, kein Self-Service-Portal, keine Preise, kein MSI, kein Terminalserver erwähnt. Laut Website läuft jedes Diktat über den FixVox-Server, auch im Box-Modus |
| Sprecho | DE, STRATO | 9,51–12,99 € | Viele Plattformen, KI-Schreibstile, § 203 | Fokus Kanzlei/Praxis, Konten pro Person |
| Diktiro | DE, lokal/DE-Cloud/Private Cloud | 11–23 € | KI-Formatierung, Meeting-Notizen | Fokus Kanzlei/Beratung |
| Wispr Flow | USA, US-Server | ca. 15 $, Teams 18–23 $ | Sehr gute UX, KI-Bearbeitung | DSGVO, CLOUD Act |
| Dragon Professional | lokal | Lizenz | Bekannt, lokal | Teuer, alt, schwer zu verwalten |
| Handy (Open Source) | lokal | kostenlos | Gut, offline | Keine Verwaltung für Firmen |

## 4. Positionierung

> Für mittelständische Firmen, deren IT Software zentral ausrollt, ist Tonfeder die Spracheingabe, die sich wie jede andere Firmensoftware verteilen und verwalten lässt. Verarbeitet in Deutschland oder im eigenen Netz, ohne Benutzerkonten und ohne Leistungskontrolle.

**Vier Unterschiede, die wir auf jeder Seite wiederholen:**

1. **Rollout wie Firmensoftware:** MSI für Intune und GPO, Firmenschlüssel statt Konten, Update-Kanäle und Testgruppen.
2. **Terminalserver und Citrix:** Diktieren in Remote-Sitzungen, ein häufiges Problem im Mittelstand.
3. **Echter Inhaus-Betrieb:** Im Box- oder Rechenzentrumsmodus geht der Ton direkt im Firmennetz zur Erkennung, nicht über unsere Cloud.
4. **Offen:** Preise auf der Website, Self-Service-Portal, Betriebsrats-Paket mit fertiger Mustervereinbarung.

**Slogan:** „Gesagt. Geschrieben.“

## 5. Umfang

### MVP (Pilotreife, Ende KW 50)

- Windows-App: Taste halten, sprechen, loslassen, Text am Cursor
- Diktate bis 15 Minuten, Deutsch und Englisch automatisch erkannt
- Sprachbefehle: neuer Absatz, neue Zeile, Doppelpunkt, Spiegelstrich, Klammer auf und zu
- Firmenwörterbuch und persönliche Begriffe, Vorschlag „für alle“ mit Freigabe durch Admin
- Installation per Firmen-Link (Firmenschlüssel im Dateinamen) oder Code-Eingabe
- Cloud Deutschland: eigener Server und eigene Whisper-Erkennung bei Hetzner
- Admin-Portal, Version 1: Geräte sperren, Wörterbuch, Firmenschlüssel, Nutzung je Firma
- Signierte App, automatische Updates
- Website mit Pilotformular, AVV, TOM und DSFA-Vorlage

### Pilotphase (KW 3–10 2027)

- macOS-App, signiert und notarisiert
- MSI für Intune und GPO
- Terminalserver und Citrix getestet und dokumentiert
- Update-Kanäle (Testgruppe, Stabil), Version pro Firma festlegen
- Branchenpakete: Heizung/Kälte/Klima, Logistik
- Admin-Login per Microsoft Entra ID

### Später

- Tonfeder Box und Betrieb im Kunden-Rechenzentrum
- „Formulieren“: aus einem Diktat eine höfliche E-Mail machen (lokales Sprachmodell)
- Partner-Portal für Systemhäuser, weitere Sprachen, Mobil-Apps

### Bewusst nicht

- Meeting-Transkription und Aufnahme von Gesprächen
- Speicherung von Ton oder Text auf unseren Servern
- Statistiken pro Person

## 6. Preise (Hypothese)

| Paket | Preis | Ab | Enthält |
|---|---|---|---|
| Team | 1,50 € pro Person/Monat | 5 Personen | Cloud DE, Wörterbuch, Portal, Firmen-Link, E-Mail-Support |
| Business | 2,50 € pro Person/Monat | 25 Personen | + MSI, Terminalserver, Branchenpakete, Update-Steuerung, Telefon |
| On-Premise | 3,00 € pro Person/Monat | 50 Personen | Rechenzentrum oder Box, Wartung; Box oder Server nach Angebot |

Entschieden am 16.10.2026: bewusst deutlich unter dem Wettbewerb (Sprecho, Diktiro und Wispr Flow liegen bei 9–23 €). Folge: Wirtschaftlich wird es erst über Menge. Siehe Rechnung in Briefing 08.

Pilot 30 Tage kostenlos, danach monatlich kündbar. Abrechnung nach Geräten, die im Monat aktiv waren, nicht nach installierten. Prüfen in den Interviews: Zahlungsbereitschaft, Abrechnung pro Gerät oder Person, Jahresrabatt.

## 7. Interviews (KW 43–44)

Ziel: 8 Gespräche, je 30 Minuten, mit IT-Leitungen oder Geschäftsführungen aus dem Kernmarkt.

Leitfaden:
1. Wer schreibt bei Ihnen am meisten Text, und wo (Programme)?
2. Nutzt schon jemand Diktierfunktionen? Welche, und was stört?
3. Wie verteilen Sie Software? Gibt es Terminalserver oder Citrix?
4. Was müsste Ihr Datenschutz sehen, damit er zustimmt? Gibt es einen Betriebsrat?
5. Wo müsste die Sprache verarbeitet werden? Wäre ein Gerät im Serverschrank interessant?
6. Was wäre Ihnen eine funktionierende Lösung pro Person und Monat wert?
7. Würden Sie einen 30-Tage-Pilot mit 5–10 Personen machen? Wer wäre dabei?

Ergebnis: Tabelle mit Antworten, darunter drei Sätze „Was wir ändern“. Ich werte aus, wenn du mir die Notizen gibst.

## 8. Erfolgskriterien

| Messgröße | Ziel im Pilot |
|---|---|
| Installiert → aktiv an mindestens 3 Tagen pro Woche | ≥ 60 % |
| Diktierminuten pro aktiver Person und Tag | ≥ 5 |
| Fachbegriffe richtig geschrieben (Testset aus Briefing 06) | ≥ 95 % |
| Zeit vom Loslassen bis zum Text (20-s-Diktat, P95) | ≤ 3 s |
| Pilot → zahlender Kunde | ≥ 40 % |

## Kickoff-Prompt für Claude Code

```
Lies docs/briefings/00-README.md und docs/briefings/01-produkt-positionierung.md.
Erstelle docs/produkt/interview-leitfaden.md (druckbar, mit Platz für Notizen) und
docs/produkt/interview-auswertung.md als leere Vorlage mit Tabelle.
Erstelle außerdem docs/produkt/claims.md: eine Tabelle aller Aussagen der Website
(design/tonfeder-landingpage.html) mit Spalte "Feature/Nachweis" und "Status".
Keine Aussage darf live gehen, deren Status nicht "getestet" ist.
```

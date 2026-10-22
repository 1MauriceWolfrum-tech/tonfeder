# 07 · Recht, Datenschutz & Compliance

**Ziel:** Vor dem ersten Pilot liegen alle Unterlagen vor, die Datenschutz, IT-Sicherheit und Betriebsrat einer Firma verlangen. Sie sind von einer Fachperson geprüft.

**Führt:** Du, mit Datenschutzberatung und Anwalt · **Entwürfe:** Claude · **Start:** KW 43

> Ich schreibe Entwürfe und Checklisten, keine Rechtsberatung. Jedes Dokument hier muss vor der Verwendung von einer Fachperson geprüft werden.

## 1. Zuerst klären

- [ ] **Rechtsträger (D6):** Welche Firma bietet Tonfeder an? Rechtsform, Anschrift, Handelsregister, USt-IdNr. Davon hängen Impressum, AVV, Apple-Konto (D-U-N-S-Nummer), Azure-Identitätsprüfung und Hetzner-Vertrag ab
- [ ] **Marke:** Recherche „Tonfeder“ im DPMAregister und bei der EUIPO (TMview), Klassen 9 (Software) und 42 (SaaS). Wenn frei: DPMA-Anmeldung online 290 € für bis zu 3 Klassen. EU-Marke ab 850 € für eine Klasse
- [ ] **Domain** erst nach der Markenrecherche sichern (`tonfeder.de`, `.com`, `get.` und `api.` als Subdomains)

## 2. Dokumente

| Dokument | Grundlage | Entwurf | Prüfung | Fertig bis |
|---|---|---|---|---|
| Impressum | § 5 DDG | Claude | Du | KW 47 |
| Datenschutzerklärung Website | Art. 13 DSGVO | Claude | Beratung | KW 47 |
| Vertrag zur Auftragsverarbeitung (AVV) | Art. 28 DSGVO | Claude | Beratung | KW 50 |
| TOM (technische und organisatorische Maßnahmen) | Art. 32 DSGVO | Claude, aus Briefing 03/05 | Beratung | KW 50 |
| Liste der Unterauftragnehmer | Art. 28 Abs. 2, 4 | Claude | Du | KW 50 |
| Verzeichnis der Verarbeitungstätigkeiten (eigene Verarbeitung: Leads, Admins) | Art. 30 | Claude | Beratung | KW 50 |
| Vorlage Datenschutz-Folgenabschätzung für Kunden | Art. 35 | Claude | Beratung | KW 2 |
| Betriebsrats-Info und Muster-Betriebsvereinbarung | § 87 Abs. 1 Nr. 6 BetrVG | Claude | Anwalt | KW 2 |
| AGB (B2B), Leistungsbeschreibung, SLA | BGB | Claude | Anwalt | KW 2 |
| Einwilligung für Testaufnahmen (Briefing 06) | Art. 6, 7 | Claude | Beratung | KW 43 |
| Sicherheitsrichtlinie und Meldeweg für Schwachstellen | CRA | Claude | Du | KW 50 |

Ablage: `docs/compliance/` als Markdown, daraus PDFs für das Portal.

## 3. Inhalte im Detail

### AVV
- Gegenstand: Umwandlung von Sprache in Text für die Beschäftigten des Kunden
- Datenarten: Sprachaufnahmen und Texte (nur flüchtig im Arbeitsspeicher), Gerätenamen und -kennungen, Kontaktdaten der Admins, persönliche Wörterbuchbegriffe
- Betroffene: Beschäftigte des Kunden **und Dritte, deren Namen oder Daten diktiert werden** (Kunden, Patienten, Mandanten)
- Keine Speicherung von Inhalten, Löschung sofort nach Rückgabe des Textes
- Anlagen: TOM, Unterauftragnehmer, Kontakt für Datenschutz
- Änderungen an Unterauftragnehmern 30 Tage vorher ankündigen, mit Widerspruchsrecht (so steht es auf der Website)

### Unterauftragnehmer (Planungsstand)

| Anbieter | Sitz | Zweck | Kundendaten? |
|---|---|---|---|
| Hetzner Online GmbH | Deutschland | Server, Rechenzentrum Nürnberg/Falkenstein | Ja, flüchtig |
| Brevo (oder anderer EU-Mailversand) | Frankreich | E-Mails an Admins (Magic Link) | Nur Admin-E-Mail |
| BunnyWay d.o.o. (bunny.net) | Slowenien | Website, Download der Installer | Nein |
| Mistral AI | Frankreich | Nur wenn eine Firma „EU-Cloud“ wählt | Ja, flüchtig. Vorher prüfen: Verarbeitungsort, Aufbewahrung, AVV |
| GitHub (Microsoft) | USA | Quellcode und Build | Nein, keine Kundendaten |

### TOM (Gliederung)
Zutritt (zertifiziertes Rechenzentrum), Zugang (SSH-Schlüssel, MFA für Admin-Konten), Zugriff (Rollen, Mandantentrennung), Weitergabe (TLS 1.2+), Eingabekontrolle (Audit-Log für Admin-Aktionen), Verfügbarkeit (Monitoring, Backups, Wiederherstellungstest), Trennung (Tenant-ID in jeder Abfrage), Verschlüsselung (LUKS, verschlüsselte Backups), Datensparsamkeit (keine Inhalte, keine IP-Adressen), regelmäßige Überprüfung.

### Betriebsrat
In Deutschland braucht jede technische Einrichtung, die Leistung oder Verhalten überwachen *kann*, die Zustimmung des Betriebsrats (§ 87 Abs. 1 Nr. 6 BetrVG). Tonfeder ist so gebaut, dass das nicht möglich ist:
- keine Minuten oder Diktatzahlen pro Gerät oder Person
- „zuletzt gesehen“ nur als Tag, nur zum Aufräumen und für Updates
- Auswertung erst ab 5 aktiven Geräten
- keine Inhalte

Daraus eine **zweiseitige Betriebsrats-Info** und eine **Muster-Betriebsvereinbarung** machen. Das ist ein Verkaufsargument: Der Kunde spart sich Wochen.

### Berufsgeheimnisträger (später)
Für Kanzleien, Steuerberatung, Praxen: Verpflichtung zur Verschwiegenheit nach § 203 Abs. 4 StGB für alle Personen mit Zugriff. Erst angehen, wenn wir diese Zielgruppe bedienen (Briefing 01).

## 4. Cyber Resilience Act (Verordnung (EU) 2024/2847)

Tonfeder ist ein Produkt mit digitalen Elementen, das in der EU verkauft wird.
- **Seit 11.09.2026:** Meldepflicht für aktiv ausgenutzte Schwachstellen und schwere Sicherheitsvorfälle an ENISA bzw. die nationale Stelle
- **Ab 11.12.2027:** volle Pflichten, u. a. Sicherheit by Design, Schwachstellenmanagement, SBOM, Sicherheitsupdates über einen festgelegten Supportzeitraum, Konformitätsbewertung und CE-Kennzeichnung

Aufgaben jetzt:
- [ ] `security.txt` und Seite „Sicherheitslücke melden“ (Briefing 02)
- [ ] Interner Ablauf: Meldung annehmen → bewerten → Fix → Meldung an Behörde, falls aktiv ausgenutzt (Fristen: Frühwarnung 24 h, Meldung 72 h)
- [ ] SBOM pro Release (`cargo cyclonedx` für die App, `cyclonedx-py` für die API)
- [ ] Supportzeitraum je Hauptversion festlegen und veröffentlichen
- [ ] Bis Mitte 2027: Konformitätsbewertung mit Beratung planen

## 5. KI-Verordnung (EU AI Act)

Spracherkennung zum Diktieren ist kein Hochrisiko-System. Pflichten für Basismodelle liegen bei den Modellanbietern. Für uns gilt die Pflicht zur KI-Kompetenz (Art. 4) für das eigene Team. Kurz von der Beratung bestätigen lassen, insbesondere ob Transparenzpflichten nach Art. 50 greifen. Erwartung: nein, weil wir Gesprochenes nur verschriftlichen.

## 6. Lizenzen

| Bestandteil | Lizenz | Pflicht |
|---|---|---|
| Handy (Fork) | MIT | Lizenztext in App und `THIRD_PARTY_NOTICES`, Name und Logo von Handy nicht verwenden |
| Whisper, faster-whisper | MIT | Hinweis |
| Deutsches Fine-Tune | pro Modell prüfen | vor Einsatz klären |
| Parakeet (falls gewählt) | CC-BY-4.0 | Namensnennung |
| Schriften (Archivo, Atkinson Hyperlegible) | SIL OFL | Hinweis |

Automatisierte Lizenzprüfung im CI (`cargo deny`, `pip-licenses`), keine GPL-Abhängigkeiten in der App.

## 7. Website-Recht

- Keine Cookies, keine Drittanbieter, selbst gehostete Schriften → kein Cookie-Banner nötig
- Formular: Einwilligungstext mit Löschfrist 180 Tage, Verweis auf Datenschutzerklärung
- Barrierefreiheitsstärkungsgesetz: betrifft vor allem Angebote an Verbraucher. Wir sind B2B, bauen trotzdem nach WCAG 2.2 AA

## Kickoff-Prompt für Claude Code

```
Lies docs/briefings/00-README.md, 03-architektur-api.md, 05-backend-portal.md und
07-recht-compliance.md. Schreibe Entwürfe in docs/compliance/: avv.md, tom.md,
unterauftragnehmer.md, dsfa-vorlage.md, betriebsrat-info.md, muster-betriebsvereinbarung.md,
einwilligung-testaufnahmen.md, sicherheitsrichtlinie.md. Leite jede technische Aussage
aus den Briefings ab und markiere mit [PRÜFEN], was eine Fachperson klären muss
(z. B. Rechtsträger, Fristen, Haftung). Setze oben in jede Datei:
"Entwurf, keine Rechtsberatung, Stand <Datum>".
```

# 02 · Website

**Ziel:** Die Landingpage aus dem Designentwurf geht als schnelle, statische Website live. Das Pilotformular funktioniert auch ohne JavaScript, die Seite setzt keine Cookies, und jede Aussage ist durch ein getestetes Feature gedeckt.

**Führt:** Claude · **Abnahme:** Du · **Start:** KW 45 · **Abhängig von:** D1 (Name, Domain), D5 (Preise), Leads-Endpunkt aus Briefing 05

**Vorlage:** `design/tonfeder-landingpage.html` (veröffentlicht unter https://claude.ai/artifact/TMTka2R61zs4NgTCoDhKwy)

## 1. Designsystem

Stand Version 3 des Entwurfs, angelehnt an die Basis-App (`1MauriceWolfrum-tech/Basis-App`, `app/globals.css`): **nur dunkles Design**, Lime-Akzent, Terminal-Anmutung. Die erste, helle Fassung liegt in `design/archiv/`.

| Token | Wert | Verwendung |
|---|---|---|
| `--canvas` | `#0a0f0b` | Seitenhintergrund |
| `--panel` | `#121a14` | Karten, Boxen |
| `--panel-2` | `#1a241c` | Hover, aktive Reiter |
| `--edge` / `--edge-2` | `#27362a` / `#34483a` | Rahmenlinien |
| `--ink` | `#e8f0e9` | Text (ca. 17:1 auf canvas) |
| `--ink-muted` | `#a8bcab` | Nebentext (ca. 9:1) |
| `--accent` | `#a3e635` | Buttons, Hervorhebung, Ton im Diagramm |
| `--accent-soft` | `#bef264` | Hover |
| `--live` / `--progress` / `--idea` / `--danger` | `#4ade80` / `#fcd34d` / `#7dd3fc` / `#fda4af` | Status-Badges, Text im Diagramm (`--idea`) |

**Schriften:** Geist (Text, Überschriften 650–700, enge Laufweite) und Geist Mono (Kicker, Tasten, Zahlen, Terminal). Wie in der Basis-App **selbst hosten**, nicht zur Laufzeit von Google laden. Das LG München I hat 2022 das Einbinden über Google-Server als Datenschutzverstoß gewertet (Az. 3 O 17493/20).

**Gestaltungsmerkmale:**
- Jeder Abschnitt beginnt mit einem Terminal-Kicker (`$ tonfeder deploy`), darunter die Überschrift mit einem Teil in Lime
- Status immer mit Symbol und Text, nie nur über Farbe (Badges wie in der Basis-App)
- Karten mit Rahmen, die beim Hover in Lime aufleuchten, dazu ein Lichtfleck, der dem Mauszeiger folgt
- Fotos mit dunklem Verlauf, darüber schwebende App-Karten und die Aufnahme-Pille

**Interaktive Elemente** (alle respektieren „Bewegung reduzieren“ und zeigen ohne JS ihren Endzustand):
- Hero: Gedrückthalten-Demo mit Wellenform (Maus, Finger, Leertaste, rechte Strg)
- Einsatzbereiche: 5 Reiter mit Fotos, wechseln automatisch alle 7 s
- Bildband: Slideshow wie in der Basis-App
- Datenstandort: SVG-Schema mit laufenden Datenpaketen, drei Betriebsarten
- IT: Terminal, das Befehle für Intune, GPO und Firmen-Link tippt
- Portal-Mock: Reiter, hochzählende Kennzahlen, Geräte sperren
- Wörterbuch: echte Kölner-Phonetik-Korrektur im Browser, eigene Begriffe ergänzbar
- Preisrechner mit Regler

**Fotos:** 8 Bilder von Unsplash, Quellen in `design/img/QUELLEN.md`. Vor dem Livegang prüfen, ob jedes noch verfügbar ist, und gegen eigene Fotos tauschen, wo möglich.

**Ecken (seit Version 4, „kantig“):** `--r-s: 2px` für Buttons, Eingabefelder und Badges, `--r: 3px` für Karten, `--r-l: 4px` für Fenster und Fotos. Keine Pillenform, keine runden Punkte.

**Bildbänder:** Wiederkehrendes Element über die volle Breite: Foto, Terminal-Befehl, der sich selbst tippt, und eine große Aussage. Vier Stück: Deutschland (4 Motive, groß), IT, Wörterbuch, Pilot. Mit Zähler, Vor/Zurück und Pause-Knopf (WCAG 2.2.2).

**Desktop-Nachbau:** Abschnitt `#desktop` mit Taskleiste, Tray-Symbol samt Menü, verschiebbarer Anzeige, Einstellungsfenster und allen Zuständen der Anzeige aus Briefing 04.

**Logo:** Siehe `design/logo/` und https://claude.ai/artifact/UsLRKU7JwxjA4W9KBZqdWK. Ein Zeichen aus Text-Cursor und Pegelbalken, daneben ein eigener, kantiger Schriftzug aus Pfaden: „ton“ in Lime, „feder“ in Weiß. Als SVG und als Favicon (16, 32, 180 px) ausliefern.

## 2. Technik

- **Offene Entscheidung:** Astro 5 (rein statisch) oder derselbe Stack wie die Basis-App (Next.js 16, Tailwind v4 mit `@theme`, next-intl, strikte Nonce-CSP). Empfehlung: **Basis-App-Stack**, weil du ihn kennst und Muster wie Slideshow, Badges, Formular mit Zod und Honeypot übernommen werden können. Jeder Abschnitt wird eine eigene Komponente.
- **JavaScript** nur für die interaktiven Elemente oben, als Client-Komponenten. Ohne JS zeigt jede Stelle ihren Endzustand.
- **Hosting:** bunny.net Storage und CDN (EU, Slowenien) oder eine Hetzner-Cloud-VM mit Caddy. Empfehlung: bunny.net, weil die Website dann unabhängig vom GPU-Server läuft.
- **Deployment:** GitHub Actions bei Merge auf `main`. Preview-Deployments für PRs.
- **Analyse:** zum Start keine. Später höchstens cookielos und in der EU (z. B. Plausible).

## 3. Seiten

| Pfad | Inhalt |
|---|---|
| `/` | Landingpage wie im Entwurf: Hero, So funktioniert's, Für die IT, Wörterbuch, Datenstandort, Datenschutz, Preise, Ablauf, Fragen, Pilot |
| `/sicherheit` | Trust Center: Datenfluss, TOM-Kurzfassung, Liste der Unterauftragnehmer mit Stand-Datum, Meldeweg für Schwachstellen |
| `/unterlagen` | AVV, TOM, DSFA-Vorlage, Betriebsrats-Info als PDF, nach Eingabe einer E-Mail oder frei (Entscheidung offen) |
| `/danke` | Bestätigung nach dem Formular, ohne JS erreichbar |
| `/impressum`, `/datenschutz` | Pflichtseiten (Texte aus Briefing 07) |
| `/.well-known/security.txt` | Kontakt für Sicherheitsmeldungen (CRA, Briefing 07) |

Die Download-Seite pro Firma (`get.tonfeder.de/<code>`) gehört zum Backend (Briefing 05), nicht zur statischen Website.

## 4. Pilotformular

- `<form method="post" action="https://api.tonfeder.de/api/leads">`, damit es auch ohne JS funktioniert. FixVox fällt ohne JS auf GET zurück und schreibt die Angaben in die URL, das passiert hier nicht.
- Der Server antwortet ohne JS mit `303` auf `/danke`. Mit JS schickt `fetch` JSON und zeigt die Bestätigung direkt im Formular.
- Felder: Firma, Name, E-Mail (Pflicht), Telefon, Personenzahl, Datenstandort, Nachricht, Einwilligung (Pflicht)
- Schutz vor Bots ohne Captcha: verstecktes Feld `website` (muss leer sein), Mindestdauer 3 s zwischen Seitenaufruf und Absenden (Zeitstempel als signiertes Feld), Rate-Limit am Server
- Löschung nach 180 Tagen, so steht es auch im Einwilligungstext

## 5. Texte

- Sie-Form, kurze Sätze, Aktiv. Keine Superlative ohne Beleg.
- **Keine Formulierungen von fixvox.de übernehmen** (Urheberrecht, UWG § 4 Nr. 3). Die Texte im Entwurf sind eigene.
- **Claims-Check:** Jede Aussage steht in `docs/produkt/claims.md` (Briefing 01). Was nicht getestet ist, kommt mit „geplant“ auf die Seite oder gar nicht. Das betrifft vor allem Terminalserver/Citrix, macOS, Box und 15 Minuten Diktatlänge.
- Den Entwurfs-Hinweis oben und „Beispieldaten“ im Portal-Mock vor dem Livegang entfernen bzw. behalten (Mock bleibt als Beispiel gekennzeichnet).

## 6. SEO

- Title und Description pro Seite, OG-Bild 1200×630 als statische PNG
- JSON-LD: `Organization`, `SoftwareApplication` (mit `offers` für Team und Business), `FAQPage`
- `sitemap.xml`, `robots.txt`, kanonische URLs
- Begriffe, um die Inhalte gebaut werden: „Spracheingabe Unternehmen“, „Diktiersoftware DSGVO“, „Diktieren Citrix“, „Spracherkennung Terminalserver“, „Wispr Flow Alternative Deutschland“

## 7. Akzeptanzkriterien

- [ ] Lighthouse (mobil) ≥ 95 in allen vier Kategorien
- [ ] Erste Ladung unter 250 KB, JS unter 15 KB, LCP unter 1,5 s bei 4G-Drosselung
- [ ] Keine Anfrage an Dritte beim Laden (Netzwerk-Tab: nur eigene Domain und CDN)
- [ ] Keine Cookies, kein localStorage
- [ ] Formular funktioniert mit und ohne JavaScript, Fehler werden am Feld angezeigt
- [ ] WCAG 2.2 AA: Kontraste, Tastaturbedienung, sichtbarer Fokus, `prefers-reduced-motion`
- [ ] Hell und Dunkel folgen der Systemeinstellung
- [ ] Bei 360 px Breite kein horizontales Scrollen
- [ ] Alle Aussagen in `claims.md` auf „getestet“ oder als „geplant“ markiert

## Kickoff-Prompt für Claude Code

```
Lies docs/briefings/00-README.md und docs/briefings/02-website.md.
Baue apps/website im Stack der Basis-App (Next.js 16, Tailwind v4 mit @theme,
Tokens aus Abschnitt 1) nach design/tonfeder-landingpage.html, Fotos aus design/img.
Abschnitte als Komponenten, Schriften per next/font selbst gehostet, strikte
Nonce-CSP wie in der Basis-App. Das Formular postet an
PUBLIC_LEADS_URL (env), ohne JS mit Redirect auf /danke.
Richte GitHub Actions für Build, Lighthouse-CI und Deployment ein (Ziel per Secret).
Prüfe am Ende jede Zeile der Akzeptanzkriterien und berichte im PR, welche erfüllt sind.
```

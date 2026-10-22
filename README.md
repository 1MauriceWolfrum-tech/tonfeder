# tonfeder

Smarte App zum guten Nutzen von Voice-to-Text: Taste halten, sprechen, loslassen, und der Text steht am Cursor. Verarbeitet in Deutschland oder im eigenen Firmennetz, verteilt von der IT wie jede andere Software.

> „Tonfeder“ ist ein Arbeitstitel. Stand: Planung und Design, noch kein Produktcode.

## Inhalt

| Pfad | Was |
|---|---|
| `docs/briefings/` | Neun Briefings: Produkt, Website, Architektur und API, Desktop-App, Backend, Spracherkennung, Recht, Fahrplan. Einstieg: [`00-README.md`](docs/briefings/00-README.md) |
| `design/tonfeder-landingpage.html` | Designentwurf der Landingpage (eine Datei, ohne Build) |
| `design/tonfeder-logo.html` | Logo-Übersicht mit Varianten und Tray-Zuständen |
| `design/logo/` | Logo als SVG ([Raster und Farben](design/logo/README.md)) |
| `design/img/` | Fotos von Unsplash, [Quellen und Lizenzhinweise](design/img/QUELLEN.md) |
| `design/archiv/` | Frühere Fassungen des Entwurfs |
| `tools/vorschau-server.js` | Kleiner Server für die lokale Vorschau |

## Lokal ansehen

Node 20 oder neuer, keine Abhängigkeiten:

```bash
node tools/vorschau-server.js
```

Dann http://localhost:4173 öffnen. Die Logo-Seite liegt unter http://localhost:4173/tonfeder-logo.html.

## Nächste Schritte

Siehe [`docs/briefings/08-fahrplan-kosten.md`](docs/briefings/08-fahrplan-kosten.md). Als Nächstes: lokaler Prototyp (Fork von Handy plus kleiner Whisper-Server), Briefing 04 und 06.

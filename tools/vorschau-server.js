// Kleiner statischer Server nur für die lokale Vorschau des Designs
const http = require('http'), fs = require('fs'), path = require('path');
const wurzel = path.join(__dirname, '..', 'design');
const typen = { '.html': 'text/html; charset=utf-8', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.md': 'text/plain; charset=utf-8' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/tonfeder-landingpage.html';
  const datei = path.join(wurzel, path.normalize(p));
  if (!datei.startsWith(wurzel)) { res.writeHead(403); return res.end(); }
  fs.readFile(datei, (err, inhalt) => {
    if (err) { res.writeHead(404); return res.end('nicht gefunden'); }
    res.writeHead(200, { 'Content-Type': typen[path.extname(datei)] || 'application/octet-stream' });
    res.end(inhalt);
  });
}).listen(4173, '127.0.0.1');

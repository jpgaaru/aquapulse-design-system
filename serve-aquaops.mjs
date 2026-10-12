import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8088;
const HOST = '127.0.0.1';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  let reqUrl = req.url.split('?')[0];
  const isDesignSystemRoute = reqUrl === '/' || reqUrl === '/designsystem' || reqUrl === '/designsystem/' || reqUrl === '/design-system';
  let filePath = path.join(__dirname, isDesignSystemRoute ? 'aquaops-dashboard.html' : reqUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(__dirname, 'aquaops-dashboard.html');
    }
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      let type = 'text/html; charset=utf-8';
      if (ext === '.css') type = 'text/css';
      if (ext === '.js') type = 'text/javascript';
      if (ext === '.png') type = 'image/png';
      if (ext === '.svg') type = 'image/svg+xml';

      res.writeHead(200, { 'Content-Type': type });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`AquaOps Aquaculture SaaS Dashboard live at: http://localhost:${PORT}/ and http://127.0.0.1:${PORT}/`);
});

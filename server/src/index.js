import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.PORT || 3000);

const server = http.createServer((req, res) => {

  if (req.url.startsWith('/assets/')) {
    const filePath = path.join(__dirname, req.url);

    fs.readFile(filePath, (err, data) => {
      if (err) {

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'File not found',
          path: req.url
        }));
        return;
      }

      const ext = path.extname(filePath);
      const contentType = {
        '.json': 'application/json',
        '.atlas': 'text/plain',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.skel': 'application/octet-stream'
      }[ext] || 'text/plain';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    ok: true,
    service: 'fungi-hackaton-server',
    path: req.url
  }));
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Static files served from: ${path.join(__dirname, 'assets')}`);
});
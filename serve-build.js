const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'build');
const port = process.env.PORT || 3000;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  const requested = path.normalize(path.join(root, pathname));
  const safePath = requested.startsWith(root) ? requested : root;
  const filePath = fs.existsSync(safePath) && fs.statSync(safePath).isFile()
    ? safePath
    : path.join(root, 'index.html');
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(500);
      res.end('Server error');
      return;
    }
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://localhost:${port}`);
});

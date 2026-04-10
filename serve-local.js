const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8000;
const base = process.cwd();

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/systec-redesenhado.html';
  const filePath = path.join(base, reqPath);
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) { res.statusCode = 404; res.end('Not found'); return; }
    const stream = fs.createReadStream(filePath);
    res.setHeader('Content-Type', getContentType(filePath));
    stream.pipe(res);
  });
});

function getContentType(fp) {
  const ext = path.extname(fp).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.json': return 'application/json';
    default: return 'application/octet-stream';
  }
}

server.listen(port, () => console.log(`serve-local listening on ${port}`));

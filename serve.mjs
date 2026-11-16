import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';
export const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) throw new Error('Outside public directory');
    const body = await fs.readFile(file);
    res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache'});
    res.end(body);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    res.end('Not found');
  }
});
server.on('error', error => {
  if (error.code === 'EADDRINUSE') console.error('Port ' + port + ' is already in use. Stop the other server or set PORT to a different number.');
  else console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, host, () => console.log('Local: http://localhost:' + port));

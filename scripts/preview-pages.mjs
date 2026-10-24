import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, sep, extname } from 'node:path';

const root = fileURLToPath(new URL('../dist/pages/', import.meta.url));
const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8' };

export function createPagesPreview() {
  return createServer(async (request, response) => {
    try {
      const { pathname } = new URL(request.url, 'http://localhost');
      if (!pathname.startsWith('/KUGUAN/')) { response.writeHead(404); return response.end('Not found'); }
      const relative = decodeURIComponent(pathname.slice('/KUGUAN/'.length)) || 'index.html';
      const file = resolve(root, relative);
      if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) { response.writeHead(403); return response.end('Forbidden'); }
      const content = await readFile(file);
      response.writeHead(200, { 'Content-Type': contentTypes[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(content);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 4173);
  createPagesPreview().listen(port, '127.0.0.1', () => console.log(`在线演示预览：http://localhost:${port}/KUGUAN/`));
}

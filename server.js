import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { createDatabase, ValidationError } from './lib/database.js';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };

export function createApp(database) {
  return createServer(async (request, response) => {
    const send = (status, body) => {
      response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      response.end(JSON.stringify(body));
    };
    try {
      const url = new URL(request.url, 'http://localhost');
      if (url.pathname.startsWith('/api/')) {
        if (request.method === 'GET' && url.pathname === '/api/state') return send(200, database.snapshot());
        if (request.method !== 'POST') return send(405, { error: '不支持此请求方法' });
        const origin = request.headers.origin;
        if (origin && origin !== `http://${request.headers.host}`) return send(403, { error: '请求来源不受支持' });
        if (!request.headers['content-type']?.startsWith('application/json')) return send(415, { error: '请使用 JSON 提交数据' });
        let body = '';
        for await (const chunk of request) {
          body += chunk;
          if (body.length > 65536) return send(413, { error: '请求内容过大' });
        }
        let input;
        try { input = JSON.parse(body); } catch { return send(400, { error: '数据格式无效' }); }
        if (!input || typeof input !== 'object' || Array.isArray(input)) return send(400, { error: '数据格式无效' });
        const handlers = { '/api/items': database.addItem, '/api/warehouses': database.addWarehouse, '/api/admins': database.addAdmin, '/api/operations': database.addOperation };
        const handler = handlers[url.pathname];
        if (!handler) return send(404, { error: '接口不存在' });
        return send(201, handler(input));
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') return send(405, { error: '不支持此请求方法' });
      const pathname = decodeURIComponent(url.pathname);
      const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) return send(403, { error: '禁止访问' });
      try {
        const content = await readFile(path);
        response.writeHead(200, {
          'Content-Type': types[extname(path)] ?? 'application/octet-stream',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff',
          'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
        });
        response.end(request.method === 'HEAD' ? undefined : content);
      } catch (error) {
        if (error.code === 'ENOENT' || error.code === 'EISDIR') return send(404, { error: '页面不存在' });
        throw error;
      }
    } catch (error) {
      if (error instanceof ValidationError) return send(400, { error: error.message });
      console.error(error);
      send(500, { error: '服务暂时出错，请稍后再试' });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 3000);
  const database = createDatabase(process.env.DATABASE_PATH || fileURLToPath(new URL('./data/warehouse.sqlite', import.meta.url)));
  const server = createApp(database);
  server.listen(port, '127.0.0.1', () => console.log(`库管已启动：http://localhost:${port}`));
  const shutdown = () => server.close(() => { database.close(); process.exit(0); });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createDatabase } from '../lib/database.js';

const destination = fileURLToPath(new URL('../dist/pages/', import.meta.url));
mkdirSync(destination, { recursive: true });
cpSync(new URL('../public/', import.meta.url), destination, { recursive: true });
const entry = new URL('../dist/pages/index.html', import.meta.url);
const html = readFileSync(entry, 'utf8').replace('<head>', '<head>\n    <meta name="kuguan-mode" content="demo">');
writeFileSync(entry, html, 'utf8');
const database = createDatabase(':memory:');
try {
  writeFileSync(new URL('../dist/pages/demo-seed.json', import.meta.url), JSON.stringify(database.snapshot()), 'utf8');
} finally { database.close(); }
writeFileSync(new URL('../dist/pages/.nojekyll', import.meta.url), '');
console.log(`GitHub Pages 演示版已生成：${destination}`);

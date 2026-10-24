import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const runGit = (args) => {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || 'Git command failed');
  return result.stdout.trim();
};

if (runGit(['status', '--porcelain'])) {
  throw new Error('请先提交项目改动，再打包已提交的版本。');
}
const { version } = JSON.parse(runGit(['show', 'HEAD:package.json']));
if (!/^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(version)) throw new Error('版本号格式无效');
const name = `KUGUAN-v${version}`;
const output = join(root, 'dist');
mkdirSync(output, { recursive: true });
const filename = `${name}.zip`;
const archive = join(output, filename);
runGit(['archive', '--format=zip', `--prefix=${name}/`, `--output=${archive}`, 'HEAD']);
const checksum = createHash('sha256').update(readFileSync(archive)).digest('hex');
writeFileSync(join(output, 'SHA256SUMS.txt'), `${checksum}  ${filename}\n`, 'utf8');
console.log(`打包完成：${archive}`);
console.log(`提交：${runGit(['rev-parse', 'HEAD'])}`);
console.log(`SHA-256：${checksum}`);

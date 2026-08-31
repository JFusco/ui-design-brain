import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const packed = execFileSync('pnpm', ['pack', '--pack-destination', root], { cwd: root, encoding: 'utf8' }).trim().split('\n').at(-1);
const sandbox = await mkdtemp(join(tmpdir(), 'ui-design-brain-packed-'));

try {
  await writeFile(join(sandbox, 'package.json'), JSON.stringify({ private: true, dependencies: { '@verndale/ui-design-brain': `file:${join(root, packed)}` } }));
  execFileSync('pnpm', ['install', '--frozen-lockfile=false'], { cwd: sandbox, stdio: 'inherit' });
  const config = join(sandbox, 'ui-design-brain.config.json');
  await writeFile(config, `${JSON.stringify({
    schemaVersion: 1,
    packageName: '@verndale/ui-design-brain',
    packageVersion: pkg.version,
    catalogAuthorityVersion: '1.15.1',
    profile: 'agent-skill',
    target: 'generated/ui-design-brain',
  }, null, 2)}\n`);
  const executable = join(sandbox, 'node_modules', '.bin', 'ui-design-brain');
  execFileSync(executable, ['sync', '--config', config], { cwd: sandbox, stdio: 'inherit' });
  execFileSync(executable, ['sync', '--if-needed', '--config', config], { cwd: sandbox, stdio: 'inherit' });
  execFileSync(executable, ['check', '--config', config], { cwd: sandbox, stdio: 'inherit' });
} finally {
  await rm(sandbox, { recursive: true, force: true });
  await rm(join(root, packed), { force: true });
}

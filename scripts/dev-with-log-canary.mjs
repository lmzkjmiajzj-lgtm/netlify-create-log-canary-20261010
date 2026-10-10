import { spawn } from 'node:child_process';

const harmlessMarker = '<img src="data:," alt="NF_CREATE_LOG_XSS_CANARY_20261010" onerror="document.documentElement.dataset.nfLogXss=\'1\';this.replaceWith(\'NF_LOG_XSS_OK\')">';
const emit = () => console.log(harmlessMarker);

emit();
setTimeout(emit, 5_000);
setTimeout(emit, 15_000);

const child = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'dev', ...process.argv.slice(2)],
  { stdio: 'inherit' }
);

child.on('error', (error) => {
  console.error('preview server failed to start:', error.message);
  process.exit(1);
});
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});

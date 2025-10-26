import fs from 'node:fs';
import path from 'node:path';

// Minimal .env loader for dev to support CLAUDE_API_KEY without adding deps.
export function loadEnv() {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '.env')
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    try {
      const text = fs.readFileSync(p, 'utf8');
      for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const valRaw = trimmed.slice(eq + 1).trim();
        const val = valRaw.replace(/^['"]|['"]$/g, '');
        if (!(key in process.env)) {
          process.env[key] = val;
        }
      }
      // Stop at the first .env we load successfully
      break;
    } catch {
      // Ignore read/parse errors; fall through
    }
  }
}


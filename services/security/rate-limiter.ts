import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

declare global {
  var __DECIDO_RATE_LIMIT_DB__: Database.Database | undefined;
}

if (!global.__DECIDO_RATE_LIMIT_DB__) {
  global.__DECIDO_RATE_LIMIT_DB__ = new Database(path.join(DATA_DIR, 'rate-limit.db'));
  global.__DECIDO_RATE_LIMIT_DB__.exec(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      ip TEXT PRIMARY KEY,
      last_request_at INTEGER NOT NULL,
      burst_count INTEGER DEFAULT 0
    )
  `);
}

const db = global.__DECIDO_RATE_LIMIT_DB__;

// COOLDOWN: Tempo mínimo entre requisições (2 segundos para evitar spam)
const BURST_COOLDOWN_MS = 2000;

export function checkIpLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const row = db.prepare('SELECT last_request_at FROM rate_limits WHERE ip = ?').get(ip) as { last_request_at: number } | undefined;

  if (row) {
    const diff = now - row.last_request_at;
    if (diff < BURST_COOLDOWN_MS) {
      return { allowed: false, message: 'Muitas requisições em curto tempo. Aguarde alguns segundos.' };
    }
  }

  return { allowed: true };
}

export function incrementIpCount(ip: string): void {
  const now = Date.now();
  db.prepare(`
    INSERT INTO rate_limits (ip, last_request_at, burst_count)
    VALUES (?, ?, 1)
    ON CONFLICT(ip) DO UPDATE SET 
      last_request_at = ?,
      burst_count = burst_count + 1
  `).run(ip, now, now);
}

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

declare global {
  var __DECIDO_USAGE_DB__: Database.Database | undefined;
}

if (!global.__DECIDO_USAGE_DB__) {
  global.__DECIDO_USAGE_DB__ = new Database(path.join(DATA_DIR, 'usage.db'));
  global.__DECIDO_USAGE_DB__.exec(`
    CREATE TABLE IF NOT EXISTS daily_usage (
      identifier TEXT NOT NULL, -- email or IP
      date TEXT NOT NULL,       -- YYYY-MM-DD
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (identifier, date)
    )
  `);
}

const db = global.__DECIDO_USAGE_DB__;

export function getDailyUsage(identifier: string, date: string): number {
  const row = db.prepare('SELECT count FROM daily_usage WHERE identifier = ? AND date = ?').get(identifier, date) as { count: number } | undefined;
  return row?.count ?? 0;
}

export function incrementDailyUsage(identifier: string, date: string) {
  db.prepare(`
    INSERT INTO daily_usage (identifier, date, count)
    VALUES (?, ?, 1)
    ON CONFLICT(identifier, date) DO UPDATE SET count = count + 1
  `).run(identifier, date);
}

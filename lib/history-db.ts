import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Decision } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

declare global {
  var __DECIDO_HISTORY_DB__: Database.Database | undefined;
}

if (!global.__DECIDO_HISTORY_DB__) {
  global.__DECIDO_HISTORY_DB__ = new Database(path.join(DATA_DIR, 'history.db'));
  global.__DECIDO_HISTORY_DB__.exec(`
    CREATE TABLE IF NOT EXISTS decisions (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      input TEXT NOT NULL,
      output TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    )
  `);
  // Index on user_email and timestamp for fast retrieval of latest history
  global.__DECIDO_HISTORY_DB__.exec(`
    CREATE INDEX IF NOT EXISTS idx_decisions_user_time ON decisions(user_email, timestamp DESC)
  `);
}

const db = global.__DECIDO_HISTORY_DB__;

export function saveUserDecision(userEmail: string, decision: Decision) {
  db.prepare(`
    INSERT INTO decisions (id, user_email, input, output, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    decision.id,
    userEmail,
    decision.input,
    JSON.stringify(decision.output),
    decision.timestamp
  );
}

export function getUserDecisions(userEmail: string, limit: number = 20): Decision[] {
  const rows = db.prepare(`
    SELECT id, input, output, timestamp 
    FROM decisions 
    WHERE user_email = ? 
    ORDER BY timestamp DESC 
    LIMIT ?
  `).all(userEmail, limit) as { id: string, input: string, output: string, timestamp: number }[];

  return rows.map(row => ({
    id: row.id,
    input: row.input,
    output: JSON.parse(row.output),
    timestamp: row.timestamp
  }));
}

export function deleteUserHistory(userEmail: string) {
  db.prepare('DELETE FROM decisions WHERE user_email = ?').run(userEmail);
}

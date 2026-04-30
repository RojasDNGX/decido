import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

declare global {
  var __DECIDO_USERS_DB__: Database.Database | undefined;
}

if (!global.__DECIDO_USERS_DB__) {
  global.__DECIDO_USERS_DB__ = new Database(path.join(DATA_DIR, 'users.db'));
  global.__DECIDO_USERS_DB__.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      image TEXT,
      plan TEXT NOT NULL DEFAULT 'free',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

const db = global.__DECIDO_USERS_DB__;

interface UserRow {
  id: number;
  email: string;
  name: string | null;
  image: string | null;
  plan: 'free' | 'pro';
  created_at: string;
}

export function getOrCreateUser(email: string, name?: string, image?: string): UserRow {
  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
  if (existing) return existing;

  db.prepare('INSERT INTO users (email, name, image) VALUES (?, ?, ?)').run(
    email,
    name ?? null,
    image ?? null
  );
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow;
}

export function getUserPlan(email: string): 'free' | 'pro' {
  const row = db.prepare('SELECT plan FROM users WHERE email = ?').get(email) as Pick<UserRow, 'plan'> | undefined;
  return row?.plan ?? 'free';
}

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

declare global {
  var __DECIDO_USERS_DB__: Database.Database | undefined;
}

function getDb(): Database.Database {
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
  return global.__DECIDO_USERS_DB__;
}

interface UserRow {
  id: number;
  email: string;
  name: string | null;
  image: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
}

export function getOrCreateUser(email: string, name?: string, image?: string): UserRow {
  const PRO_WHITELIST = ["thiago.rojas@dngx.com.br"];
  const db = getDb();
  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
  
  if (existing) {
    if (PRO_WHITELIST.includes(email) && existing.plan !== 'pro') {
      db.prepare("UPDATE users SET plan = 'pro' WHERE email = ?").run(email);
      return { ...existing, plan: 'pro' };
    }
    return existing;
  }

  const initialPlan = PRO_WHITELIST.includes(email) ? 'pro' : 'free';
  db.prepare('INSERT INTO users (email, name, image, plan) VALUES (?, ?, ?, ?)').run(
    email,
    name ?? null,
    image ?? null,
    initialPlan
  );
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow;
}

export function getUserPlan(email: string): 'free' | 'pro' | 'enterprise' {
  const PRO_WHITELIST = ["thiago.rojas@dngx.com.br"];
  if (PRO_WHITELIST.includes(email)) return 'pro';

  const row = getDb().prepare('SELECT plan FROM users WHERE email = ?').get(email) as Pick<UserRow, 'plan'> | undefined;
  return row?.plan ?? 'free';
}

export function setUserPlan(email: string, plan: 'free' | 'pro' | 'enterprise') {
  getDb().prepare(`UPDATE users SET plan = ? WHERE email = ?`).run(plan, email);
}

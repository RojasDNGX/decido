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
        role TEXT NOT NULL DEFAULT 'user',
        plan TEXT NOT NULL DEFAULT 'free',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
  // Garantir migração mesmo se o banco já estiver inicializado no global
  try {
    const tableInfo = global.__DECIDO_USERS_DB__.prepare("PRAGMA table_info(users)").all() as any[];
    
    if (!tableInfo.some(col => col.name === 'role')) {
      console.log("[DB] Migrating: Adding 'role' column");
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'");
    }
    
    if (!tableInfo.some(col => col.name === 'password')) {
      console.log("[DB] Migrating: Adding 'password' column");
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN password TEXT");
    }
    
    if (!tableInfo.some(col => col.name === 'pro_tasted')) {
      console.log("[DB] Migrating: Adding 'pro_tasted' column");
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN pro_tasted INTEGER NOT NULL DEFAULT 0");
    }
    if (!tableInfo.some(col => col.name === 'phone')) {
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN phone TEXT");
    }
    if (!tableInfo.some(col => col.name === 'profession')) {
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN profession TEXT");
    }
    if (!tableInfo.some(col => col.name === 'company')) {
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN company TEXT");
    }
    if (!tableInfo.some(col => col.name === 'stripe_customer_id')) {
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN stripe_customer_id TEXT UNIQUE");
    }
    if (!tableInfo.some(col => col.name === 'stripe_subscription_id')) {
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT UNIQUE");
    }
    if (!tableInfo.some(col => col.name === 'stripe_price_id')) {
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN stripe_price_id TEXT");
    }
    if (!tableInfo.some(col => col.name === 'stripe_current_period_end')) {
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN stripe_current_period_end DATETIME");
    }
    if (!tableInfo.some(col => col.name === 'marketing_opt_in')) {
      global.__DECIDO_USERS_DB__.exec("ALTER TABLE users ADD COLUMN marketing_opt_in INTEGER NOT NULL DEFAULT 0");
    }

    // Tabela de tokens para reset de senha
    global.__DECIDO_USERS_DB__.exec(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash TEXT UNIQUE NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.error("[DB] Migration error:", e);
  }

  return global.__DECIDO_USERS_DB__;
}

export interface UserRow {
  id: number;
  email: string;
  name: string | null;
  password?: string | null;
  image: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  role: 'user' | 'admin';
  pro_tasted: number;
  phone?: string | null;
  profession?: string | null;
  company?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
  stripe_current_period_end?: string | null;
  marketing_opt_in: number;
  created_at: string;
}

export function getOrCreateUser(email: string, name?: string, image?: string): UserRow {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
  
  if (existing) {
    return existing;
  }

  db.prepare('INSERT INTO users (email, name, image, role, plan) VALUES (?, ?, ?, ?, ?)').run(
    email,
    name ?? null,
    image ?? null,
    'user',
    'free'
  );
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow;
}

export function createUserWithPassword(email: string, passwordHash: string, name?: string, optIn: number = 0): UserRow {
  const db = getDb();
  db.prepare('INSERT INTO users (email, password, name, role, plan, marketing_opt_in) VALUES (?, ?, ?, ?, ?, ?)').run(
    email,
    passwordHash,
    name ?? null,
    'user',
    'free',
    optIn
  );
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow;
}

export function getUserByEmail(email: string): UserRow | undefined {
  return getDb().prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
}

export function getUserPlan(email: string): 'free' | 'pro' | 'enterprise' {

  const row = getDb().prepare('SELECT plan FROM users WHERE email = ?').get(email) as Pick<UserRow, 'plan'> | undefined;
  return row?.plan ?? 'free';
}

export function getUserRole(email: string): 'user' | 'admin' | 'guest' {
  const row = getDb().prepare('SELECT role FROM users WHERE email = ?').get(email) as Pick<UserRow, 'role'> | undefined;
  return row?.role ?? 'guest';
}

export function setUserPlan(email: string, plan: 'free' | 'pro' | 'enterprise') {
  getDb().prepare(`UPDATE users SET plan = ? WHERE email = ?`).run(plan, email);
}

export function setUserRole(email: string, role: 'user' | 'admin') {
  getDb().prepare(`UPDATE users SET role = ? WHERE email = ?`).run(role, email);
}

export function hasUsedProTasting(email: string): boolean {
  const row = getDb().prepare('SELECT pro_tasted FROM users WHERE email = ?').get(email) as { pro_tasted: number } | undefined;
  return row?.pro_tasted === 1;
}

export function markProTastingUsed(email: string): void {
  getDb().prepare('UPDATE users SET pro_tasted = 1 WHERE email = ?').run(email);
}

export function createPasswordResetToken(userId: number, tokenHash: string, expiresAt: number) {
  const db = getDb();
  // Invalidar tokens antigos desse usuário
  db.prepare('DELETE FROM password_resets WHERE user_id = ?').run(userId);
  db.prepare('INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)').run(userId, tokenHash, expiresAt);
}

export function getUserIdByResetToken(tokenHash: string): { user_id: number, expires_at: number } | undefined {
  return getDb().prepare('SELECT user_id, expires_at FROM password_resets WHERE token_hash = ?').get(tokenHash) as any;
}

export function deletePasswordResetToken(tokenHash: string) {
  getDb().prepare('DELETE FROM password_resets WHERE token_hash = ?').run(tokenHash);
}

export function updateUserPassword(userId: number, newPasswordHash: string) {
  getDb().prepare('UPDATE users SET password = ? WHERE id = ?').run(newPasswordHash, userId);
}

export function updateUserProfile(userId: number, data: { name: string, phone: string, profession: string, company: string }) {
  getDb().prepare(`
    UPDATE users 
    SET name = ?, phone = ?, profession = ?, company = ?
    WHERE id = ?
  `).run(data.name, data.phone, data.profession, data.company, userId);
}

export function deleteAccountData(email: string, userId: number) {
  const db = getDb();
  
  // Como usamos tabelas/bancos diferentes, excluímos da base de usuários
  db.prepare('DELETE FROM password_resets WHERE user_id = ?').run(userId);
  db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  
  // Nota: Para excluir de history.db e usage.db precisaremos chamar suas funções correspondentes 
  // caso essa função seja chamada em uma rota principal que importe as 3 bases de dados.
}


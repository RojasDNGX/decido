/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'data', 'users.db');
console.log('Migrando banco em:', dbPath);

if (!fs.existsSync(dbPath)) {
  console.error('Banco de dados não encontrado!');
  process.exit(1);
}

const db = new Database(dbPath);

const columns = [
  { name: 'stripe_customer_id', type: 'TEXT' },
  { name: 'stripe_subscription_id', type: 'TEXT' },
  { name: 'stripe_subscription_status', type: 'TEXT' },
  { name: 'stripe_price_id', type: 'TEXT' },
  { name: 'stripe_current_period_end', type: 'DATETIME' },
  { name: 'stripe_cancel_at_period_end', type: 'INTEGER DEFAULT 0' }
];

db.exec(`
  CREATE TABLE IF NOT EXISTS billing_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_id TEXT UNIQUE,
    event_type TEXT,
    payload TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const tableInfo = db.prepare("PRAGMA table_info(users)").all();

columns.forEach(col => {
  if (!tableInfo.some(c => c.name === col.name)) {
    console.log(`Adicionando coluna: ${col.name}`);
    try {
      db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
    } catch (e) {
      console.error(`Erro ao adicionar ${col.name}:`, e.message);
    }
  } else {
    console.log(`Coluna já existe: ${col.name}`);
  }
});

console.log('Migração concluída com sucesso!');
db.close();

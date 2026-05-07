const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'usage.db');
try {
  const db = new Database(dbPath);
  const rows = db.prepare('SELECT * FROM daily_usage').all();
  console.log('Current usage table:');
  console.table(rows);
  db.close();
} catch (err) {
  console.error('Error reading database:', err.message);
}

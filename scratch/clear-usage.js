const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'usage.db');
try {
  const db = new Database(dbPath);
  db.prepare('DELETE FROM daily_usage').run();
  console.log('Usage database cleared successfully.');
  db.close();
} catch (err) {
  console.error('Error clearing database:', err.message);
}

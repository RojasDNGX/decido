const Database = require('better-sqlite3');
const path = require('path');

try {
  const db = new Database(path.join(process.cwd(), 'data', 'users.db'));
  const user = db.prepare('SELECT * FROM users LIMIT 1').get();
  console.log('Database check successful. First user:', user);
} catch (error) {
  console.error('Database check failed:', error);
}

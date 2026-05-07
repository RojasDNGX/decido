const { db } = require('./lib/usage-db');

function checkUser(email) {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  console.log('User:', user);
}

const email = process.argv[2] || 'test@example.com';
checkUser(email);

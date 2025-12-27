require('dotenv').config();
const pool = require('../src/config/db');

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('DB connected:', rows);
    process.exit(0);
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
})();

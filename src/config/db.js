const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,              // ✅ MySQL port (NOT 4000)
  user: 'root',
  password: 'root',
  database: 'student_survey',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

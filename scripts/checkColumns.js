require('dotenv').config();
const pool = require('../src/config/db');

(async () => {
  try {
    const db = process.env.MYSQL_DATABASE || 'student_survey';
    const [rows] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'survey_responses' ORDER BY ORDINAL_POSITION",
      [db]
    );
    console.log('Columns in survey_responses:');
    rows.forEach(r => console.log('-', r.COLUMN_NAME));
    process.exit(0);
  } catch (err) {
    console.error('Error querying columns:', err.message);
    process.exit(1);
  }
})();

const { Pool } = require('pg');

const pool = new Pool({
  
   connectionString: process.env.DATABASE_URL || 
    'postgresql://postgres:root@localhost:5432/student_survey',
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

pool.on('connect', () => {
  console.log('PostgreSQL connected successfully');
});

module.exports = pool;

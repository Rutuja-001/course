const { Pool } = require('pg');

const pool = new Pool({
  
   connectionString: process.env.DATABASE_URL || 
    'postgresql://recommadtionapp_user:QNnJ2xhTPPdr8Prz80DuY0wRurlyrwz6@dpg-d5937rmr433s73fj1dj0-a.virginia-postgres.render.com/recommadtionapp?sslmode=require',
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false, require: true }
    : false
});

pool.on('connect', () => {
  console.log('PostgreSQL connected successfully');
});

module.exports = pool;

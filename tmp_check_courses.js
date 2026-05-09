const { Pool } = require('pg');
require('dotenv').config({ path: 'c:/Users/HP/Desktop/studentsurvey/.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkCourses() {
    try {
        const res = await pool.query('SELECT id, title FROM courses LIMIT 20');
        console.log("AVAILABLE COURSES IN DB:");
        console.table(res.rows);
        process.exit(0);
    } catch (err) {
        console.error("ERROR CHECKING COURSES:", err.message);
        process.exit(1);
    }
}

checkCourses();

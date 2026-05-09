const pool = require('c:/Users/HP/Desktop/studentsurvey/src/config/db.js');

async function test() {
    try {
        const res1 = await pool.query('SELECT id, name FROM survey_responses ORDER BY created_at DESC LIMIT 5');
        console.log("SURVEYS:", res1.rows);

        const res2 = await pool.query('SELECT survey_response_id, title FROM recommendation_courses LIMIT 5');
        console.log("RECOMMENDATIONS:", res2.rows);

        const res3 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'recommendation_courses';
    `);
        console.log("RECOMMENDATION_COURSES SCHEMA:", res3.rows.find(c => c.column_name === 'survey_response_id'));

        const res4 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'survey_responses';
    `);
        console.log("SURVEY_RESPONSES SCHEMA:", res4.rows.find(c => c.column_name === 'id'));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();

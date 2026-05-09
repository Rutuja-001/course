const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://survey_n5dd_user:k9NS8tflghBknSqN9b9nd8VpNWL7uBvi@dpg-d6l517h5pdvs73f2a0k0-a.oregon-postgres.render.com/survey_n5dd?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        const surveyQuery = `
      WITH latest_survey AS (
        SELECT DISTINCT ON (name)
            id, name, created_at
        FROM survey_responses
        ORDER BY name, created_at DESC
      )
      SELECT
        ls.id AS survey_id,
        ls.name,
        COALESCE(
          STRING_AGG(DISTINCT rc.title, ', '),
          ''
        ) AS recommended_courses
      FROM latest_survey ls
      LEFT JOIN recommendation_courses rc
        ON rc.survey_response_id = ls.id
      GROUP BY ls.id, ls.name, ls.created_at
      ORDER BY ls.created_at DESC
      LIMIT 10;
    `;
        const res1 = await pool.query(surveyQuery);
        console.log("EXCEL EXPORT PREVIEW:");
        console.table(res1.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();

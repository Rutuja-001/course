const pool = require('../config/db');
const { exportToExcelBuffer } = require('../utils/exportExcel');

console.log('surveyController exportToExcelBuffer:', exportToExcelBuffer);

/* =========================
   POSTGRES INSERT QUERY
========================= */
const insertQuery = `
INSERT INTO survey_responses (
  name, age, gender, institution, degree, year_of_study, semester, percentage,
  core_subjects, programming_languages, worked_on_projects, technical_level,
  interests, career_goal, motivation,
  weekly_hours, course_format, course_length, willing_to_pay, learning_challenges,
  learning_style, tools_used, courses_completed, learning_mode, certifications
) VALUES (
  $1,$2,$3,$4,$5,$6,$7,$8,
  $9,$10,$11,$12,
  $13,$14,$15,
  $16,$17,$18,$19,$20,
  $21,$22,$23,$24,$25
)
RETURNING id;
`;

/* =========================
   CREATE RESPONSE
========================= */
exports.createResponse = async (req, res) => {
  try {
    const body = req.body || {};

    // Take everything as string
    const params = [
      body.name ?? '',
      body.age ?? '',
      body.gender ?? '',
      body.institution ?? '',
      body.degree ?? '',
      body.year_of_study ?? '',
      body.semester ?? '',
      body.percentage ?? '',

      body.core_subjects ? JSON.stringify(body.core_subjects) : '',
      body.programming_languages ? JSON.stringify(body.programming_languages) : '',

      body.worked_on_projects !== undefined ? String(body.worked_on_projects) : '',

      body.technical_level ?? '',

      body.interests ? JSON.stringify(body.interests) : '',
      body.career_goal ?? '',
      body.motivation ?? '',

      body.weekly_hours ?? '',
      body.course_format ?? '',
      body.course_length ?? '',
      body.willing_to_pay !== undefined ? String(body.willing_to_pay) : '',

      body.learning_challenges ? JSON.stringify(body.learning_challenges) : '',
      body.learning_style ? JSON.stringify(body.learning_style) : '',
      body.tools_used ? JSON.stringify(body.tools_used) : '',

      body.courses_completed ? JSON.stringify(body.courses_completed) : '',
      body.learning_mode ?? '',
      body.certifications ? JSON.stringify(body.certifications) : ''
    ];

    console.log('Params length:', params.length); // must be 25

    const result = await pool.query(insertQuery, params);

    res.status(201).json({
      success: true,
      message: 'Response saved successfully',
      id: result.rows[0].id
    });

  } catch (err) {
    console.error('CREATE RESPONSE ERROR:', err);
    res.status(500).json({ error: 'Failed to save response' });
  }
};

/* =========================
   GET RESPONSES
========================= */
exports.getResponses = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM survey_responses ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET RESPONSES ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
};

/* =========================
   EXPORT RESPONSES TO EXCEL
========================= */
exports.exportResponses = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM survey_responses ORDER BY created_at DESC'
    );

    const buffer = await exportToExcelBuffer(rows);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="survey_responses.xlsx"'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.send(buffer);

  } catch (err) {
    console.error('EXPORT ERROR:', err);
    res.status(500).json({ error: 'Failed to export responses' });
  }
};

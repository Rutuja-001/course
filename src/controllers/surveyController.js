const pool = require('../config/db');
const { exportToExcelBuffer } = require('../utils/exportExcel');
console.log('surveyController exportToExcelBuffer:', exportToExcelBuffer)
//const { exportToExcelBuffer } = require('../utils/exportExcel');

const insertQuery = `INSERT INTO survey_responses (
  name, age, gender, institution, degree, year_of_study, semester, percentage,
  core_subjects, programming_languages, worked_on_projects, technical_level,
  interests, career_goal, motivation,
  weekly_hours, course_format, course_length, willing_to_pay, learning_challenges,
  learning_style, tools_used, courses_completed, learning_mode, certifications
) VALUES (
  ?,?,?,?,?,?,?,?,
  ?,?,?,?,?,?,
  ?,?,?,?,?,?,
  ?,?,?,?,?
)`;

/* =========================
   CREATE RESPONSE (FIXED)
========================= */
exports.createResponse = async (req, res) => {
  try {
    const body = req.body || {};

    const params = [
      body.name || null,
      body.age || null,
      body.gender || null,
      body.institution || null,
      body.degree || null,
      body.year_of_study || null,
      body.semester || null,
      body.percentage || null,

      body.core_subjects ? JSON.stringify(body.core_subjects) : null,
      body.programming_languages ? JSON.stringify(body.programming_languages) : null,

      body.worked_on_projects || null,
      body.technical_level || null,

      body.interests ? JSON.stringify(body.interests) : null,
      body.career_goal || null,
      body.motivation || null,

      body.weekly_hours || null,
      body.course_format || null,
      body.course_length || null,
      body.willing_to_pay || null,

      body.learning_challenges ? JSON.stringify(body.learning_challenges) : null,
      body.learning_style ? JSON.stringify(body.learning_style) : null,
      body.tools_used ? JSON.stringify(body.tools_used) : null,

      body.courses_completed ? JSON.stringify(body.courses_completed) : null,
      body.learning_mode ? JSON.stringify(body.learning_mode) : null,
      body.certifications ? JSON.stringify(body.certifications) : null
    ];

    // Debug safety
    console.log('Params length:', params.length);

    const [result] = await pool.query(insertQuery, params);
    res.status(201).json({ id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save response' });
  }
};

/* =========================
   GET RESPONSES
========================= */
exports.getResponses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM survey_responses ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
};

/* =========================
   EXPORT RESPONSES
========================= */
exports.exportResponses = async (req, res) => {
  try {
    const [rows] = await pool.query(
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
    console.error(err);
    res.status(500).json({ error: 'Failed to export responses' });
  }
};

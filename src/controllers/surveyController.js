const pool = require('../config/db');

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
   GET ALL RESPONSES
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
   GET SINGLE RESPONSE BY ID
========================= */
exports.getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM survey_responses WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('GET SURVEY BY ID ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
};

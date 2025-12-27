const pool = require('../config/db');
//const { exportToExcelBuffer } = require('../utils/exportExcel');
const { exportToExcelBuffer } = require('../utils/exportExcel');
console.log('recommendationController exportToExcelBuffer:', exportToExcelBuffer);
/* =========================
   INSERT QUERY
========================= */
const insertRecommendationQuery = `
INSERT INTO recommendation_courses (
  survey_response_id,
  title,
  description,
  instructor,
  duration,
  level,
  rating,
  students,
  price,
  tags,
  image
) VALUES (
  ?,?,?,?,?,?,?,?,?,?,?
)
`;

/* =========================
   CREATE RECOMMENDATION COURSE
========================= */
exports.createCourse = async (req, res) => {
  try {
    const body = req.body || {};

    const params = [
      body.survey_response_id || null,   // 🔑 FOREIGN KEY
      body.title || null,
      body.description || null,
      body.instructor || null,
      body.duration || null,
      body.level || null,
      body.rating || null,
      body.students || null,
      body.price || null,
      body.tags ? JSON.stringify(body.tags) : null,
      body.image || null
    ];

    console.log('Params length:', params.length);

    const [result] = await pool.query(insertRecommendationQuery, params);
    res.status(201).json({ id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save recommendation course' });
  }
};

/* =========================
   GET RECOMMENDATION COURSES
========================= */
exports.getCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM recommendation_courses ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recommendation courses' });
  }
};

/* =========================
   TEST ENDPOINT
========================= */
exports.test = async (req, res) => {
  res.json({ message: "test successful" });
};

/* =========================
   EXPORT RECOMMENDATION COURSES
========================= */
exports.exportCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM recommendation_courses ORDER BY created_at DESC'
    );

    const buffer = await exportToExcelBuffer(rows);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="recommendation_courses.xlsx"'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export recommendation courses' });
  }
};

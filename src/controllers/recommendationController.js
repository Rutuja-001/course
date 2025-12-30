const pool = require('../config/db');

// ============================
// CREATE Recommendation
// ============================
exports.createRecommendation = async (req, res) => {
  const {
    survey_response_id,
    title,
    description,
    instructor,
    duration,
    level,
    rating,
    students,
    price,
    image
  } = req.body;

  // Basic validation
  if (!survey_response_id || !title) {
    return res.status(400).json({
      error: 'survey_response_id and title are required'
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO recommendation_courses
      (
        survey_response_id,
        title,
        description,
        instructor,
        duration,
        level,
        rating,
        students,
        price,
        image
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        survey_response_id,
        title,
        description,
        instructor,
        duration,
        level,
        rating,
        students,
        price,
        image
      ]
    );

    res.status(201).json({
      message: 'Recommendation course created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('CREATE RECOMMENDATION ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET ALL Recommendations
// ============================
exports.getRecommendations = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recommendation_courses ORDER BY created_at DESC'
    );

    res.status(200).json({
      message: 'Recommendations fetched successfully',
      data: result.rows
    });

  } catch (error) {
    console.error('GET RECOMMENDATIONS ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET Recommendation BY ID
// ============================
exports.getRecommendationById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM recommendation_courses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Recommendation not found'
      });
    }

    res.status(200).json({
      message: 'Recommendation fetched successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('GET RECOMMENDATION BY ID ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

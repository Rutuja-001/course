const pool = require('../config/db'); // PostgreSQL connection
const { exportSurveyWithCoursesExcel } = require('../utils/exportExcel');

exports.downloadSurveyWithCourses = async (req, res) => {
  try {
    const surveyQuery = `
      SELECT 
        sr.id AS survey_id,
        sr.name,
        sr.age,
        sr.gender,
        sr.institution,
        sr.degree,
        sr.year_of_study,
        sr.semester,
        sr.percentage,
        sr.core_subjects,
        sr.programming_languages,
        sr.worked_on_projects,
        sr.technical_level,
        sr.interests,
        sr.career_goal,
        sr.motivation,
        sr.weekly_hours,
        sr.course_format,
        sr.course_length,
        sr.willing_to_pay,
        sr.learning_challenges,
        sr.learning_style,
        sr.tools_used,
        sr.courses_completed,
        sr.learning_mode,
        sr.certifications,
        rc.title AS course_title,
        rc.description AS course_description,
        rc.instructor,
        rc.duration,
        rc.level,
        rc.rating,
        rc.students,
        rc.price
      FROM survey_responses sr
      LEFT JOIN recommendation_courses rc
      ON sr.id = rc.survey_response_id
    `;

    const { rows } = await pool.query(surveyQuery);

    const buffer = await exportSurveyWithCoursesExcel(rows);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=survey_with_courses.xlsx'
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to export Excel');
  }
};

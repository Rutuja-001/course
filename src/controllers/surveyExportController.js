const pool = require('../config/db');
const { exportSurveyWithCoursesExcel } = require('../utils/exportExcel');

exports.downloadSurveyWithCourses = async (req, res) => {
  try {
    const surveyQuery = `
      WITH latest_survey AS (
        SELECT DISTINCT ON (name)
            id,
            name,
            age,
            gender,
            institution,
            degree,
            year_of_study,
            semester,
            percentage,
            core_subjects,
            programming_languages,
            worked_on_projects,
            technical_level,
            interests,
            career_goal,
            motivation,
            weekly_hours,
            course_format,
            course_length,
            willing_to_pay,
            learning_challenges,
            learning_style,
            tools_used,
            courses_completed,
            learning_mode,
            certifications,
            created_at
        FROM survey_responses
        ORDER BY name, created_at DESC
      )
      SELECT
        ROW_NUMBER() OVER (ORDER BY ls.created_at ASC) AS survey_no,  -- ✅ SERIAL NO
        ls.id AS survey_id,                                          -- ✅ REAL ID
        ls.name,
        ls.age,
        ls.gender,
        ls.institution,
        ls.degree,
        ls.year_of_study,
        ls.semester,
        ls.percentage,
        ls.core_subjects,
        ls.programming_languages,
        ls.worked_on_projects,
        ls.technical_level,
        ls.interests,
        ls.career_goal,
        ls.motivation,
        ls.weekly_hours,
        ls.course_format,
        ls.course_length,
        ls.willing_to_pay,
        ls.learning_challenges,
        ls.learning_style,
        ls.tools_used,
        ls.courses_completed,
        ls.learning_mode,
        ls.certifications,
        ls.created_at,

        -- ✅ CLEAN EXCEL FRIENDLY COURSES
        COALESCE(
          STRING_AGG(DISTINCT rc.title, ', '),
          ''
        ) AS recommended_courses

      FROM latest_survey ls
      LEFT JOIN recommendation_courses rc
        ON rc.survey_response_id = ls.id

      GROUP BY
        ls.id,
        ls.name,
        ls.age,
        ls.gender,
        ls.institution,
        ls.degree,
        ls.year_of_study,
        ls.semester,
        ls.percentage,
        ls.core_subjects,
        ls.programming_languages,
        ls.worked_on_projects,
        ls.technical_level,
        ls.interests,
        ls.career_goal,
        ls.motivation,
        ls.weekly_hours,
        ls.course_format,
        ls.course_length,
        ls.willing_to_pay,
        ls.learning_challenges,
        ls.learning_style,
        ls.tools_used,
        ls.courses_completed,
        ls.learning_mode,
        ls.certifications,
        ls.created_at

      ORDER BY ls.created_at ASC;
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
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to export Excel');
  }
};

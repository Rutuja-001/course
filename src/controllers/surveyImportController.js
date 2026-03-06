const pool = require('../config/db');
const { importSurveyWithCoursesExcel } = require('../utils/importSurveyWithCoursesExcel');

/**
 * Safely stringify array/object values for PostgreSQL text columns.
 * Mirrors the cleanArray logic in surveyController.js.
 */
const stringify = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(', ');
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
};

/**
 * POST /api/surveys/import-with-courses
 * Accepts an uploaded .xlsx file (field name: "file"),
 * parses it, and inserts each row into survey_responses.
 * Skips rows that already exist (matched by survey_no + name).
 */
exports.importSurveyWithCourses = async (req, res) => {
    try {
        const file = req.files?.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded. Send the .xlsx file in a field named "file".' });
        }

        const surveys = await importSurveyWithCoursesExcel(file.data);

        if (!surveys || surveys.length === 0) {
            return res.status(400).json({ error: 'No valid survey rows found in the uploaded file.' });
        }

        const insertQuery = `
      INSERT INTO survey_responses (
        name, age, gender, institution, degree, year_of_study, semester, percentage,
        core_subjects, programming_languages, worked_on_projects, technical_level,
        interests, career_goal, motivation,
        weekly_hours, course_format, course_length, willing_to_pay, learning_challenges,
        learning_style, tools_used, courses_completed, learning_mode, certifications,
        created_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,
        $13,$14,$15,
        $16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,
        $26
      )
      ON CONFLICT DO NOTHING
      RETURNING id;
    `;

        let insertedCount = 0;
        let skippedCount = 0;

        for (const row of surveys) {
            const params = [
                row.name ?? '',
                row.age ?? '',
                row.gender ?? '',
                row.institution ?? '',
                row.degree ?? '',
                row.year_of_study ?? '',
                row.semester ?? '',
                row.percentage ?? '',

                stringify(row.core_subjects),
                stringify(row.programming_languages),
                row.worked_on_projects !== undefined ? String(row.worked_on_projects) : '',
                row.technical_level ?? '',

                stringify(row.interests),
                row.career_goal ?? '',
                row.motivation ?? '',

                row.weekly_hours ?? '',
                row.course_format ?? '',
                row.course_length ?? '',
                row.willing_to_pay !== undefined ? String(row.willing_to_pay) : '',

                stringify(row.learning_challenges),
                stringify(row.learning_style),
                stringify(row.tools_used),
                stringify(row.courses_completed),
                row.learning_mode ?? '',
                stringify(row.certifications),

                row.created_at || null,
            ];

            const result = await pool.query(insertQuery, params);
            if (result.rows.length > 0) {
                insertedCount++;
            } else {
                skippedCount++;
            }
        }

        return res.status(200).json({
            message: 'Import complete',
            total: surveys.length,
            inserted: insertedCount,
            skipped: skippedCount,
        });

    } catch (err) {
        console.error('IMPORT EXCEL ERROR:', err);
        return res.status(500).json({ error: err.message });
    }
};

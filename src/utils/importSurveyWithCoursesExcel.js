const ExcelJS = require('exceljs');
const moment = require('moment');

/**
 * Safely parse JSON strings back to arrays/objects.
 * The export file uses JSON.stringify() for array fields,
 * so we reverse that here.
 */
const parseJSON = (value) => {
    if (value === null || value === undefined || value === '') return value;
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch {
        return value; // return as-is if not valid JSON
    }
};

/**
 * Normalize a header string to a column lookup key.
 * Matches the normalizeHeader logic used when writing headers.
 */
const normalizeHeader = (header) =>
    header
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');

/**
 * Import Survey + Recommended Courses from Excel.
 * Accepts a Buffer (from express-fileupload) or a file path string.
 * Returns an array of survey objects matching the DB row shape.
 *
 * Column headers expected (as produced by exportExcel.js):
 *   Survey No, Name, Age, Gender, Institution, Degree, Year of Study,
 *   Semester, Percentage, Core Subjects, Programming Languages,
 *   Worked On Projects, Technical Level, Interests, Career Goal,
 *   Motivation, Weekly Hours, Course Format, Course Length,
 *   Willing To Pay, Learning Challenges, Learning Style, Tools Used,
 *   Courses Completed, Learning Mode, Certifications,
 *   Recommended Courses, Submitted At
 */
const importSurveyWithCoursesExcel = async (input) => {
    const workbook = new ExcelJS.Workbook();

    if (typeof input === 'string') {
        await workbook.xlsx.readFile(input);
    } else {
        // Buffer or Readable stream
        await workbook.xlsx.load(input);
    }

    const worksheet = workbook.getWorksheet('Survey With Courses');
    if (!worksheet) {
        throw new Error('Worksheet "Survey With Courses" not found in the Excel file.');
    }

    // ── Build header → column-index map from row 1 ──────────────────────────
    const headerMap = {};
    worksheet.getRow(1).eachCell((cell, colNumber) => {
        const key = normalizeHeader(String(cell.value ?? ''));
        if (key) headerMap[key] = colNumber;
    });

    const col = (key) => headerMap[normalizeHeader(key)];

    const cellVal = (row, key) => {
        const c = col(key);
        if (!c) return undefined;
        const cell = row.getCell(c);
        // ExcelJS may return { text, hyperlink } objects for rich-text cells
        if (cell.value && typeof cell.value === 'object' && 'text' in cell.value) {
            return cell.value.text ?? '';
        }
        // Handle Date objects (ExcelJS parses date-formatted cells as JS Dates)
        if (cell.value instanceof Date) return cell.value;
        return cell.value ?? '';
    };

    const surveys = [];

    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return; // skip header row

        // Skip completely empty rows
        const rawSurveyNo = cellVal(row, 'Survey No');
        if (rawSurveyNo === '' || rawSurveyNo === null || rawSurveyNo === undefined) return;

        // Parse Submitted At — could be a JS Date (if Excel cell formatted as date)
        // or a string like "2025-01-15 14:30:00"
        const createdAtRaw = cellVal(row, 'Submitted At');
        let createdAt = null;
        if (createdAtRaw instanceof Date) {
            createdAt = createdAtRaw;
        } else if (createdAtRaw) {
            const parsed = moment(createdAtRaw, ['YYYY-MM-DD HH:mm:ss', moment.ISO_8601], true);
            createdAt = parsed.isValid() ? parsed.toDate() : createdAtRaw;
        }

        surveys.push({
            survey_no: rawSurveyNo,
            name: cellVal(row, 'Name'),
            age: cellVal(row, 'Age'),
            gender: cellVal(row, 'Gender'),
            institution: cellVal(row, 'Institution'),
            degree: cellVal(row, 'Degree'),
            year_of_study: cellVal(row, 'Year of Study'),
            semester: cellVal(row, 'Semester'),
            percentage: cellVal(row, 'Percentage'),

            // These are stored as JSON strings by the exporter — parse them back
            core_subjects: parseJSON(cellVal(row, 'Core Subjects')),
            programming_languages: parseJSON(cellVal(row, 'Programming Languages')),

            worked_on_projects: cellVal(row, 'Worked On Projects'),
            technical_level: cellVal(row, 'Technical Level'),

            interests: parseJSON(cellVal(row, 'Interests')),
            career_goal: cellVal(row, 'Career Goal'),
            motivation: cellVal(row, 'Motivation'),
            weekly_hours: cellVal(row, 'Weekly Hours'),
            course_format: cellVal(row, 'Course Format'),
            course_length: cellVal(row, 'Course Length'),
            willing_to_pay: cellVal(row, 'Willing To Pay'),

            learning_challenges: parseJSON(cellVal(row, 'Learning Challenges')),
            learning_style: parseJSON(cellVal(row, 'Learning Style')),
            tools_used: parseJSON(cellVal(row, 'Tools Used')),
            courses_completed: parseJSON(cellVal(row, 'Courses Completed')),

            learning_mode: cellVal(row, 'Learning Mode'),
            certifications: parseJSON(cellVal(row, 'Certifications')),

            // Already a plain string in the export
            recommended_courses: cellVal(row, 'Recommended Courses') || '',

            created_at: createdAt,
        });
    });

    return surveys;
};

module.exports = {
    importSurveyWithCoursesExcel,
};

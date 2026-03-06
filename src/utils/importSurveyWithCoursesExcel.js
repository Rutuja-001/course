const ExcelJS = require('exceljs');
const moment = require('moment');

const parseJSON = (value) => {
  if (!value || typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const normalizeHeader = (header) =>
  header
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

const importSurveyWithCoursesExcel = async (input) => {
  const workbook = new ExcelJS.Workbook();

  if (typeof input === 'string') {
    await workbook.xlsx.readFile(input);
  } else {
    await workbook.xlsx.load(input);
  }

  const worksheet = workbook.getWorksheet('Survey With Courses');
  if (!worksheet) {
    throw new Error('Worksheet "Survey With Courses" not found in the Excel file.');
  }

  const headerMap = {};
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    const key = normalizeHeader(cell.value ?? '');
    if (key) headerMap[key] = colNumber;
  });

  const col = (key) => headerMap[normalizeHeader(key)];

  const cellVal = (row, key) => {
    const c = col(key);
    if (!c) return '';

    const cell = row.getCell(c);

    if (cell.value && typeof cell.value === 'object' && 'text' in cell.value) {
      return cell.value.text ?? '';
    }

    return cell.value ?? '';
  };

  const surveys = [];

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return;

    const rawSurveyNo = cellVal(row, 'Survey No');
    if (rawSurveyNo === '' || rawSurveyNo === null || rawSurveyNo === undefined) return;

    const createdAtRaw = cellVal(row, 'Submitted At');
    const createdAt = createdAtRaw
      ? moment(createdAtRaw, ['YYYY-MM-DD HH:mm:ss', moment.ISO_8601], true).isValid()
        ? moment(createdAtRaw, ['YYYY-MM-DD HH:mm:ss', moment.ISO_8601]).toDate()
        : createdAtRaw
      : null;

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
      recommended_courses: cellVal(row, 'Recommended Courses') || '',
      created_at: createdAt,
    });
  });

  return surveys;
};

module.exports = {
  importSurveyWithCoursesExcel,
};
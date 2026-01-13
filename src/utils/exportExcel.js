const ExcelJS = require('exceljs');
const moment = require('moment');

/**
 * Safely stringify arrays/objects for Excel
 */
const stringify = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;

  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value);
  }
};

/**
 * Export Survey + Recommended Courses to Excel
 * (ONE ROW = ONE SURVEY)
 */
const exportSurveyWithCoursesExcel = async (rows) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Survey With Courses');

  if (!rows || rows.length === 0) {
    return workbook.xlsx.writeBuffer();
  }

  // ===============================
  // Excel Columns
  // ===============================
  worksheet.columns = [
    { header: 'Survey No', key: 'survey_no', width: 10 },
    //{ header: 'Survey ID', key: 'survey_id', width: 12 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Age', key: 'age', width: 8 },
    { header: 'Gender', key: 'gender', width: 12 },
    { header: 'Institution', key: 'institution', width: 30 },
    { header: 'Degree', key: 'degree', width: 18 },
    { header: 'Year of Study', key: 'year_of_study', width: 15 },
    { header: 'Semester', key: 'semester', width: 12 },
    { header: 'Percentage', key: 'percentage', width: 12 },
    { header: 'Core Subjects', key: 'core_subjects', width: 30 },
    { header: 'Programming Languages', key: 'programming_languages', width: 30 },
    { header: 'Worked On Projects', key: 'worked_on_projects', width: 20 },
    { header: 'Technical Level', key: 'technical_level', width: 18 },
    { header: 'Interests', key: 'interests', width: 30 },
    { header: 'Career Goal', key: 'career_goal', width: 25 },
    { header: 'Motivation', key: 'motivation', width: 30 },
    { header: 'Weekly Hours', key: 'weekly_hours', width: 15 },
    { header: 'Course Format', key: 'course_format', width: 20 },
    { header: 'Course Length', key: 'course_length', width: 20 },
    { header: 'Willing To Pay', key: 'willing_to_pay', width: 15 },
    { header: 'Learning Challenges', key: 'learning_challenges', width: 30 },
    { header: 'Learning Style', key: 'learning_style', width: 25 },
    { header: 'Tools Used', key: 'tools_used', width: 25 },
    { header: 'Courses Completed', key: 'courses_completed', width: 30 },
    { header: 'Learning Mode', key: 'learning_mode', width: 18 },
    { header: 'Certifications', key: 'certifications', width: 30 },

    // ✅ SINGLE COLUMN FOR COURSES
    { header: 'Recommended Courses', key: 'recommended_courses', width: 50 },

    { header: 'Submitted At', key: 'created_at', width: 22 }
  ];

  // Make header bold
  worksheet.getRow(1).font = { bold: true };

  // ===============================
  // Data Population (ONE ROW PER SURVEY)
  // ===============================
  rows.forEach((row) => {
    worksheet.addRow({
      survey_no: row.survey_no,
      //survey_id: row.survey_id,
      name: row.name,
      age: row.age,
      gender: row.gender,
      institution: row.institution,
      degree: row.degree,
      year_of_study: row.year_of_study,
      semester: row.semester,
      percentage: row.percentage,
      core_subjects: stringify(row.core_subjects),
      programming_languages: stringify(row.programming_languages),
      worked_on_projects: row.worked_on_projects,
      technical_level: row.technical_level,
      interests: stringify(row.interests),
      career_goal: row.career_goal,
      motivation: row.motivation,
      weekly_hours: row.weekly_hours,
      course_format: row.course_format,
      course_length: row.course_length,
      willing_to_pay: row.willing_to_pay,
      learning_challenges: stringify(row.learning_challenges),
      learning_style: stringify(row.learning_style),
      tools_used: stringify(row.tools_used),
      courses_completed: stringify(row.courses_completed),
      learning_mode: row.learning_mode,
      certifications: stringify(row.certifications),

      // ✅ already a STRING from SQL (STRING_AGG)
      recommended_courses: row.recommended_courses || '',

      created_at: row.created_at
        ? moment(row.created_at).format('YYYY-MM-DD HH:mm:ss')
        : ''
    });
  });

  // Wrap text for long columns
  worksheet.getColumn('recommended_courses').alignment = {
    wrapText: true,
    vertical: 'top'
  };

  worksheet.getColumn('created_at').numFmt =
    'yyyy-mm-dd hh:mm:ss AM/PM';

  return workbook.xlsx.writeBuffer();
};

module.exports = {
  exportSurveyWithCoursesExcel
};

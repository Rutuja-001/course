const ExcelJS = require('exceljs');

const stringify = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const exportSurveyWithCoursesExcel = async (rows) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Survey With Courses');

  if (!rows || rows.length === 0) {
    return await workbook.xlsx.writeBuffer();
  }

  worksheet.columns = [
    { header: 'Survey ID', key: 'survey_id', width: 12 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Age', key: 'age', width: 10 },
    { header: 'Gender', key: 'gender', width: 15 },
    { header: 'Institution', key: 'institution', width: 30 },
    { header: 'Degree', key: 'degree', width: 20 },
    { header: 'Year of Study', key: 'year_of_study', width: 15 },
    { header: 'Semester', key: 'semester', width: 12 },
    { header: 'Percentage', key: 'percentage', width: 12 },
    { header: 'Core Subjects', key: 'core_subjects', width: 30 },
    { header: 'Programming Languages', key: 'programming_languages', width: 30 },
    { header: 'Worked On Projects', key: 'worked_on_projects', width: 20 },
    { header: 'Technical Level', key: 'technical_level', width: 20 },
    { header: 'Interests', key: 'interests', width: 30 },
    { header: 'Career Goal', key: 'career_goal', width: 25 },
    { header: 'Motivation', key: 'motivation', width: 30 },
    { header: 'Weekly Hours', key: 'weekly_hours', width: 15 },
    { header: 'Course Format', key: 'course_format', width: 20 },
    { header: 'Course Length', key: 'course_length', width: 20 },
    { header: 'Willing To Pay', key: 'willing_to_pay', width: 15 },
    { header: 'Learning Challenges', key: 'learning_challenges', width: 30 },
    { header: 'Learning Style', key: 'learning_style', width: 30 },
    { header: 'Tools Used', key: 'tools_used', width: 30 },
    { header: 'Courses Completed', key: 'courses_completed', width: 30 },
    { header: 'Learning Mode', key: 'learning_mode', width: 20 },
    { header: 'Certifications', key: 'certifications', width: 30 },

    { header: 'Course Title', key: 'course_title', width: 30 },
    { header: 'Course Description', key: 'course_description', width: 40 },
    { header: 'Instructor', key: 'instructor', width: 25 },
    { header: 'Duration', key: 'duration', width: 15 },
    { header: 'Level', key: 'level', width: 15 },
    { header: 'Rating', key: 'rating', width: 10 },
    { header: 'Students', key: 'students', width: 15 },
    { header: 'Price', key: 'price', width: 15 },

    { header: 'Submitted At', key: 'created_at', width: 22 }
  ];

  rows.forEach((row) => {
    worksheet.addRow({
      ...row,
      core_subjects: stringify(row.core_subjects),
      programming_languages: stringify(row.programming_languages),
      interests: stringify(row.interests),
      learning_challenges: stringify(row.learning_challenges),
      learning_style: stringify(row.learning_style),
      tools_used: stringify(row.tools_used),
      courses_completed: stringify(row.courses_completed),
      certifications: stringify(row.certifications),
      created_at: row.created_at ? new Date(row.created_at) : null
    });
  });

  // Date + Time format
  worksheet.getColumn('created_at').numFmt = 'yyyy-mm-dd hh:mm:ss';

  return await workbook.xlsx.writeBuffer();
};

module.exports = {
  exportSurveyWithCoursesExcel
};

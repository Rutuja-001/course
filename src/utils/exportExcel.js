const ExcelJS = require('exceljs');

/**
 * Safely stringify arrays / objects for Excel
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
 * Get current server timestamp as Excel-safe Date
 */
// const currentServerDate = () => {
//   const now = new Date();
//   return new Date(
//     now.getFullYear(),
//     now.getMonth(),
//     now.getDate(),
//     now.getHours(),
//     now.getMinutes(),
//     now.getSeconds()
//   );
// };

const exportSurveyWithCoursesExcel = async (rows) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Survey With Courses');

  if (!rows || rows.length === 0) {
    return await workbook.xlsx.writeBuffer();
  }

  // ===============================
  // Excel Columns
  // ===============================
  worksheet.columns = [
    { header: 'Survey ID', key: 'survey_id', width: 12 },
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

    // ---- Course columns ----
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

  // ===============================
  // Data Population
  // ===============================
  rows.forEach((row) => {
    const courses = Array.isArray(row.recommended_courses)
      ? row.recommended_courses
      : [];

    // Case 1: No recommended courses
    if (courses.length === 0) {
      worksheet.addRow({
        survey_id: row.survey_id,
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
       // created_at: currentServerDate() // <-- real server time
      });
      return;
    }

    // Case 2: Has recommended courses
    courses.forEach((course, index) => {
      worksheet.addRow({
        survey_id: index === 0 ? row.survey_id : '',
        name: index === 0 ? row.name : '',
        age: index === 0 ? row.age : '',
        gender: index === 0 ? row.gender : '',
        institution: index === 0 ? row.institution : '',
        degree: index === 0 ? row.degree : '',
        year_of_study: index === 0 ? row.year_of_study : '',
        semester: index === 0 ? row.semester : '',
        percentage: index === 0 ? row.percentage : '',
        core_subjects: index === 0 ? stringify(row.core_subjects) : '',
        programming_languages: index === 0 ? stringify(row.programming_languages) : '',
        worked_on_projects: index === 0 ? row.worked_on_projects : '',
        technical_level: index === 0 ? row.technical_level : '',
        interests: index === 0 ? stringify(row.interests) : '',
        career_goal: index === 0 ? row.career_goal : '',
        motivation: index === 0 ? row.motivation : '',
        weekly_hours: index === 0 ? row.weekly_hours : '',
        course_format: index === 0 ? row.course_format : '',
        course_length: index === 0 ? row.course_length : '',
        willing_to_pay: index === 0 ? row.willing_to_pay : '',
        learning_challenges: index === 0 ? stringify(row.learning_challenges) : '',
        learning_style: index === 0 ? stringify(row.learning_style) : '',
        tools_used: index === 0 ? stringify(row.tools_used) : '',
        courses_completed: index === 0 ? stringify(row.courses_completed) : '',
        learning_mode: index === 0 ? row.learning_mode : '',
        certifications: index === 0 ? stringify(row.certifications) : '',

        course_title: course.title,
        course_description: course.description,
        instructor: course.instructor,
        duration: course.duration,
        level: course.level,
        rating: course.rating,
        students: course.students,
        price: course.price,

        //created_at: currentServerDate() // <-- real server time
      });
    });
  });

  // ===============================
  // Date Format (AM / PM)
  // ===============================
  worksheet.getColumn('created_at').numFmt =
    'yyyy-mm-dd hh:mm:ss AM/PM';

  return await workbook.xlsx.writeBuffer();
};

module.exports = {
  exportSurveyWithCoursesExcel
};

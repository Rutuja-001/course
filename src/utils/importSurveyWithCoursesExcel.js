const XLSX = require("xlsx");

function normalizeHeader(header) {
    return String(header || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
}

function parseList(value) {
    if (value === null || value === undefined || value === "") return [];
    return String(value)
        .replace(/[{}"]/g, "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

async function importSurveyWithCoursesExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    return rawRows.map((row) => {
        const normalized = {};

        Object.keys(row).forEach((key) => {
            normalized[normalizeHeader(key)] = row[key];
        });

        return {
            name: normalized.name || "",
            age: normalized.age || "",
            gender: normalized.gender || "",
            institution: normalized.institution || "",
            degree: normalized.degree || "",
            year_of_study: normalized.year_of_study || "",
            semester: normalized.semester || "",
            percentage: normalized.percentage || "",
            core_subjects: parseList(normalized.core_subjects),
            programming_languages: parseList(normalized.programming_languages),
            worked_on_projects: normalized.worked_on_projects || "",
            technical_level: normalized.technical_level || "",
            interests: parseList(normalized.interests),
            career_goal: normalized.career_goal || "",
            motivation: parseList(normalized.motivation),
            weekly_hours: normalized.weekly_hours || "",
            course_format: normalized.course_format || "",
            course_length: normalized.course_length || "",
            willing_to_pay: normalized.willing_to_pay || "",
            learning_challenges: parseList(normalized.learning_challenges),
            learning_style: parseList(normalized.learning_style),
            tools_used: parseList(normalized.tools_used),
            courses_completed: parseList(normalized.courses_completed),
            learning_mode: parseList(normalized.learning_mode),
            certifications: parseList(normalized.certifications),
            recommended_courses: normalized.recommended_courses || "",
            created_at: normalized.submitted_at || new Date(),
        };
    });
}

module.exports = { importSurveyWithCoursesExcel };

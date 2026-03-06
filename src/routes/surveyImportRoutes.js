const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { importSurveyWithCourses } = require('../controllers/surveyImportController');

// Allow file uploads on this route
router.use(fileUpload());

/**
 * POST /api/surveys/import-with-courses
 * Upload a .xlsx file (field name: "file") to import surveys into the database.
 */
router.post('/', importSurveyWithCourses);

module.exports = router;

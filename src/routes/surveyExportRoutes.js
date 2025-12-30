const express = require('express');
const router = express.Router();
const exportController = require('../controllers/surveyExportController');

// Direct download via /api/surveys/export-with-courses
router.get('/', exportController.downloadSurveyWithCourses);

module.exports = router;

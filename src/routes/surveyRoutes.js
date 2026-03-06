const express = require('express');
const router = express.Router();
const controller = require('../controllers/surveyController');
const fileUpload = require('express-fileupload');
const { importSurveyWithCoursesExcel } = require('../utils/importSurveyWithCoursesExcel');

router.use(fileUpload());

// Create survey response
router.post('/surveys', controller.createResponse);

// Get all survey responses
router.get('/surveys', controller.getResponses);

// Get survey by ID
router.get('/surveys/:id', controller.getSurveyById);

// Import survey from Excel
router.post('/surveys/import-excel', async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const surveys = await importSurveyWithCoursesExcel(file.data);

    res.json({
      message: 'Import successful',
      count: surveys.length,
      data: surveys
    });
  } catch (err) {
    console.error('IMPORT EXCEL ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
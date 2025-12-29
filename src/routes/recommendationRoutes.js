const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

// ==========================
// POST quiz answers and get recommended courses
// ==========================
router.post('/', recommendationController.getRecommendations);



// ==========================
// GET export courses to Excel
// ==========================
//router.get('/export', recommendationController.exportCourses);

module.exports = router;

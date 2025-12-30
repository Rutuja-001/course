const express = require('express');
const router = express.Router();

const recommendationController = require('../controllers/recommendationController');

// Create recommendation course
router.post('/', recommendationController.createRecommendation);

// Get all recommendations
router.get('/', recommendationController.getRecommendations);

// Get recommendation by ID ✅ FIXED
router.get('/:id', recommendationController.getRecommendationById);

module.exports = router;

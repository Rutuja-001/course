const express = require('express');
const router = express.Router();

const recommendationController = require('../controllers/recommendationController');

// Create recommendation course
router.post('/', recommendationController.createRecommendation);
router.get('/', recommendationController.getRecommendations);
module.exports = router;

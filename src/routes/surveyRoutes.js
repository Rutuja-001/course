const express = require('express');
const router = express.Router();
const controller = require('../controllers/surveyController');

router.post('/surveys', controller.createResponse);
router.get('/surveys', controller.getResponses);
//router.get('/surveys/:id', controller.getSurveyById);

module.exports = router;

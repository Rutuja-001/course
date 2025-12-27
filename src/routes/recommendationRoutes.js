const express = require('express');
const router = express.Router();

const {
  createCourse,
  getCourses,
  exportCourses,
  test
} = require('../controllers/recommendation');

// TEST ENDPOINT
router.get('/question', test);

// CREATE RECOMMENDATION COURSE
router.post('/', createCourse);

// GET ALL COURSES
router.get('/', getCourses);

// EXPORT COURSES
router.get('/export', exportCourses);

module.exports = router;

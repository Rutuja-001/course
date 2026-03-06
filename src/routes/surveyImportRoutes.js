const express = require('express');
const router = express.Router();
const { importSurveyWithCoursesExcel } = require('../utils/importSurveyWithCoursesExcel');

router.post('/', async (req, res) => {
    try {
        console.log('req.files:', req.files);

        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.files.file;

        if (!file.name.endsWith('.xlsx')) {
            return res.status(400).json({ error: 'Only .xlsx files are allowed' });
        }

        const surveys = await importSurveyWithCoursesExcel(file.data);

        return res.status(200).json({
            message: 'Import successful',
            count: surveys.length,
            data: surveys,
        });
    } catch (err) {
        console.error('IMPORT EXCEL ERROR:', err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
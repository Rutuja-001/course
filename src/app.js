require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const surveyRoutes = require('./routes/surveyRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const surveyExportRoutes = require('./routes/surveyExportRoutes');
const surveyImportRoutes = require('./routes/surveyImportRoutes');
const swaggerSetup = require('./swagger/swagger');

const app = express();

app.use(cors());

// File upload middleware - use only once globally
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  abortOnLimit: true,
  useTempFiles: false,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', surveyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/surveys/export-with-courses', surveyExportRoutes);
app.use('/api/surveys/import-with-courses', surveyImportRoutes);

// Swagger
swaggerSetup(app);

// Health check
app.get('/', (req, res) => res.send({ status: 'ok' }));

// Error handling
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

module.exports = app;
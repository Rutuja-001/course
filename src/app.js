require('dotenv').config();
const express = require('express');
// const bodyParser = require('body-parser'); // optional, use express.json instead
const cors = require('cors');

const surveyRoutes = require('./routes/surveyRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const surveyExportRoutes = require('./routes/surveyExportRoutes');
const swaggerSetup = require('./swagger/swagger');


const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));        // use express.json instead of body-parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', surveyRoutes);
app.use('/api/recommendations', recommendationRoutes);
//app.use('/api/export', require('./routes/surveyExportRoutes'));
app.use('/api/surveys/export-with-courses', surveyExportRoutes);

// Swagger
swaggerSetup(app);

// Health check
app.get('/', (req, res) => res.send({ status: 'ok' }));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;

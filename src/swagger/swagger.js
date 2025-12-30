const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Survey & Recommendation Courses API',
      version: '1.0.0',
      description:
        'API for storing, linking, and exporting student survey responses and recommendation courses',
    },

    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
      },
    ],

    components: {
      schemas: {
        /* =========================
           SURVEY RESPONSE SCHEMA
        ========================= */
        SurveyResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            age: { type: 'string' },
            gender: { type: 'string' },
            institution: { type: 'string' },
            degree: { type: 'string' },
            year_of_study: { type: 'string' },
            semester: { type: 'string' },
            percentage: { type: 'string' },
            core_subjects: { type: 'string' },
            programming_languages: { type: 'string' },
            worked_on_projects: { type: 'string' },
            technical_level: { type: 'string' },
            interests: { type: 'string' },
            career_goal: { type: 'string' },
            motivation: { type: 'string' },
            weekly_hours: { type: 'string' },
            course_format: { type: 'string' },
            course_length: { type: 'string' },
            willing_to_pay: { type: 'string' },
            learning_challenges: { type: 'string' },
            learning_style: { type: 'string' },
            tools_used: { type: 'string' },
            courses_completed: { type: 'string' },
            learning_mode: { type: 'string' },
            certifications: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },

        CreateSurveyRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            age: { type: 'string' },
            gender: { type: 'string' },
            institution: { type: 'string' },
            degree: { type: 'string' },
            year_of_study: { type: 'string' },
            semester: { type: 'string' },
            percentage: { type: 'string' },
            core_subjects: { type: 'string' },
            programming_languages: { type: 'string' },
            worked_on_projects: { type: 'string' },
            technical_level: { type: 'string' },
            interests: { type: 'string' },
            career_goal: { type: 'string' },
            motivation: { type: 'string' },
            weekly_hours: { type: 'string' },
            course_format: { type: 'string' },
            course_length: { type: 'string' },
            willing_to_pay: { type: 'string' },
            learning_challenges: { type: 'string' },
            learning_style: { type: 'string' },
            tools_used: { type: 'string' },
            courses_completed: { type: 'string' },
            learning_mode: { type: 'string' },
            certifications: { type: 'string' },
          },
        },

        /* =========================
           RECOMMENDATION COURSE SCHEMA
        ========================= */
        RecommendationCourse: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            survey_response_id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            instructor: { type: 'string' },
            duration: { type: 'string' },
            level: { type: 'string' },
            rating: { type: 'number' },
            students: { type: 'integer' },
            price: { type: 'string' },
            image: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },

        CreateRecommendationRequest: {
          type: 'object',
          required: ['survey_response_id', 'title'],
          properties: {
            survey_response_id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            instructor: { type: 'string' },
            duration: { type: 'string' },
            level: { type: 'string' },
            rating: { type: 'number' },
            students: { type: 'integer' },
            price: { type: 'string' },
            image: { type: 'string' },
          },
        },
      },
    },

    /* =========================
       API PATHS
    ========================= */
    paths: {
      '/api/surveys': {
        post: {
          summary: 'Create survey response',
          tags: ['Surveys'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateSurveyRequest',
                },
              },
            },
          },
          responses: {
            201: { description: 'Survey created successfully' },
          },
        },

        get: {
          summary: 'Get all survey responses',
          tags: ['Surveys'],
          responses: {
            200: {
              description: 'List of surveys',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SurveyResponse' },
                  },
                },
              },
            },
          },
        },
      },

      '/api/recommendations': {
        post: {
          summary: 'Create recommendation course',
          tags: ['Recommendation Courses'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateRecommendationRequest',
                },
              },
            },
          },
          responses: {
            201: { description: 'Recommendation created' },
          },
        },

        get: {
          summary: 'Get all recommendation courses',
          tags: ['Recommendation Courses'],
          responses: {
            200: {
              description: 'List of recommendations',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/RecommendationCourse' },
                  },
                },
              },
            },
          },
        },
      },

      /* =========================
         NEW EXPORT ENDPOINT
      ========================= */
      '/api/surveys/export-with-courses': {
        get: {
          summary: 'Export survey responses with recommended courses to Excel',
          tags: ['Surveys'],
          responses: {
            200: { description: 'Excel file downloaded' },
          },
        },
      },
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

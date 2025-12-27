# Student Survey Backend

Simple Express backend for storing student survey responses in MySQL and exporting to Excel. Swagger UI is available for testing.

Setup

1. Copy `.env.example` to `.env` and update DB credentials.
2. Install dependencies:

```bash
npm install
```

3. Create the database (if not exists) and optionally run the init endpoint to create the table.

SQL table schema:

```sql
CREATE TABLE survey_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    gender VARCHAR(20),
    institution VARCHAR(150),
    degree VARCHAR(50),
    year_of_study VARCHAR(20),
    semester VARCHAR(20),
    percentage VARCHAR(30),
    core_subjects TEXT,
    programming_languages TEXT,
    worked_on_projects VARCHAR(10),
    technical_level VARCHAR(20),
    interests TEXT,
    career_goal VARCHAR(50),
    motivation TEXT,
    weekly_hours VARCHAR(20),
    course_format VARCHAR(50),
    course_length VARCHAR(30),
    willing_to_pay VARCHAR(20),
    learning_challenges TEXT,
    learning_style TEXT,
    tools_used TEXT,
    courses_completed TEXT,
    learning_mode TEXT,
    certifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Run

```bash
npm run dev
```

Swagger UI: http://localhost:3000/api-docs

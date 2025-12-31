const pool = require('../config/db');

/*
  SAME COURSE LIST AS FRONTEND
  (In real projects this comes from DB)
*/
const courses = [
 // const courses: Course[] = [
  {
    id: 1,
    title: "Complete Full Stack Web Development with MERN",
    description: "Master React, Node.js, Express, MongoDB and build industry-ready projects with placement assistance",
    instructor: "Priya Sharma",
    duration: "120 hours",
    level: "Beginner to Advanced",
    rating: 4.8,
    students: 45000,
    price: "₹4,999",
    tags: ["Web Development", "React", "Node.js", "MongoDB", "JavaScript"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Data Science & Machine Learning with Python",
    description: "Complete data science course covering pandas, numpy, scikit-learn, and real industry projects",
    instructor: "Rajesh Kumar",
    duration: "80 hours",
    level: "Intermediate",
    rating: 4.7,
    students: 32000,
    price: "₹6,999",
    tags: ["Python", "Data Science", "Machine Learning", "Analytics", "AI"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Android App Development with Kotlin",
    description: "Build modern Android apps with Kotlin, Firebase, and publish to Google Play Store",
    instructor: "Anita Desai",
    duration: "60 hours",
    level: "Beginner to Intermediate",
    rating: 4.6,
    students: 28000,
    price: "₹3,999",
    tags: ["Android", "Kotlin", "Mobile Development", "Firebase"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Cloud Computing with AWS & DevOps",
    description: "Master AWS services, Docker, Kubernetes and become a certified cloud professional",
    instructor: "Vikram Singh",
    duration: "100 hours",
    level: "Intermediate to Advanced",
    rating: 4.9,
    students: 25000,
    price: "₹8,999",
    tags: ["AWS", "Cloud Computing", "DevOps", "Docker", "Kubernetes"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Cybersecurity & Ethical Hacking Bootcamp",
    description: "Learn penetration testing, network security, and ethical hacking with hands-on labs",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹7,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },

  {
    id: 6,
    title: "Networking & System",
    description: "Understand computer networks, system architecture, protocols, servers.",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹6,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },

  {
    id: 7,
    title: "DevOps & Software Development",
    description: "Learn software development with DevOps tools like Git, CI/CD, Docker, and cloud deployment for building and delivering applications .",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹5,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },

  {
    id: 8,
    title: "Big Data, Analytics & Data Engineering",
    description: "Learn big data processing, data analytics.",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹5,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },

  {
    id: 9,
    title: "Software Engineering & Architecture",
    description: "Learn software design principles, system architecture.",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹5,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },
  
  {
    id: 10,
    title: "Tech + Management / Leadership",
    description: "leadership, project management, and team collaboration for real-world projects.",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹5,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },

  // add remaining courses if needed
];

// ============================
// CREATE Recommendation (FIXED)
// ============================
exports.createRecommendation = async (req, res) => {
  const { survey_response_id, course_ids } = req.body;

  // ✅ Correct validation
  if (!survey_response_id || !Array.isArray(course_ids) || course_ids.length === 0) {
    return res.status(400).json({
      error: "survey_response_id and course_ids are required"
    });
  }

  try {
    const insertQuery = `
      INSERT INTO recommendation_courses
      (
        survey_response_id,
        title,
        description,
        instructor,
        duration,
        level,
        rating,
        students,
        price,
        image
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `;

    for (const courseId of course_ids) {
      const course = courses.find(c => c.id === courseId);
      if (!course) continue;

      await pool.query(insertQuery, [
        survey_response_id,
        course.title,
        course.description,
        course.instructor,
        course.duration,
        course.level,
        course.rating,
        course.students,
        course.price,
        course.image
      ]);
    }

    res.status(201).json({
      message: "Selected courses saved successfully"
    });

  } catch (error) {
    console.error("CREATE RECOMMENDATION ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET ALL Recommendations
// ============================
exports.getRecommendations = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recommendation_courses ORDER BY created_at DESC'
    );

    res.status(200).json({
      message: 'Recommendations fetched successfully',
      data: result.rows
    });

  } catch (error) {
    console.error('GET RECOMMENDATIONS ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET Recommendation BY ID
// ============================
exports.getRecommendationById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM recommendation_courses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Recommendation not found'
      });
    }

    res.status(200).json({
      message: 'Recommendation fetched successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('GET RECOMMENDATION BY ID ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

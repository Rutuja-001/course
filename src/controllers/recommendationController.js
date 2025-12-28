const pool = require('../config/db'); // PostgreSQL pool
const { exportToExcelBuffer } = require('../utils/exportExcel');

// Default courses (can also be stored in DB)
const defaultCourses = [
  { id: 1, title: "Complete Full Stack Web Development with MERN", description: "Master React, Node.js, Express, MongoDB", instructor: "Priya Sharma", duration: "120 hours", level: "Beginner to Advanced", rating: 4.8, students: 45000, price: "₹4,999", tags: ["Web Development", "React", "Node.js"] },
  { id: 2, title: "Data Science & Machine Learning with Python", description: "Learn Python, Pandas, NumPy, ML", instructor: "Rajesh Kumar", duration: "80 hours", level: "Intermediate", rating: 4.7, students: 32000, price: "₹6,999", tags: ["Python", "Data Science", "ML"] },
  // Add more courses as needed
];

// ==========================
// POST /recommendations
// Receive quiz answers and return recommended courses
// ==========================
exports.getRecommendations = async (req, res) => {
  try {
    const userAnswers = req.body; // Array of user's answers

    if (!userAnswers || !Array.isArray(userAnswers) || userAnswers.length === 0) {
      // If no answers, return default courses
      return res.status(200).json({ recommendations: defaultCourses });
    }

    // TODO: Implement logic to filter/recommend courses based on quiz answers
    // For now, randomly select some courses as a simple recommendation
    const shuffled = [...defaultCourses].sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, Math.min(5, shuffled.length)); // pick up to 5

    res.status(200).json({ recommendations: recommended });
  } catch (err) {
    console.error("GET RECOMMENDATIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// GET /recommendations/export
// Export courses to Excel
// ==========================
exports.exportCourses = exportToExcelBuffer;

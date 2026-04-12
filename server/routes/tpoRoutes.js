const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const {
  getAllStudents,
  getStudentById,
  verifyStudent,
  getAllRecruiters,
  getRecruiterById,
  verifyRecruiter,
  getAllJobs,
  getJobById,
  approveJob,
  getStats
} = require("../controllers/tpoController");


// --- STUDENTS ---

// Get all students
router.get("/students", isAuthenticated, authorizeRoles("admin"), getAllStudents);

// Get single student
router.get("/students/:id", isAuthenticated, authorizeRoles("admin"), getStudentById);

// Verify student
router.put("/students/:id/verify", isAuthenticated, authorizeRoles("admin"), verifyStudent);



// --- RECRUITERS ---

// Get all recruiters
router.get("/recruiters", isAuthenticated, authorizeRoles("admin"), getAllRecruiters);

// Get single recruiter
router.get("/recruiters/:id", isAuthenticated, authorizeRoles("admin"), getRecruiterById);

// Verify recruiter
router.put("/recruiters/:id/verify", isAuthenticated, authorizeRoles("admin"), verifyRecruiter);



// --- JOBS ---

// Get all jobs
router.get("/jobs", isAuthenticated, authorizeRoles("admin"), getAllJobs);

// Get single job
router.get("/jobs/:id", isAuthenticated, authorizeRoles("admin"), getJobById);

// Approve job
router.patch("/jobs/:id/approve", isAuthenticated, authorizeRoles("admin"), approveJob);



// --- STATS ---

// Get dashboard stats
router.get("/stats", isAuthenticated, authorizeRoles("admin"), getStats);


module.exports = router;
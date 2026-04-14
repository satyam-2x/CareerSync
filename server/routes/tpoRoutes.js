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

router.get("/students", isAuthenticated, authorizeRoles("admin"), getAllStudents);
router.get("/students/:id", isAuthenticated, authorizeRoles("admin"), getStudentById);
router.put("/students/:id/verify", isAuthenticated, authorizeRoles("admin"), verifyStudent);



// --- RECRUITERS ---

router.get("/recruiters", isAuthenticated, authorizeRoles("admin"), getAllRecruiters);
router.get("/recruiters/:id", isAuthenticated, authorizeRoles("admin"), getRecruiterById);
router.put("/recruiters/:id/verify", isAuthenticated, authorizeRoles("admin"), verifyRecruiter);



// --- JOBS ---

router.get("/jobs", isAuthenticated, authorizeRoles("admin"), getAllJobs);


router.patch("/jobs/:id/approve", isAuthenticated, authorizeRoles("admin"), approveJob);

// Get single job
router.get("/jobs/:id", isAuthenticated, authorizeRoles("admin"), getJobById);



// --- STATS ---

router.get("/stats", isAuthenticated, authorizeRoles("admin"), getStats);


module.exports = router;
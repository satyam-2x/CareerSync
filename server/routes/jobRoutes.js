const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const {
  getAllJobs,
  getJobById,
  applyJob,
  getMyApplications,
} = require("../controllers/jobController");


// --- JOB ROUTES ---

// Get all jobs
router.get("/", getAllJobs);

// --- STUDENT ROUTES ---

// Get my applications
router.get("/me", isAuthenticated, authorizeRoles("student"), getMyApplications); 


// Apply to job
router.post("/:id/apply", isAuthenticated, authorizeRoles("student"), applyJob);


// Get single job
router.get("/:id", getJobById); 


module.exports = router;
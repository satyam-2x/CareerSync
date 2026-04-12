const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const {
  postJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getApplicants,
  updateApplicationStatus,
} = require("../controllers/recruiterController");


// --- JOB MANAGEMENT ---

// Create job
router.post("/jobs", isAuthenticated, authorizeRoles("recruiter"), postJob);

// Get my jobs
router.get("/jobs", isAuthenticated, authorizeRoles("recruiter"), getMyJobs);

// Update job
router.put("/jobs/:id", isAuthenticated, authorizeRoles("recruiter"), updateJob);

// Delete job
router.delete("/jobs/:id", isAuthenticated, authorizeRoles("recruiter"), deleteJob);


// --- APPLICATION MANAGEMENT ---

// Get applicants for a job
router.get("/jobs/:id/applicants", isAuthenticated, authorizeRoles("recruiter"), getApplicants);

// Update application status
router.put("/applications/:id", isAuthenticated, authorizeRoles("recruiter"), updateApplicationStatus);

module.exports = router;
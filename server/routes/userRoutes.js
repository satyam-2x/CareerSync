const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  uploadResume,
} = require("../controllers/userController");


// --- PROFILE ---

// Get user profile
router.get("/profile", isAuthenticated, getProfile);

// Update profile
router.put("/profile", isAuthenticated, updateProfile);

// Delete account
router.delete("/profile", isAuthenticated, deleteAccount);


// --- FILE ---

// Upload resume
router.post("/upload-resume", isAuthenticated, upload.single("resume"), uploadResume);


// --- SECURITY ---

// Change password
router.put("/change-password", isAuthenticated, changePassword);


module.exports = router;
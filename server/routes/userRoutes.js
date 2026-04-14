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

router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);
router.delete("/profile", isAuthenticated, deleteAccount);


// --- FILE ---

router.post("/upload-resume", isAuthenticated, upload.single("resume"), uploadResume); 


// --- SECURITY ---

router.put("/change-password", isAuthenticated, changePassword);


module.exports = router;
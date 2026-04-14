const User = require("../models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");


// --- UPLOAD RESUME ---
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume required" });
        }

        if (req.file.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "Only PDF allowed" });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                access_mode: "public",
                format: "pdf",
                folder: "student_resumes"
            },
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary Error:", error);
                    return res.status(500).json({ message: "Upload failed" });
                }

                try {
                    const studentId = req.user.id;

                    const updatedStudent = await User.findByIdAndUpdate(
                        studentId,
                        {
                            resume: result.secure_url,
                            resumePublicId: result.public_id
                        },
                        { new: true }
                    );

                    return res.status(200).json({
                        success: true,
                        message: "Resume uploaded successfully",
                        url: result.secure_url,
                        student: updatedStudent
                    });

                } catch (dbError) {
                    console.error("DB Error:", dbError);
                    return res.status(500).json({
                        message: "Uploaded but DB update failed"
                    });
                }
            }
        );

        uploadStream.end(req.file.buffer);

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


// --- GET PROFILE ---
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};


// --- UPDATE PROFILE ---
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.body.role || req.body.email || req.body.password) {
            return res.status(400).json({
                message: "Cannot update role, email or password here"
            });
        }

        user.name = req.body.name || user.name;

        if (user.role === "student") {
            user.prn = req.body.prn || user.prn;
            user.course = req.body.course || user.course;
            user.branch = req.body.branch || user.branch;
            user.semester = req.body.semester || user.semester;
            user.cgpa = req.body.cgpa || user.cgpa;
            user.resume = req.body.resume || user.resume;
        }

        if (user.role === "recruiter") {
            user.companyName = req.body.companyName || user.companyName;
            user.companyEmail = req.body.companyEmail || user.companyEmail;
            user.companyWebsite = req.body.companyWebsite || user.companyWebsite;
            user.contactNumber = req.body.contactNumber || user.contactNumber;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
};


// --- CHANGE PASSWORD ---
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Error changing password" });
    }
};


// --- DELETE ACCOUNT ---
exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password required" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        if (user.role === "student" && user.resumePublicId) {
            await cloudinary.uploader.destroy(user.resumePublicId, {
                resource_type: "raw"
            });
        }

        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Error deleting account" });
    }
};
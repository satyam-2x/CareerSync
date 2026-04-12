const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    // --- BASIC INFO ---
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },


    password: {
        type: String,
        required: true,
        minlength: 6,
        match: [/(?=.*[!@#$%^&*])/, "Password must contain at least 1 symbol"]
    },

    // --- ROLE ---
    role: {
        type: String,
        enum: ["student", "recruiter", 'admin'],
        default: "student"
    },

    // --- STUDENT FIELDS ---
    prn: {
        type: String,
        unique: true,
        sparse: true,
        match: [/^\d{12}$/, "PRN must be exactly 12 digits"]
    },
    course: { type: String, trim: true },
    branch: { type: String, trim: true },
    semester: {
        type: Number,
        min: [1, "Semester cannot be less than 1"],
        max: [8, "Semester cannot be more than 8"]
    },
    cgpa: {
        type: Number,
        min: [0, "CGPA cannot be less than 0"],
        max: [10, "CGPA cannot be more than 10"]
    },
    resume: { type: String },
    resumePublicId: { type: String },

    // --- RECRUITER FIELDS ---
    companyName: { type: String, trim: true },
    companyEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid company email"]
    },
    companyWebsite: { type: String },
    contactNumber: {
        type: String,
        match: [/^\d{10}$/, "Contact number must be 10 digits"]
    },

    // --- VERIFICATION ---
    verified: { type: Boolean, default: false },

    // --- PASSWORD RESET ---
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },

    // --- EMAIL OTP VERIFICATION ---
    otp: { type: String },
    otpExpire: { type: Date },
    isVerified: { type: Boolean, default: false }

}, { timestamps: true }); // Adds createdAt & updatedAt

module.exports = mongoose.model("User", userSchema);
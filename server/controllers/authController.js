const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");
const verifyEmailTemplate = require("../utils/emails/verifyEmail");
const resetPasswordTemplate = require("../utils/emails/resetPasswordEmail");

// --- SIGNUP ---
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, companyEmail } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Basic password strength check
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Prevent admin registration
        if (role === "admin") {
            return res.status(403).json({ message: "You cannot register as admin" });
        }

        // Validate role-specific fields (recruiter)
        if (role === "recruiter" && !companyEmail) {
            return res.status(400).json({ message: "Company email required" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password before saving
        const hashPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashPassword,
            role: role || "student",
            companyEmail,
            otp,
            otpExpire: Date.now() + 5 * 60 * 1000
        });

        await transporter.sendMail({
            to: email,
            subject: "OTP Verification",
            html: verifyEmailTemplate(otp),
        });

        res.status(201).json({
            success: true,
            message: "User registered! OTP sent to email",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error during signup" });
    }
};


// --- VERIFY OTP ---
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        // Check OTP validity and expiration
        if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        res.json({ message: "Account verified successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP" });
    }
};


// --- LOGIN ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check email & password 
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Ensure user is verified 
        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email first" });
        }

        // Generate JWT token (1 day expiry)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
};

// --- LOGOUT ---
exports.logout = (req, res) => {
    res.json({ message: "Logged out successfully" });
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate reset OTP (valid for 10 minutes)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        await transporter.sendMail({
            to: email,
            subject: "Reset Password OTP",
            html: resetPasswordTemplate(otp)
        });

        res.json({ message: "OTP sent to email" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// --- RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Hash new password 
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (error) {
        res.status(500).json({ message: "Reset failed" });
    }
};



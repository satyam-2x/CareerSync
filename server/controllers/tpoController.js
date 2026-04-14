const User = require("../models/User");
const Job = require("../models/Job");


// --- GET ALL STUDENTS ---
exports.getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "student" }).select("-password");
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students" });
    }
};


// --- GET STUDENT BY ID ---
exports.getStudentById = async (req, res) => {
    try {
        const student = await User.findById(req.params.id).select("-password");

        if (!student || student.role !== "student") {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student" });
    }
};


// --- VERIFY STUDENT ---
exports.verifyStudent = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.role !== "student") {
            return res.status(404).json({ message: "Student not found" });
        }

        if (!user.prn) {
            return res.status(400).json({ message: "Student must have PRN" });
        }

        user.verified = true; 
        await user.save();

        res.status(200).json({ success: true, message: "Student verified" });

    } catch (error) {
        res.status(500).json({ message: "Error verifying student" });
    }
};


// --- GET ALL RECRUITERS ---
exports.getAllRecruiters = async (req, res) => {
    try {
        const recruiters = await User.find({ role: "recruiter" }).select("-password");
        res.status(200).json(recruiters);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recruiters" });
    }
};


// --- GET RECRUITER BY ID ---
exports.getRecruiterById = async (req, res) => {
    try {
        const recruiter = await User.findById(req.params.id).select("-password");

        if (!recruiter || recruiter.role !== "recruiter") {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        res.status(200).json(recruiter);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recruiter" });
    }
};


// --- VERIFY RECRUITER ---
exports.verifyRecruiter = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.role !== "recruiter") {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        if (!user.companyEmail) {
            return res.status(400).json({ message: "Company email required" });
        }

        user.verified = true; 
        await user.save();

        res.status(200).json({ success: true, message: "Recruiter verified" });

    } catch (error) {
        res.status(500).json({ message: "Error verifying recruiter" });
    }
};


// --- GET ALL JOBS ---
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("recruiterId", "name companyEmail");

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs" });
    }
};


// --- GET JOB BY ID ---
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("recruiterId", "name companyEmail companyName");

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json(job);

    } catch (error) {
        res.status(500).json({ message: "Error fetching job" });
    }
};


// --- APPROVE JOB ---
exports.approveJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        job.approved = true;
        await job.save();

        res.status(200).json({ success: true, message: "Job approved" });

    } catch (error) {
        res.status(500).json({ message: "Error approving job" });
    }
};


// --- GET STATS ---
exports.getStats = async (req, res) => {
    try {
        const students = await User.countDocuments({ role: "student" });
        const recruiters = await User.countDocuments({ role: "recruiter" });
        const jobs = await Job.countDocuments();

        res.status(200).json({
            students,
            recruiters,
            jobs
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};
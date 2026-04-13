const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
const transporter = require("../utils/mailer");
const jobAppliedTemplate = require("../utils/emails/jobApplied");


// --- GET ALL JOBS ---
exports.getAllJobs = async (req, res) => {
    try {
        const { search } = req.query;

        let query = { approved: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }

        const jobs = await Job.find(query)
            .populate("recruiterId", "companyName");

        res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching jobs" });
    }
};


// --- GET MY APPLICATIONS ---
exports.getMyApplications = async (req, res) => {
    try {
        const studentId = req.user.id;

        const apps = await Application.find({ studentId })
            .populate({
                path: "jobId",
                populate: {
                    path: "recruiterId",
                    select: "companyName"
                }
            });

        res.status(200).json(apps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching applications" });
    }
};


// --- APPLY TO JOB ---
exports.applyJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const studentId = req.user.id;

        // Check if already applied
        const existingApp = await Application.findOne({ jobId, studentId });
        if (existingApp) {
            return res.status(400).json({ message: "Already applied" });
        }

        // Check job availability
        const job = await Job.findById(jobId);
        if (!job || !job.approved) {
            return res.status(400).json({ message: "Job not available" });
        }

        // Ensure resume exists
        const user = await User.findById(studentId);
        if (!user.resume) {
            return res.status(400).json({ message: "Upload resume first" });
        }

        await Application.create({ jobId, studentId });

        const { subject, html } = jobAppliedTemplate(user.name, job.title);

        await transporter.sendMail({
            from: "CareerSync <admin.careersync@gmail.com>",
            to: user.email,
            subject,
            html,
        });

        res.status(201).json({ message: "Applied successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error applying job" });
    }
};


// --- GET JOB BY ID ---
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("recruiterId", "companyName companyEmail companyWebsite");

        if (!job || !job.approved) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching job" });
    }
};
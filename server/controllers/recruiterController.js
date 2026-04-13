const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
const sendMail = require("../utils/mailer");
const applicationStatusTemplate = require("../utils/emails/applicationStatus");

// --- POST JOB ---
exports.postJob = async (req, res) => {
    try {
        const recruiter = await User.findById(req.user.id);

        // Check recruiter verification
        if (!recruiter.verified) {
            return res.status(403).json({
                message: "Only verified recruiters can post jobs"
            });
        }

        const { title, description, requirements, salary, location, jobType, deadline,
            minCgpa, eligibleBatch, eligibleBranches, status } = req.body;

        const newJob = await Job.create({
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            deadline,
            minCgpa,
            eligibleBatch,
            eligibleBranches,
            status,
            recruiterId: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Job posted successfully",
            job: newJob
        });

    } catch (error) {
        res.status(500).json({ message: "Error posting job" });
    }
};


// --- GET MY JOBS ---
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiterId: req.user.id });

        res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching jobs" });
    }
};


// --- UPDATE JOB ---
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check job ownership
        if (job.recruiterId.toString() != req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updateJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            message: "Job updated",
            job: updateJob
        });
    } catch (error) {
        res.status(500).json({ message: "Update error" });
    }
};


// --- DELETE JOB ---
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check job ownership
        if (job.recruiterId.toString() != req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Job.findByIdAndDelete(req.params.id);

        // Delete all related applications
        await Application.deleteMany({ jobId: req.params.id });

        res.json({
            success: true,
            message: "Job and applications deleted"
        });
    } catch (error) {
        res.status(500).json({ message: "Delete error" });
    }
};


// --- GET APPLICANTS ---
exports.getApplicants = async (req, res) => {
    try {
        const applicants = await Application.find({
            jobId: req.params.id,
            status: { $ne: "deleted" }
        }).populate("studentId", "name email branch cgpa resume");

        // Filter out deleted users
        const filtered = applicants.filter(app => app.studentId != null);

        res.json({
            success: true,
            count: filtered.length,
            applicants: filtered
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching applicants" });
    }
};


// --- UPDATE APPLICATION STATUS ---
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const app = await Application.findById(id);

        if (!app) {
            return res.status(404).json({ message: "Application not found" });
        }

        const job = await Job.findById(app.jobId);

        // Verify recruiter authorization
        if (job.recruiterId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Update application status
        app.status = status;
        await app.save();

        const user = await User.findById(app.studentId);

        // send email notification
        try {
            const template = applicationStatusTemplate(
                user.name,
                job.title,
                status
            );

            await sendMail(
                user.email,
                template.subject,
                template.html
            );
        } catch (e) {
            console.log("Mail error:", e.message);
        }

        res.json({ message: "Status updated", app });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating status" });
    }
};

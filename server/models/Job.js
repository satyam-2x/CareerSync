const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

    // List of required skills/criteria
    requirements: [{ type: String }],

    salary: { type: String },
    location: { type: String },

    // Minimum CGPA required
    minCgpa: { type: Number, default: 0 },


    eligibleBatch: [{ type: String }],
    eligibleBranches: [{ type: String }],

    // Job status: open | closed | expired
    status: {
        type: String,
        enum: ["open", "closed", "expired"],
        default: "open"
    },

    // Job type: full-time | internship | remote
    jobType: {
        type: String, enum: ["full-time", "internship", "remote"],
        default: "full-time"
    },

    deadline: { type: Date },

    // Admin approval status
    approved: { type: Boolean, default: false },

    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true }); // Adds createdAt & updatedAt


module.exports = mongoose.model("Job", jobSchema);
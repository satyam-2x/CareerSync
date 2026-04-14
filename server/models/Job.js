const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

    requirements: [{ type: String }],

    salary: { type: String },
    location: { type: String },

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
        type: String,
        enum: ["full-time", "internship", "remote"],
        default: "full-time"
    },

    deadline: { type: Date },

    approved: { type: Boolean, default: false },

    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });


module.exports = mongoose.model("Job", jobSchema);
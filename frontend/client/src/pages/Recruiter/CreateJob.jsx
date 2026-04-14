import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/recruiterService";

function CreateJob() {
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "full-time",
    deadline: "",
    minCgpa: "",
    eligibleBatch: "",
    eligibleBranches: "",
    status: "open",
  });

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.salary || !form.location || !form.deadline) {
      setMessage("Please fill all required fields");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await createJob({
        ...form,
        requirements: form.requirements
          ? form.requirements.split(",").map((r) => r.trim())
          : [],
        eligibleBatch: form.eligibleBatch
          ? form.eligibleBatch.split(",").map((b) => b.trim())
          : [],
        eligibleBranches: form.eligibleBranches
          ? form.eligibleBranches.split(",").map((br) => br.trim())
          : [],
        minCgpa: Number(form.minCgpa) || 0,
      },
        token
      );

      setMessage("Job created successfully");
      setType("success");
      setTimeout(() => navigate("/my-jobs"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating job");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Create Job</h2>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm text-center ${type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {message}
          </div>
        )}

        <input
          className="w-full border px-4 py-2 rounded-lg mt-4 focus:ring-2 focus:ring-blue-500"
          name="title"
          placeholder="Title *"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          className="w-full border px-4 py-2 rounded-lg mt-3 focus:ring-2 focus:ring-blue-500"
          name="description"
          placeholder="Description *"
          rows="3"
          value={form.description}
          onChange={handleChange}
        />

        <input
          className="w-full border px-4 py-2 rounded-lg mt-3 focus:ring-2 focus:ring-blue-500"
          name="requirements"
          placeholder="Skills (React, Node, MongoDB)"
          value={form.requirements}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-3 mt-3">
          <input
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            name="salary"
            placeholder="Salary (e.g. 12 LPA) *"
            value={form.salary}
            onChange={handleChange}
          />
          <input
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            name="location"
            placeholder="Location *"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <input
            type="number"
            step="0.01"
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            name="minCgpa"
            placeholder="Min CGPA (e.g. 7.5)"
            value={form.minCgpa}
            onChange={handleChange}
          />
          <input
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            name="eligibleBatch"
            placeholder="Batch (e.g. 2025, 2026)"
            value={form.eligibleBatch}
            onChange={handleChange}
          />
        </div>

        <input
          className="w-full border px-4 py-2 rounded-lg mt-3 focus:ring-2 focus:ring-blue-500"
          name="eligibleBranches"
          placeholder="Branches (e.g. CSE, IT, ECE)"
          value={form.eligibleBranches}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-3 mt-3">
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="full-time">Full-Time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg mt-3"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6 hover:bg-blue-700 transition font-medium"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </div>
    </div>
  );
}

export default CreateJob;
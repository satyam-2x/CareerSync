import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateJob } from "../../services/recruiterService";
import { getRecruiterJobById } from "../../services/recruiterService";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
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

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

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

  useEffect(() => {
    const fetchJob = async () => {
      try {

        const token = localStorage.getItem("token");

        const res = await getRecruiterJobById(id, token);
        
        const job = res.data;
        setForm({
          title: job.title || "",
          description: job.description || "",
          requirements: job.requirements?.join(", ") || "",
          salary: job.salary || "",
          location: job.location || "",
          jobType: job.jobType || "full-time",
          deadline: job.deadline?.split("T")[0] || "",
          minCgpa: job.minCgpa || "",
          eligibleBatch: job.eligibleBatch?.join(", ") || "",
          eligibleBranches: job.eligibleBranches?.join(", ") || "",
          status: job.status || "open",
        });

      } catch {
        setMessage("Error fetching job details");
        setType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!form.title || !form.description || !form.salary || !form.location) {
      setMessage("Please fill required fields");
      setType("error");
      return;
    }

    try {
      setUpdating(true);

      const token = localStorage.getItem("token");

      await updateJob(id, {
        ...form,
        requirements: form.requirements ? form.requirements.split(",").map(r => r.trim()) : [],
        eligibleBatch: form.eligibleBatch ? form.eligibleBatch.split(",").map(b => b.trim()) : [],
        eligibleBranches: form.eligibleBranches ? form.eligibleBranches.split(",").map(br => br.trim()) : [],
        minCgpa: Number(form.minCgpa) || 0
      },
        token
      );

      setMessage("Job updated successfully");
      setType("success");
      setTimeout(() => navigate("/my-jobs"), 1000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating job");
      setType("error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading job details...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Edit Job</h2>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
            {message}
          </div>
        )}

        <div className="mt-4 space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase">Job Title</label>
          <input className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500" name="title" value={form.title} onChange={handleChange} placeholder="Title *" />

          <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
          <textarea className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500" name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Description *" />

          <label className="text-xs font-bold text-gray-500 uppercase">Requirements (Skills)</label>
          <input className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500" name="requirements" value={form.requirements} onChange={handleChange} placeholder="React, Node, MongoDB" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Salary</label>
              <input className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500" name="salary" value={form.salary} onChange={handleChange} placeholder="Salary *" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
              <input className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500" name="location" value={form.location} onChange={handleChange} placeholder="Location *" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Min CGPA</label>
              <input type="number" step="0.01" className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500" name="minCgpa" value={form.minCgpa} onChange={handleChange} placeholder="e.g. 7.5" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Batch</label>
              <input className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500" name="eligibleBatch" value={form.eligibleBatch} onChange={handleChange} placeholder="e.g. 2025, 2026" />
            </div>
          </div>

          <label className="text-xs font-bold text-gray-500 uppercase">Eligible Branches</label>
          <input className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500" name="eligibleBranches" value={form.eligibleBranches} onChange={handleChange} placeholder="e.g. CSE, IT, ECE" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Job Type</label>
              <select name="jobType" value={form.jobType} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg">
                <option value="full-time">Full-time</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Job Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg font-semibold">
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <label className="text-xs font-bold text-gray-500 uppercase">Deadline</label>
          <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" />
        </div>

        <button onClick={handleUpdate} disabled={updating} className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6">
          {updating ? "Updating..." : "Update Job"}
        </button>
      </div>
    </div>
  );
}

export default EditJob;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/recruiterService";

function CreateJob() {
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
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      setMessage("Fill required fields");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      await createJob(form, localStorage.getItem("token"));

      setMessage("Job created");
      setType("success");

      setTimeout(() => navigate("/my-jobs"), 1000);

    } catch {
      setMessage("Error creating job");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">

      <h2 className="text-xl text-center">Create Job</h2>

      {message && <p className="text-center mt-2">{message}</p>}

      <input name="title" placeholder="Title" onChange={handleChange} className="w-full mt-3 border p-2" />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full mt-3 border p-2" />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-4 bg-blue-600 text-white py-2"
      >
        {loading ? "Posting..." : "Post Job"}
      </button>

    </div>
  );
}

export default CreateJob;
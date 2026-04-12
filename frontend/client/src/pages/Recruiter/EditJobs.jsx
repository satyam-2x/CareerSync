import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateJob } from "../../services/recruiterService";
import { getJobById } from "../../services/jobService";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Auto-clear message
  useEffect(() => {
    const fetch = async () => {
      const res = await getJobById(id);
      setForm(res.data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await updateJob(id, form, localStorage.getItem("token"));
      navigate("/my-jobs");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">

      <h2 className="text-xl text-center">Edit Job</h2>

      <input name="title" value={form.title} onChange={handleChange} className="w-full mt-3 border p-2" />

      <button
        onClick={handleUpdate}
        disabled={updating}
        className="w-full mt-4 bg-blue-600 text-white py-2"
      >
        {updating ? "Updating..." : "Update"}
      </button>

    </div>
  );
}

export default EditJob;
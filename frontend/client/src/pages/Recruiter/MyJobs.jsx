import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyJobs, deleteJob } from "../../services/recruiterService";

function MyJobs() {
  const navigate = useNavigate();

  // State management
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [deleteId, setDeleteId] = useState(null);

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

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyJobs(token);
        setJobs(res.data.jobs);
      } catch {
        setMessage("Error loading jobs");
        setType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Delete job
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await deleteJob(deleteId, token);

      setJobs(jobs.filter((job) => job._id !== deleteId));
      setMessage("Job deleted");
      setType("success");

    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting job");
      setType("error");

    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading jobs...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          My Jobs
        </h2>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
            type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {jobs.length === 0 ? (
          <p className="text-center mt-6">No jobs posted yet</p>
        ) : (
          <div className="mt-6 space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-4 rounded-xl shadow-md">

                <h3 className="font-semibold">{job.title}</h3>

                <p className="text-sm text-gray-600">
                  Location: {job.location || "N/A"}
                </p>

                <p className="text-sm mt-1">
                  Status:{" "}
                  <span className={job.approved ? "text-green-600" : "text-yellow-500"}>
                    {job.approved ? "Approved" : "Pending"}
                  </span>
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => navigate(`/edit-job/${job._id}`)}
                    className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(job._id)}
                    className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                    className="flex-1 bg-gray-200 py-1.5 rounded-lg text-sm hover:bg-gray-300"
                  >
                    Applicants
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 text-center">

            <p className="mb-4">
              Are you sure you want to delete this job?
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Yes
              </button>

              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default MyJobs;
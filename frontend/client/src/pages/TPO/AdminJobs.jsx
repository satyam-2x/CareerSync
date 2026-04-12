import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAdminJobs } from "../../services/adminService";

function Jobs() {
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const token = localStorage.getItem("token");
  const query = new URLSearchParams(location.search);
  const recruiterId = query.get("recruiter");

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
        const res = await getAdminJobs(recruiterId, token);
        setJobs(res.data);
      } catch {
        setMessage("Error fetching jobs");
        setType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [recruiterId, token]); // added token

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading jobs...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          All Jobs
        </h2>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
            type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {jobs.length === 0 ? (
          <p className="text-center mt-6 text-gray-500">
            No jobs found
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {jobs.map((j) => (
              <div
                key={j._id}
                className="bg-white p-4 rounded-xl shadow-md"
              >
                <p className="font-semibold text-gray-800">
                  {j.title}
                </p>

                <p className="text-sm mt-1">
                  Status:{" "}
                  <span className={
                    j.approved
                      ? "text-green-600"
                      : "text-yellow-500"
                  }>
                    {j.approved ? "Approved" : "Pending"}
                  </span>
                </p>

                <button
                  onClick={() => navigate(`/admin/jobs/${j._id}`)}
                  className="mt-3 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Jobs;
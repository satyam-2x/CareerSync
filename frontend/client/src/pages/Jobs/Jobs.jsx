import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs } from "../../services/jobService"; // ✅ correct

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchJobs = async () => {
    try {
      const res = await getJobs(search); 
      setJobs(res.data);
    } catch (err) {
      setMessage("Error fetching jobs");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  if (loading) {
    return <p className="text-center mt-10">Loading jobs...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
        Available Jobs
      </h2>

      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mx-auto block mb-6 p-2 border rounded"
      />

      {message && (
        <p className={`text-center mb-4 ${type === "error" ? "text-red-500" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {jobs.length === 0 ? (
        <p className="text-center">No jobs available</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-5 rounded-lg border shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {job.title}
              </h3>

              <p className="text-gray-600 mt-1">
                {job.recruiterId?.companyName || "N/A"}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                💼 {job.jobType || "N/A"}
              </p>

              <p className="text-gray-500 text-sm mt-3">
                {job.description?.slice(0, 80)}...
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="text-blue-600 font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;
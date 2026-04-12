import { useEffect, useState } from "react";
import { getStats } from "../../services/adminService";

function Stats() {
  const token = localStorage.getItem("token");

  // State management
  const [data, setData] = useState({
    students: 0,
    recruiters: 0,
    jobs: 0
  });
  const [loading, setLoading] = useState(true);
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

  // Fetch stats
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getStats(token);
        setData(res.data);
      } catch {
        setMessage("Error fetching stats");
        setType("error");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [token]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading stats...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Stats
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

        <div className="mt-6 space-y-3">

          <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
            <span className="text-gray-600">Students</span>
            <span className="font-semibold text-gray-800">{data.students}</span>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
            <span className="text-gray-600">Recruiters</span>
            <span className="font-semibold text-gray-800">{data.recruiters}</span>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
            <span className="text-gray-600">Jobs</span>
            <span className="font-semibold text-gray-800">{data.jobs}</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Stats;
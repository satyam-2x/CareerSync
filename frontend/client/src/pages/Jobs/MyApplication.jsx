import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/jobService";

function MyApplications() {
  // State management
  const [apps, setApps] = useState([]);
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

  // Fetch applications
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyApplications(localStorage.getItem("token"));
        setApps(res.data);
      } catch (err) {
        setMessage("Error fetching applications");
        setType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading applications...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
        My Applications
      </h2>

      {message && (
        <p className={`text-center mb-4 ${
          type === "error" ? "text-red-500" : "text-green-600"
        }`}>
          {message}
        </p>
      )}

      {apps.length === 0 ? (
        <p className="text-center text-gray-600">No applications yet</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {apps.map((app) => {
            let statusStyle = "";
            let statusText = "";

            if (app.status === "accepted") {
              statusStyle = "text-green-600 bg-green-100";
              statusText = "Accepted";
            } else if (app.status === "rejected") {
              statusStyle = "text-red-600 bg-red-100";
              statusText = "Rejected";
            } else {
              statusStyle = "text-yellow-600 bg-yellow-100";
              statusText = "Pending";
            }

            return (
              <div
                key={app._id}
                className="bg-white p-5 rounded-lg border shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {app.jobId?.title || "Job Title N/A"}
                </h3>

                <p className="text-gray-600 mt-1">
                  {app.jobId?.recruiterId?.companyName || "N/A"}
                </p>

                <div className="mt-3">
                  <span className={`px-3 py-1 text-sm rounded-full ${statusStyle}`}>
                    {statusText}
                  </span>
                </div>

                {app.createdAt && (
                  <p className="text-sm text-gray-500 mt-3">
                    Applied on: {new Date(app.createdAt).toDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default MyApplications;
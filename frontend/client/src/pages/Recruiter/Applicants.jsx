import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicants, updateApplicationStatus } from "../../services/recruiterService"; // ✅ ADD

function Applicants() {
  const { id } = useParams();

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

  // Fetch applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getApplicants(id, token);
        setApps(res.data.applicants);
      } catch {
        setMessage("Error loading applicants");
        setType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id]);

  // Update status
  const updateStatus = async (appId, status) => {
    try {
      const token = localStorage.getItem("token");
      await updateApplicationStatus(
        appId,
        { status }, token);

      setApps(apps.map(app =>
        app._id === appId ? { ...app, status } : app
      ));

      setMessage(`Application ${status}`);
      setType("success");

    } catch {
      setMessage("Error updating status");
      setType("error");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading applicants...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">

      <div className="w-full max-w-3xl">

        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Applicants
        </h2>

        {/* Message */}
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

        {apps.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            No applicants yet
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {apps.map((app) => (
              <div
                key={app._id}
                className="bg-white p-4 rounded-xl shadow-md"
              >
                <h3 className="font-semibold text-gray-800">
                  {app.studentId?.name || "N/A"}
                </h3>

                <p className="text-sm text-gray-600">
                  Email: {app.studentId?.email || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Branch: {app.studentId?.branch || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  CGPA: {app.studentId?.cgpa || "N/A"}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Resume:{" "}
                  {app.studentId?.resume ? (
                    <a
                      href={app.studentId.resume + "#toolbar=0&navpanes=0&scrollbar=0"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    "Not uploaded"
                  )}
                </p>

                <p className="mt-2 text-sm font-medium">
                  Status:{" "}
                  <span
                    className={`${app.status === "accepted"
                      ? "text-green-600"
                      : app.status === "rejected"
                        ? "text-red-500"
                        : "text-gray-500"
                      }`}
                  >
                    {app.status}
                  </span>
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => updateStatus(app._id, "accepted")}
                    disabled={app.status === "accepted"}
                    className="flex-1 bg-green-600 text-white py-1.5 rounded-lg text-sm hover:bg-green-700 transition disabled:bg-gray-300"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    disabled={app.status === "rejected"}
                    className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-sm hover:bg-red-600 transition disabled:bg-gray-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applicants;
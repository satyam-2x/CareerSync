import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicants, updateApplicationStatus } from "../../services/recruiterService";

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
        const res = await getApplicants(id, localStorage.getItem("token"));
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
      await updateApplicationStatus(
        appId,
        { status },
        localStorage.getItem("token")
      );

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

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading applicants...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl">

        <h2 className="text-2xl font-semibold text-center">
          Applicants
        </h2>

        {message && (
          <div className={`mt-4 p-3 text-center ${
            type === "success" ? "text-green-600" : "text-red-500"
          }`}>
            {message}
          </div>
        )}

        {apps.map((app) => (
          <div key={app._id} className="bg-white p-4 mt-4 rounded-xl shadow-md">

            <h3>{app.studentId?.name}</h3>

            <p>Email: {app.studentId?.email}</p>
            <p>Branch: {app.studentId?.branch}</p>
            <p>CGPA: {app.studentId?.cgpa}</p>

            <p className="mt-2">
              Status:{" "}
              <span className={
                app.status === "accepted"
                  ? "text-green-600"
                  : app.status === "rejected"
                  ? "text-red-500"
                  : "text-gray-500"
              }>
                {app.status}
              </span>
            </p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => updateStatus(app._id, "accepted")}
                disabled={app.status === "accepted"}
                className="flex-1 bg-green-600 text-white py-1.5 rounded-lg disabled:opacity-50"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(app._id, "rejected")}
                disabled={app.status === "rejected"}
                className="flex-1 bg-red-500 text-white py-1.5 rounded-lg disabled:opacity-50"
              >
                Reject
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Applicants;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecruiterById, verifyRecruiter } from "../../services/adminService";

function RecruiterDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // State management
  const [rec, setRec] = useState(null);
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

  // Fetch recruiter
  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const res = await getRecruiterById(id, token);
        setRec(res.data);
      } catch {
        setMessage("Error fetching recruiter");
        setType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiter();
  }, [id, token]);

  // Verify recruiter
  const verify = async () => {
    try {
      await verifyRecruiter(id, token);

      setRec({ ...rec, verified: true });
      setMessage("Recruiter verified");
      setType("success");

    } catch (error) {
      setMessage(error.response?.data?.message || "Error verifying recruiter");
      setType("error");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading recruiter...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="bg-white p-5 rounded-2xl shadow-md w-full max-w-md">

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${type === "success"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}>
            {message}
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-800">
          {rec.companyName || "N/A"}
        </h2>

        <p className="mt-2 text-sm">
          Email: {rec.companyEmail || "N/A"}
        </p>

        <p className="text-sm">
          Contact: {rec.contactNumber || "N/A"}
        </p>

        <p>
          Website:{" "}
          {rec.companyWebsite ? (
            <a
              href={rec.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {rec.companyWebsite}
            </a>
          ) : (
            "N/A"
          )}
        </p>

        <p className="mt-3 text-sm">
          Status:{" "}
          <span className={
            rec.verified ? "text-green-600" : "text-yellow-500"
          }>
            {rec.verified ? "Verified" : "Pending"}
          </span>
        </p>

        {!rec.verified && (
          <button
            onClick={verify}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Verify Recruiter
          </button>
        )}

      </div>
    </div>
  );
}

export default RecruiterDetails;
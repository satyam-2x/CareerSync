import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents } from "../../services/adminService";

function Students() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State management
  const [students, setStudents] = useState([]);
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

  // Fetch students
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getStudents(token);
        setStudents(res.data);
      } catch {
        setMessage("Error fetching students");
        setType("error");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [token]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading students...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Students
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

        {students.length === 0 ? (
          <p className="text-center mt-6 text-gray-500">
            No students found
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {students.map((s) => (
              <div
                key={s._id}
                className="bg-white p-4 rounded-xl shadow-md"
              >
                <p className="font-semibold text-gray-800">
                  {s.name}
                </p>

                <p className="text-sm mt-1">
                  Status:{" "}
                  <span className={
                    s.verified
                      ? "text-green-600"
                      : "text-yellow-500"
                  }>
                    {s.verified ? "Verified" : "Pending"}
                  </span>
                </p>

                <button
                  onClick={() => navigate(`/admin/students/${s._id}`)}
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

export default Students;
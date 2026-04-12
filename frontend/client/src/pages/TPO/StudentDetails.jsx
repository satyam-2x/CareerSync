import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentById, verifyStudent } from "../../services/adminService";

function StudentDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // State management
  const [student, setStudent] = useState(null);
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

  // Fetch student
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getStudentById(id, token);
        setStudent(res.data);
      } catch {
        setMessage("Error fetching student");
        setType("error");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id, token]);

  // Verify student
  const verify = async () => {
    try {
      await verifyStudent(id, token);

      setStudent({ ...student, verified: true });
      setMessage("Student verified");
      setType("success");

    } catch {
      setMessage("Error verifying student");
      setType("error");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading student...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="bg-white p-5 rounded-2xl shadow-md w-full max-w-md">

        {message && (
          <div className={`mb-3 p-2 rounded-lg text-sm text-center ${
            type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-800">
          {student.name || "N/A"}
        </h2>

        <div className="mt-2 text-sm text-gray-600">
          <p>Email: {student.email || "N/A"}</p>
        </div>

        <p className="mt-2 text-sm">
          Status:{" "}
          <span className={
            student.verified ? "text-green-600" : "text-yellow-500"
          }>
            {student.verified ? "Verified" : "Pending"}
          </span>
        </p>

        {!student.verified && (
          <button
            onClick={verify}
            className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Verify Student
          </button>
        )}

      </div>
    </div>
  );
}

export default StudentDetails;
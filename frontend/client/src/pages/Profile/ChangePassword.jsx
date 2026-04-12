import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/userService";

function ChangePassword() {
  const navigate = useNavigate();

  // State management
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: ""
  });
  const [loading, setLoading] = useState(false);
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

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!form.oldPassword || !form.newPassword) {
      setMessage("Please fill all fields");
      setType("error");
      return;
    }

    if (form.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      setType("error");
      return;
    }

    if (form.oldPassword === form.newPassword) {
      setMessage("New password must be different");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await changePassword(
        form,
        localStorage.getItem("token")
      );

      setMessage(res.data.message || "Password updated");
      setType("success");

      setTimeout(() => navigate("/profile"), 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating password");
      setType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Change Password
        </h2>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
            type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={form.oldPassword}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg mt-4"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg mt-3"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full text-sm text-gray-500 mt-3"
        >
          Back to Profile
        </button>

      </div>
    </div>
  );
}

export default ChangePassword;
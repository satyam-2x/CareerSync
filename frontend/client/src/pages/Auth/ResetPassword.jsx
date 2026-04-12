import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;

  // State management
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: emailFromState || "",
    otp: "",
    password: ""
  });

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

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle reset password
  const handleSubmit = async () => {
    if (!form.otp || !form.password) {
      setMessage("Please fill all fields");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword(form);

      setMessage(res.data.message || "Password reset successful");
      setType("success");

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error");
      setType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">

        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        {message && (
          <p className={`mb-3 text-sm text-center ${
            type === "error" ? "text-red-500" : "text-green-600"
          }`}>
            {message}
          </p>
        )}

        <input
          type="email"
          value={form.email}
          readOnly
          className="w-full border p-2 rounded mb-3 bg-gray-100"
        />

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          name="password"
          placeholder="New Password"
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset"}
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
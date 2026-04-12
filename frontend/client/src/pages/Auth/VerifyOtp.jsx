import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../../services/authService";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;

  // State management
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: emailFromState || "",
    otp: ""
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

  // Handle OTP verification
  const handleSubmit = async () => {
    if (!form.otp) {
      setMessage("Enter OTP");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      await verifyOtp(form);

      setMessage("Account verified successfully");
      setType("success");

      // Redirect to login
      setTimeout(() => navigate("/login"), 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error");
      setType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Verify OTP
        </h2>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm text-center ${
              type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <input
          className="w-full border px-4 py-2 rounded-lg mt-4 bg-gray-100 cursor-not-allowed"
          type="email"
          value={form.email}
          readOnly
        />

        <input
          className="w-full border px-4 py-2 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="otp"
          placeholder="Enter OTP"
          value={form.otp}
          onChange={handleChange}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition disabled:opacity-50"
          onClick={handleSubmit}
          type="button"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;
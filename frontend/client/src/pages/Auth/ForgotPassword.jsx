import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  // State management
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle form submission
  const handleSubmit = async () => {
    if (loading) return;

    if (!email) {
      setMessage("Please enter your email");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await forgotPassword({ email });

      setMessage(res.data.message || "OTP sent");
      setType("success");

      // Redirect to reset password page
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
      setType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">

        <h2 className="text-xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        {message && (
          <p
            className={`mb-3 text-sm text-center ${
              type === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <input
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;
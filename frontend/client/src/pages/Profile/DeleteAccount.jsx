import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../../services/userService";

function DeleteAccount() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async () => {
    if (!password.trim()) {
      setMessage("Please enter your password");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await deleteAccount(
        { password: password.trim() },
        localStorage.getItem("token")
      );
      
      setMessage(res.data.message || "Account deleted");
      setType("success");

      localStorage.clear();
      setTimeout(() => navigate("/signup"), 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting account");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-semibold text-center text-red-600">
          Delete Account
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2">
          This action cannot be undone.
        </p>

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

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded-lg mt-4 hover:bg-red-700 transition"
        >
          {loading ? "Processing..." : "Delete Account"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full text-sm text-gray-500 mt-3 hover:underline"
        >
          Go Back
        </button>

      </div>
    </div>
  );
}

export default DeleteAccount;
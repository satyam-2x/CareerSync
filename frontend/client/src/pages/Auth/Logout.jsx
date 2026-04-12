import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService"; 

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await logoutUser(token); // call backend logout
      }
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      // clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect to login
      navigate("/login");
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
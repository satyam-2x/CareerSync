import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(userData);

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
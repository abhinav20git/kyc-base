import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // const token="df";
  const token = localStorage.getItem("token"); // or use context/state

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
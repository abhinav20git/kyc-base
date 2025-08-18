import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  // Check if token exists and is not undefined/null string
  if (!token || token === 'undefined' || token === 'null') {
    // Redirect to login with the current location so user can be redirected back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: You can add token validation here
  // For example, check if token is expired by decoding JWT
  
  return children;
};

export default ProtectedRoute;
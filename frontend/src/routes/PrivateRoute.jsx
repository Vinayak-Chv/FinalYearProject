import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoutes = [] }) => {
  const { user, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  // If user didn't logged in -> redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoutes.length > 0 && !allowedRoutes.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If everything is good show the page
  return <Outlet />;
};

export default PrivateRoute;

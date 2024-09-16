import { useAuth } from "../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const RequireAuth = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); // Extract loading state from context
  const [isLoading, setIsLoading] = useState(true); // Local state for loading

  useEffect(() => {
    // Wait for loading to complete before checking auth status
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  if (isLoading) {
    return <div>Loading...</div>; // Or use a spinner
  }

  if (!user) {
    console.log("User is not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("User role not allowed, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;

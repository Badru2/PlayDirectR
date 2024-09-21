import { useAuth } from "../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const RequireAuth = ({ allowedRoles, publicPage }) => {
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

  // Redirect authenticated users away from public pages (login, register)
  if (user && publicPage) {
    console.log("Authenticated user, redirecting to dashboard");

    if (user.role === "superAdmin") {
      return <Navigate to="/super-admin/dashboard" replace />;
    } else if (user.role === "adminSales" || user.role === "adminStorage") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "user") {
      return <Navigate to="/" replace />;
    }
  }

  // If not authenticated and accessing a protected page, redirect to login
  if (!user && !publicPage) {
    console.log("User is not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not allowed for the protected route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("User role not allowed, redirecting to unauthorized");

    if (user.role === "superAdmin") {
      return <Navigate to="/super-admin/dashboard" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "user") {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default RequireAuth;

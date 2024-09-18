import { useState, useEffect, useContext, createContext, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially user is null
  const [loading, setLoading] = useState(true); // Loading state to prevent premature redirects
  const navigate = useNavigate();

  // Fetch the user profile from the backend after login or on app load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/auth/profile");
        console.log("Profile response:", response.data.user); // Debugging
        setUser(response.data.user); // Set the user state with profile data
      } catch (error) {
        console.error("Error fetching profile:", error); // Debugging
        setUser(null); // If there's an error, ensure user is set to null
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    };

    fetchProfile(); // Run on app load
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      console.log("Login successful:", response.data); // Debugging
      setUser(response.data.user); // Set user data on login

      // switch (response.data.user.role) {
      //   case "super-admin":
      //     window.location.href = "/super-admin/dashboard";
      //     break;
      //   case "admin":
      //     window.location.href = "/admin/dashboard";
      //     break;
      //   case "user":
      //     window.location.href = "/";
      //     break;
      //   default:
      //     console.error("Unknown role:", data.role);
      //     break;
      // }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null); // Clear the user state on logout
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Include loading in useMemo dependencies to prevent stale state issues
  const value = useMemo(
    () => ({ user, login, logout, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// src/components/Profile.js
import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user profile from protected route
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/auth/profile", {
          headers: {
            Authorization: localStorage.getItem("token"), // Or use cookies
          },
        });
        setUser(response.data.user); // Set user data from response
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Profile;

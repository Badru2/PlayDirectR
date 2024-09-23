import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAdmin, deleteAdmin, getAdmins } from "../../store/adminSlice";
import axios from "axios";

const AdminCRUD = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminOpen, setAdminOpen] = useState(true); // Manage accordion open state for admins
  const [userOpen, setUserOpen] = useState(true); // Manage accordion open state for users
  const [isEditing, setIsEditing] = useState(false); // To track edit mode
  const [editingAdmin, setEditingAdmin] = useState(null); // To store the admin being edited

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/auth/get/users");

      // Filter role admin
      const admins = response.data.filter(
        (admin) => admin.role === "adminSales"
      );

      // Filter role user
      const users = response.data.filter((user) => user.role === "user");

      setAdmins(admins);
      setUsers(users);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update admin
      axios
        .put(`/api/auth/update/${editingAdmin.id}`, formData)
        .then(() => {
          fetchData(); // Refresh the data after updating
          setIsEditing(false); // Reset edit mode
          setFormData({
            username: "",
            email: "",
            password: "",
            role: "adminSales",
          });
        })
        .catch((error) => console.error("Error updating admin:", error));
    } else {
      // Create new admin
      dispatch(createAdmin(formData)).then(() => {
        fetchData();
      });
      setFormData({ username: "", email: "", password: "", role: "admin" });
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex space-x-3">
          <div className="w-1/4">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md p-3 space-y-3"
            >
              <h1 className="text-xl font-bold">
                {isEditing ? "Edit Admin" : "Create Admin"}
              </h1>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full p-3 border border-gray-500 rounded-sm"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border border-gray-500 rounded-sm"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-3 border border-gray-500 rounded-sm"
              />

              <select
                name="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full p-3 border border-gray-500 rounded-sm"
              >
                <option value="adminSales">Admin Sales</option>
                <option value="adminStorage">Admin Storage</option>
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold w-full rounded-sm"
              >
                {isEditing ? "Update Admin" : "Create Admin"}
              </button>
            </form>
          </div>

          <div className="w-3/4">
            <table className="w-full table bg-white rounded-sm shadow-md">
              {/* Admins Accordion */}
              <tr className="font-bold text-xl bg-gray-500 cursor-pointer">
                <td
                  colSpan={4}
                  className="text-white"
                  onClick={() => setAdminOpen(!adminOpen)}
                >
                  Admins {adminOpen ? "▼" : "▲"}
                </td>
              </tr>

              {adminOpen && (
                <>
                  <tr className="bg-gray-200">
                    <td>Username</td>
                    <td>Email</td>
                    <td>Role</td>
                    <td>Action</td>
                  </tr>

                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>{admin.username}</td>
                      <td>{admin.email}</td>
                      <td>{admin.role}</td>
                      <td className="flex space-x-3">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setFormData({
                              username: admin.username,
                              email: admin.email,
                              password: "", // Do not fill the password
                              role: admin.role,
                            });
                            setEditingAdmin(admin);
                          }}
                          className="bg-yellow-400 rounded-sm font-bold text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            dispatch(deleteAdmin(admin.id));
                            fetchData();
                          }}
                          className="bg-red-500 rounded-sm font-bold text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              )}

              {/* Users Accordion */}
              <tr className="font-bold text-xl bg-gray-500 text-white cursor-pointer">
                <td colSpan={4} onClick={() => setUserOpen(!userOpen)}>
                  Users {userOpen ? "▼" : "▲"}
                </td>
              </tr>

              {userOpen && (
                <>
                  <tr className="bg-gray-200">
                    <td>Username</td>
                    <td>Email</td>
                    <td colSpan={2}>Role</td>
                  </tr>

                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                    </tr>
                  ))}
                </>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCRUD;

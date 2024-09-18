import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", formData);

      // Dispatch login success and store user data in Redux
      dispatch(loginSuccess(response.data));

      // Fetch user data after successful login
      // const responseUser = await axios.get("/api/auth/profile", {
      //   headers: {
      //     Authorization: `Bearer ${response.data.token}`,
      //   },
      // });

      // const userData = responseUser.data.user;

      // Redirect based on the user's role directly here
      // if (userData.role === "superAdmin") {
      //   navigate("/super-admin/dashboard");
      // } else if (userData.role === "admin") {
      //   navigate("/admin/dashboard");
      // } else {
      //   navigate("/");
      // }
      window.location.reload();
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="bg-white shadow-md">
      <form onSubmit={handleSubmit} className=" p-4 space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white">
          Login
        </button>
      </form>

      <div className="p-4 text-center">
        Don't have an account?
        <br />
        <Link to="/register" className="font-bold text-blue-500">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;

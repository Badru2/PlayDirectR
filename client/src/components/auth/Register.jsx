import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register the user
      const registerResponse = await axios.post("/api/auth/register", formData);
      // alert(registerResponse.data.message);

      // Automatic login after registration
      const loginResponse = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Dispatch login success and store user data in Redux
      dispatch(loginSuccess(loginResponse.data.user));

      // Redirect based on the role
      // if (loginResponse.data.role === "superAdmin") {
      //   navigate("/super-admin/dashboard");
      // } else if (loginResponse.data.role === "admin") {
      //   navigate("/admin/dashboard");
      // } else {
      // }

      window.location.reload();
      navigate("/");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="bg-white shadow-md ">
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-500 rounded-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-500 rounded-sm"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-500 rounded-sm"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-sm"
        >
          Register
        </button>
      </form>

      <div className="p-4 text-center">
        Already have an account? <br />
        <Link to={"/login"} className="text-blue-500 font-bold">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;

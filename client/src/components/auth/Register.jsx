import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/authSlice";
import validator from "validator";
import Toast from "../../components/themes/alert";
import { Helmet } from "react-helmet";

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

  const fetchUser = async (username) => {
    try {
      const response = await axios.get(`/api/auth/users?username=${username}`);
      return response.data.exists; // Assuming your API returns a boolean indicating existence
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate duplicate username
    const isUsernameTaken = await fetchUser(formData.username);
    if (isUsernameTaken) {
      Toast.fire({
        icon: "error",
        title: "Username already exists",
      });
      return;
    }

    // Validate email
    if (!validator.isEmail(formData.email)) {
      Toast.fire({
        icon: "error",
        title: "Please enter a valid email address",
      });
      return;
    }

    try {
      // Register the user
      await axios.post("/api/auth/register", formData);

      // Automatic login after registration
      const loginResponse = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Dispatch login success and store user data in Redux
      dispatch(loginSuccess(loginResponse.data.user));

      // Redirect based on the role
      navigate("/");

      // Optional: Refresh the page after registration
      window.location.reload();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || "An error occurred",
      });
    }
  };

  return (
    <div className="bg-transparent backdrop-blur-sm shadow-md">
      <Helmet>
        <title>PlayDirect | Register</title>
      </Helmet>
      <form onSubmit={handleSubmit} className="p-12 px-12 space-y-6">
        <div className="text-3xl font-serif">REGISTER</div>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-full border p-2 bg-gray-100 bg-opacity-50 backdrop-blur-lg"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full border p-2 bg-gray-100 bg-opacity-50 backdrop-blur-lg"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full border p-2 bg-gray-100 bg-opacity-50 backdrop-blur-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 rounded-sm hover:scale-105 transition-transform duration-200 backdrop-blur-md text-white opacity-80"
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

import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { Helmet } from "react-helmet";
import validator from "validator"; // Import validator for email validation
import Toast from "../../components/themes/alert"; // Assuming you use Toast for notifications

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({}); // To track validation errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let validationErrors = {};

    // is email exist in database

    // Email validation
    if (!validator.isEmail(formData.email)) {
      validationErrors.email = "Please enter a valid email address";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run form validation
    if (!validateForm()) {
      Toast.fire({
        icon: "error",
        title: "Please fix the errors before submitting",
      });
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", formData);

      // Dispatch login success and store user data in Redux
      dispatch(loginSuccess(response.data));

      // Redirect based on login success
      navigate("/login");
      window.location.reload();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Invalid email or password",
      });
    }
  };

  return (
    <div className="bg-transparent backdrop-blur-sm shadow-md">
      <Helmet>
        <title>PlayDirect | Login</title>
      </Helmet>

      <form onSubmit={handleSubmit} className="p-12 px-12 space-y-6">
        <div className="text-3xl font-serif">LOGIN</div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className="w-full border p-2 bg-gray-100 bg-opacity-50 backdrop-blur-lg"
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="w-full border p-2 bg-gray-100 bg-opacity-50 backdrop-blur-lg"
          required
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 rounded-sm hover:scale-105 transition-transform duration-200 backdrop-blur-md text-white opacity-80"
        >
          SUBMIT
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

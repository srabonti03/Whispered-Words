import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function SignUp() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValues({
      ...values,
      [id]: value,
    });
    setFieldErrors({ ...fieldErrors, [id]: "" });
  };

  const validateFields = () => {
    const newFieldErrors = {};
    if (!values.username || values.username.length < 4) {
      newFieldErrors.username = "Username must be at least 4 characters long.";
    }
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newFieldErrors.email = "Invalid email format.";
    }
    if (!values.password || values.password.length < 5) {
      newFieldErrors.password = "Password must be at least 5 characters long.";
    }
    if (values.password !== values.confirmPassword) {
      newFieldErrors.confirmPassword = "Passwords do not match.";
    }
    return newFieldErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await submit();
      navigate("/LogIn");
    } catch (error) {
      console.error("Sign Up Error:", error);
      setError("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    console.log("Submitting values:", values);
    try {
      const response = await axios.post("http://localhost:3001/api/v1/signup", values);
      console.log("Form submitted", response.data);
    } catch (err) {
      console.error("Error submitting form:", err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : "Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url("/signup.jpg")' }}>
      <div className="absolute inset-0 bg-zinc-900 opacity-70"></div>
      <div className="absolute inset-0 backdrop-blur-md" style={{ backgroundImage: 'url("/signup.jpg")', filter: 'blur(2px) saturate(0.8)' }}></div>
      <motion.div 
        className="relative p-6 sm:p-10 bg-zinc-900 bg-opacity-90 rounded-lg backdrop-blur-md border border-zinc-700 shadow-lg w-full max-w-md sm:max-w-lg"
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl sm:text-4xl text-yellow-400 font-semibold text-center">Sign <span className="text-yellow-300">Up</span></h1>
        <p className="text-zinc-300 text-center mb-4 mt-2">Create an account to get started</p>

        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="username" className="block text-yellow-400">Username</label>
            <input 
              type="text" 
              id="username" 
              className="w-full p-3 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-yellow-500" 
              placeholder="Enter your username" 
              value={values.username}
              onChange={handleChange}
              required 
            />
            {fieldErrors.username && <p className="text-red-500">{fieldErrors.username}</p>}
          </div>

          <div className="relative">
            <label htmlFor="email" className="block text-yellow-400">Email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full p-3 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-yellow-500" 
              placeholder="Enter your email" 
              value={values.email}
              onChange={handleChange}
              required 
            />
            {fieldErrors.email && <p className="text-red-500">{fieldErrors.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-yellow-400">Password</label>
            <input 
              type="password" 
              id="password" 
              className="w-full p-3 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-yellow-500" 
              placeholder="Enter your password" 
              value={values.password}
              onChange={handleChange}
              required 
            />
            {fieldErrors.password && <p className="text-red-500">{fieldErrors.password}</p>}
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-yellow-400">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="w-full p-3 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-yellow-500" 
              placeholder="Confirm your password" 
              value={values.confirmPassword}
              onChange={handleChange}
              required 
            />
            {fieldErrors.confirmPassword && <p className="text-red-500">{fieldErrors.confirmPassword}</p>}
          </div>

          <div className="relative">
            <label htmlFor="address" className="block text-yellow-400">Address</label>
            <input 
              type="text" 
              id="address" 
              className="w-full p-3 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-yellow-500" 
              placeholder="Enter your address" 
              value={values.address}
              onChange={handleChange}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        
        <p className="text-center text-zinc-400 mt-4">
          Or<br />
          Already have an account?{' '}
          <Link to="/LogIn" className="text-yellow-400 hover:text-yellow-300 font-medium hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default SignUp;

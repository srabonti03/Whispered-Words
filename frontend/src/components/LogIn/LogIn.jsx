import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authActions } from '../../store/auth';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

function LogIn() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setCredentials({
            ...credentials,
            [id]: value,
        });
        setFieldErrors({ ...fieldErrors, [id]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        const newFieldErrors = {};
        if (!credentials.username) {
            newFieldErrors.username = "Username is required.";
        }
        if (!credentials.password) {
            newFieldErrors.password = "Password is required.";
        }
        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/api/v1/login", credentials);
            console.log("Login successful", response.data);
            dispatch(authActions.login());
            localStorage.setItem("id", response.data.userId);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            navigate("/Profile");
        } catch (err) {
            console.error("Login Error:", err.response ? err.response.data : err);
            setError(err.response ? err.response.data.message : "Failed to log in. Please try again.");
        }
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div
            className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: 'url("/login.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
        >
            <div className="absolute inset-0 bg-zinc-900 opacity-70"></div>
            <div
                className="absolute inset-0 backdrop-blur-md"
                style={{ backgroundImage: 'url("/login.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', filter: 'blur(1.5px) saturate(1.0)' }}
            ></div>

            <motion.div
                className="relative p-6 sm:p-10 bg-zinc-900 bg-opacity-90 rounded-lg backdrop-blur-md border border-zinc-700 shadow-lg w-full max-w-md sm:max-w-lg"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl sm:text-4xl text-yellow-400 font-semibold text-center">Log <span className="text-yellow-300">In</span></h1>
                <p className="text-zinc-300 text-center mb-4 mt-2">Access your account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative"
                    >
                        <label htmlFor="username" className="block text-yellow-400">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            className="w-full p-3 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-yellow-500" 
                            placeholder="Enter your username" 
                            required 
                            value={credentials.username}
                            onChange={handleChange}
                        />
                        {fieldErrors.username && <p className="text-red-500">{fieldErrors.username}</p>}
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <label htmlFor="password" className="block text-yellow-400">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="w-full p-3 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-yellow-500" 
                            placeholder="Enter your password" 
                            required 
                            value={credentials.password}
                            onChange={handleChange}
                        />
                        {fieldErrors.password && <p className="text-red-500">{fieldErrors.password}</p>}
                    </motion.div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <motion.button 
                        type="submit" 
                        className="w-full py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Log In
                    </motion.button>
                </form>

                <p className="text-center text-zinc-400 mt-4">
                    Or<br />
                    Don't have an account?{' '}
                    <Link to="/SignUp" className="text-yellow-400 hover:text-yellow-300 font-medium hover:underline">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

export default LogIn;

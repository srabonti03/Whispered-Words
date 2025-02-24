import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth";

const SideBar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logout());
    dispatch(authActions.changeRole("user"));
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const fallbackAvatar = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

  const handleAvatarError = (e) => {
    e.target.src = fallbackAvatar;
  };

  const role = useSelector((state) => state.auth.role);

  return (
    <motion.div
      className="bg-zinc-800 p-6 md:p-8 rounded-xl flex flex-col items-center w-full shadow-lg shadow-black/40 min-h-[80vh] flex-grow"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      {role == "user" && (
        <div className="mt-3 md:mt-10">
          <motion.img
            src={
              data.avatar
                ? `http://localhost:3001${data.avatar}?timestamp=${new Date().getTime()}`
                : fallbackAvatar
            }
            alt="User avatar"
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-zinc-700"
            onError={handleAvatarError}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
      <div className="text-center mb-2 mt-3 md:mb-4">
        <motion.p
          className="text-xl md:text-2xl text-zinc-100 font-semibold tracking-wide"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {data.username}
        </motion.p>
      </div>
      <div className="text-center mb-4 w-full max-w-[200px] sm:max-w-[90%] md:max-w-[300px] mx-auto">
        <motion.p
          className="text-sm md:text-base text-zinc-400 truncate"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {data.email}
        </motion.p>
      </div>
      <div className="w-full mt-6 h-[1px] bg-zinc-700 hidden lg:block"></div>
      {role === "user" && (
        <>
          <Link
            to="/Profile"
            className="text-zinc-100 w-full py-2 text-center hover:text-yellow-300 hover:bg-zinc-900 rounded-md transition-all duration-300 md:mt-6 font-medium tracking-wide"
          >
            Favourites
          </Link>
          <Link
            to="/Profile/orderhistory"
            className="text-zinc-100 w-full py-2 text-center hover:text-yellow-300 hover:bg-zinc-900 rounded-md transition-all duration-300 mt-2 font-medium tracking-wide"
          >
            Order History
          </Link>
          <Link
            to="/Profile/settings"
            className="text-zinc-100 w-full py-2 text-center hover:text-yellow-300 hover:bg-zinc-900 rounded-md transition-all duration-300 mt-2 font-medium tracking-wide"
          >
            Settings
          </Link>
        </>
      )}
      {role === "admin" && (
        <>
          <Link
            to="/Profile"
            className="text-zinc-100 w-full py-2 text-center hover:text-yellow-300 hover:bg-zinc-900 rounded-md transition-all duration-300 mt-20 font-sm tracking-wide"
          >
            Dashboard
          </Link>
          <Link
            to="/Profile/managebooks"
            className="text-zinc-100 w-full py-2 text-center hover:text-yellow-300 hover:bg-zinc-900 rounded-md transition-all duration-300 mt-2 font-sm tracking-wide"
          >
            Manage Books
          </Link>
          <Link
            to="/Profile/manageevents"
            className="text-zinc-100 w-full py-2 text-center hover:text-yellow-300 hover:bg-zinc-900 rounded-md transition-all duration-300 mt-2 font-sm tracking-wide"
          >
            Manage Events
          </Link>
          <Link
            to="/Profile/allorders"
            className="text-zinc-100 w-full py-2 text-center hover:text-yellow-300 hover:bg-zinc-900 rounded-md transition-all duration-300 mt-2 font-sm tracking-wide"
          >
            Order Overview
          </Link>
          <div className="mt-8"></div>
        </>
      )}
      <button
        onClick={handleLogout}
        className="text-red-500 w-full py-2 text-center rounded-md bg-zinc-900 transition-all duration-300 mt-4 md:mt-12 font-medium tracking-wide flex items-center justify-center shadow hover:bg-black hover:text-red-600 hover:text-shadow-sm"
      >
        <FaSignOutAlt className="mr-2 transition-all duration-300" />
        Logout
      </button>
    </motion.div>
  );
};

export default SideBar;

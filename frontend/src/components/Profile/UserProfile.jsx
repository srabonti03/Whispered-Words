import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SideBar from "../../components/Profile/SideBar";
import Loader from "../Loader/Loader";
import { Outlet } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const headers = {
    id: userId,
    authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/getuserinfo", { headers });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (userId && token) {
      fetchProfile();
    }
  }, [userId, token]);

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row h-auto py-8 gap-4 text-white">
      {!profile ? (
        <motion.div
          className="w-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader />
        </motion.div>
      ) : (
        <>
          <motion.div
            className="w-full md:w-1/6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SideBar data={profile} />
          </motion.div>
          <motion.div
            className="w-full md:w-5/6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </>
      )}
    </div>
  );
}

export default UserProfile;

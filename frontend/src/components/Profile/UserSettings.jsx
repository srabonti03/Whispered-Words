import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function UserSettings() {
  const [profileData, setProfileData] = useState(null);
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const headers = {
    id: localStorage.getItem('id'),
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/getuserinfo', { headers });
        const userData = response.data;

        setProfileData(userData);
        setUsername(userData.username);
        setEmail(userData.email);
        setAddress(userData.address);
        setAvatar(userData.avatar);
      } catch (err) {
        console.error('Error fetching user info:', err);
        alert('Failed to load user data.');
      }
    };

    fetchUserInfo();
  }, []);

  const updateUserInfo = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('address', address);

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const response = await axios.put('http://localhost:3001/api/v1/updateuserinfo', formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.message);
      setAvatar(response.data.user.avatar);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating user info:', err);
      alert('Error updating user info.');
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:3001/api/v1/updatepassword',
        { currentPassword, newPassword },
        { headers }
      );

      alert(response.data.message);
      setIsPasswordEditing(false);
    } catch (err) {
      console.error('Error updating password:', err);
      alert('Error updating password. Please try again.');
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="settings-container bg-zinc-900 flex flex-col min-h-[500px] h-[80vh] p-4">
      <motion.div
        className="settings-card bg-zinc-800 rounded-lg p-4 w-full max-w-7xl mx-auto flex-1 shadow-lg overflow-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl text-yellow-100 font-semibold mb-8 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          Account <span className="text-yellow-300">Settings</span>
        </motion.h2>

        {!isEditing && !isPasswordEditing && (
          <motion.div
            className="user-info mb-6 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <div className="avatar-container mb-6 flex justify-center relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-yellow-400 to-red-500 p-[2px] animate-glass-effect">
                <img
                  src={
                    avatar && avatar !== 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png'
                      ? `http://localhost:3001${avatar}?timestamp=${new Date().getTime()}`
                      : 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png'
                  }
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <motion.h3 className="text-xl text-yellow-100 mb-4" initial="hidden" animate="visible" variants={fadeIn}>
              Username: <span className="font-semibold">{username.charAt(0).toUpperCase() + username.slice(1)}</span>
            </motion.h3>
            <motion.h3 className="text-xl text-yellow-100 mb-4" initial="hidden" animate="visible" variants={fadeIn}>
              Email: <span className="font-semibold">{email}</span>
            </motion.h3>
            <motion.h3 className="text-xl text-yellow-100 mb-4" initial="hidden" animate="visible" variants={fadeIn}>
              Address: <span className="font-semibold">{address.replace(/\b\w/g, (char) => char.toUpperCase())}</span>
            </motion.h3>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 w-full p-3 bg-yellow-500 text-zinc-900 rounded-lg hover:bg-yellow-400 transition duration-200"
            >
              Edit Information
            </button>
            <button
              onClick={() => setIsPasswordEditing(true)}
              className="mt-4 w-full p-3 bg-red-500 text-zinc-900 rounded-lg hover:bg-red-400 transition duration-200"
            >
              Change Password
            </button>
          </motion.div>
        )}

        {isEditing && (
          <motion.div
            className="mb-2 overflow-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <motion.h3 className="text-xl text-yellow-100 mb-2" initial="hidden" animate="visible" variants={fadeIn}>
              Username
            </motion.h3>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-700 text-yellow-100 placeholder:text-zinc-400 mb-2"
            />

            <motion.h3 className="text-xl text-yellow-100 mb-3" initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.4, delay: 0.1 }}>
              Email
            </motion.h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-700 text-yellow-100 placeholder:text-zinc-400 mb-2"
            />

            <motion.h3 className="text-xl text-yellow-100 mb-4" initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.4, delay: 0.2 }}>
              Address
            </motion.h3>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Update your address"
              className="w-full p-3 rounded-lg bg-zinc-700 text-yellow-100 placeholder:text-zinc-400 mb-2"
            />

            <motion.h3 className="text-xl text-yellow-100 mb-3" initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.4, delay: 0.3 }}>
              Avatar
            </motion.h3>
            <input
              type="file"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="w-full p-3 rounded-lg bg-zinc-700 text-yellow-100 placeholder:text-zinc-400 mb-2"
            />

            <button
              onClick={updateUserInfo}
              className="mt-1 w-full p-3 bg-yellow-500 text-zinc-900 rounded-lg hover:bg-yellow-400 transition duration-200"
            >
              Save Changes
            </button>
          </motion.div>
        )}

        {isPasswordEditing && (
          <motion.div
            className="mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <motion.h3 className="text-xl text-yellow-100 mb-4" initial="hidden" animate="visible" variants={fadeIn}>
              Current Password
            </motion.h3>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-700 text-yellow-100 placeholder:text-zinc-400 mb-6"
            />

            <motion.h3 className="text-xl text-yellow-100 mb-4" initial="hidden" animate="visible" variants={fadeIn}>
              New Password
            </motion.h3>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-700 text-yellow-100 placeholder:text-zinc-400 mb-6"
            />

            <motion.h3 className="text-xl text-yellow-100 mb-4" initial="hidden" animate="visible" variants={fadeIn}>
              Confirm New Password
            </motion.h3>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-700 text-yellow-100 placeholder:text-zinc-400 mb-6"
            />

            <button
              onClick={updatePassword}
              className="mt-6 w-full p-3 bg-red-500 text-zinc-900 rounded-lg hover:bg-red-400 transition duration-200"
            >
              Change Password
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default UserSettings;

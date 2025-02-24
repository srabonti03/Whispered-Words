const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const multer = require('multer');
const path = require('path');

// Sign up
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, confirmPassword, address } = req.body;

        if (username.length < 4) {
            return res.status(400).json({ message: "Username's length should be greater than three" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password.length < 5) {
            return res.status(400).json({ message: "Password's length should be greater than five" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashPass,
            address
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        console.error("Sign up error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const existingUser = await User.findOne({ username: username.trim() });
        if (!existingUser) {
            return res.status(400).json({ message: "Username does not exist." });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password." });
        }

        const authClaims = { id: existingUser._id, role: existingUser.role };
        const token = jwt.sign(authClaims, process.env.JWT_SECRET || "sst", { expiresIn: "30d" });

        res.status(200).json({
            message: "Login successful",
            userId: existingUser._id,
            role: existingUser.role,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get user information
router.get("/getuserinfo", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await User.findById(userId).select('-password');

        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Get user info error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Set up Multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/');
    },
    filename: (req, file, cb) => {
        const username = req.body.username || req.user.username;
        cb(null, username + '-' + Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Updating the user information
router.put('/updateuserinfo', authenticateToken, upload.single('avatar'), async (req, res) => {
    const { username, email, address } = req.body;
    const avatarUrl = req.file
        ? `/public/${req.file.filename}`
        : req.user.avatar || "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        username,
        email,
        address,
        avatar: avatarUrl,
        }, { new: true });
        res.json({
        message: 'User info updated successfully!',
        user: updatedUser,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user info', error: err });
    }
    });

// Update password
router.put('/updatepassword', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error updating password' });
    }
});

// Get all users with role user - Public
router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).select('-password');

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found." });
        }

        return res.status(200).json({ users });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Poll = require("../models/Poll");

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret_Polling-App", {
        expiresIn: "7d"
    });
};

// Register user
exports.registerUser = async (req, res) => {
    const { fullName, username, email, password, profileImageUrl } = req.body;

    // Validation: check for missing fields
    if (!username || !email || !password || !fullName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validation: check username format (alphanumeric and hyphens only)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            message: "Invalid username. Only letters, numbers, hyphens, and underscores are allowed. No spaces."
        });
    }

    try {
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username is not available" });
        }

        const user = await User.create({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            password,
            username: username.trim(),
            profileImageUrl: profileImageUrl || ""
        });

        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            bookmarkedPolls: user.bookmarkedPolls,
            totalPollsCreated: 0,
            totalPollsVotes: 0,
            totalPollsBookmarked: 0
        };

        res.status(201).json({
            id: user._id,
            user: userResponse,
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Count polls created by user
        const totalPollsCreated = await Poll.countDocuments({ creator: user._id });

        // Count polls the user has voted in
        const totalPollsVotes = await Poll.countDocuments({
            voters: user._id
        });

        // Count of bookmarked polls
        const totalPollsBookmarked = user.bookmarkedPolls?.length || 0;

        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            bookmarkedPolls: user.bookmarkedPolls,
            totalPollsCreated,
            totalPollsVotes,
            totalPollsBookmarked
        };

        res.status(200).json({
            id: user._id,
            user: userResponse,
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};

// Get user info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Count polls created by user
        const totalPollsCreated = await Poll.countDocuments({ creator: user._id });

        // Count polls the user has voted in
        const totalPollsVotes = await Poll.countDocuments({
            voters: user._id
        });

        // Count of bookmarked polls
        const totalPollsBookmarked = user.bookmarkedPolls?.length || 0;

        const userInfo = {
            ...user.toObject(),
            totalPollsCreated,
            totalPollsBookmarked,
            totalPollsVotes
        };

        res.status(200).json(userInfo);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user info", error: err.message });
    }
};
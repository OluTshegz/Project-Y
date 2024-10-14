import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    // res.json({data: "signup route"});
    try {
        const { fullName, username, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format, Please input a valid email address" });
        }

        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already in use, Please try another" });
        }

        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already in use, Please try another" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Please enter a password that's at least 6 characters long" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            username: username,
            email: email,
            password: hashedPassword,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                message: "User created successfully",
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        } else {
            res.status(400).json({ error: "Invalid user data, Please check your input and try again" });
        }
    } catch (error) {
        console.log("Error in signup auth controller", error.message);
        res.status(500).json({ error: `Internal Server Error: ${error.message}. Please try again later` });
    }
};

export const login = async (req, res) => {
    // res.json({data: "login route"});
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || ""); // if user is null/undefined, check password with an empty string instead of `undefined` to avoid this bcrypt action crashing the server

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password, Please enter the correct credentials" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            message: "User logged in successfully",
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    } catch (error) {
        console.log("Error in login auth controller", error.message);
        res.status(500).json({ error: `Internal Server Error: ${error.message}. Please try again later` });
    }
};

export const logout = async (req, res) => {
    // res.json({data: "logout route"});
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error in logout auth controller", error.message);
        res.status(500).json({ error: `Internal Server Error: ${error.message}. Please try again later` });
    }
};

export const getMe = async (req, res) => {
    // res.json({ data: "auth route" });
    try {
        const user = await User.findById(req.user._id).select("-password"); // exclude password from user data
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe auth controller", error.message);
        res.status(500).json({ error: `Internal Server Error: ${error.message}. Please try again later` });
    }
};

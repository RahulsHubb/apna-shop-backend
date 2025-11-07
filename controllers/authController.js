import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        console.log(req.body);

        if (!email || !password || !name)
            return res.status(400).json({ message: "All fields are required" });
        else if (password.length < 6)
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters long" });
        else if (!/\S+@\S+\.\S+/.test(email))
            return res.status(400).json({ message: "Invalid email format" });
        else if (name.length < 3)
            return res
                .status(400)
                .json({ message: "Name must be at least 3 characters long" });
        else if (name.length > 30)
            return res
                .status(400)
                .json({ message: "Name must be less than 30 characters long" });
        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        //check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            success: true,
            code: 201,
            token,
            message: "User created successfully!",
            user: newUser,
        });

        // registration logic
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(user, "fff", isMatch);

        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({ message: "Login successful", token, user, status: 200 });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

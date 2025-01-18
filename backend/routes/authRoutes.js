import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id, email, username },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "30d",
      }
    );

    res.status(201).json({ token, username });
  } catch (error) {
    return res.status(400).json({ error: "Error registering user" });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email, username: user.username },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "30d",
      }
    );
    
    res.status(200).json({ token, username: user.username });    
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

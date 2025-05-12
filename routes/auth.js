const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts. Please try again later.",
});

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Remove sensitive data from output
    user.password = undefined;

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      token,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select(
      "+password +loginAttempts +lockUntil"
    );
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(401).json({
        message: "Account is locked. Please try again later.",
      });
    }

    // Check if password is correct
    if (!(await user.correctPassword(password, user.password))) {
      // Increment login attempts
      user.loginAttempts += 1;

      // Lock account if too many attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();
        return res.status(401).json({
          message: "Too many failed attempts. Account locked for 15 minutes.",
        });
      }

      await user.save();
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Generate JWT token with appropriate expiration
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "30d" : "1d",
    });

    // Remove sensitive data from output
    user.password = undefined;
    user.loginAttempts = undefined;
    user.lockUntil = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "No user found with this email address",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save reset token to user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpires;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Reset password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current user
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

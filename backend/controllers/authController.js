// controllers/authController.js

const bcrypt = require("bcrypt");
const {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserName,
  updateUserPassword,
  updateLoginMeta
} = require("../models/userModel");

const { generateToken } = require("../utils/jwt");
const pool = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await createUser({ name, email, password: hashed });
    const token = generateToken(newUser);

    console.log(`[REGISTER] New user registered: ${email} (ID: ${newUser.id})`);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error(`[REGISTER ERROR] ${err.message}`);
    res.status(500).json({ message: "Registration failed. Please try again later." });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // Update login metadata
    await updateLoginMeta(user.id);
    
    console.log(`[LOGIN] ${email} logged in`);

    const updatedUser = await findUserById(user.id);
    res.status(200).json({ user: updatedUser, token });
  } catch (err) {
    console.error(`[LOGIN ERROR] ${err.message}`);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
};

// Logout user (no badge logic involved)
exports.logout = async (req, res) => {
  console.log(`[LOGOUT] User ID ${req.user.id} logged out`);
  res.status(200).json({ message: "Logged out" });
};

// Fetch current user info
exports.getMe = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(`[GET ME ERROR] ${err.message}`);
    res.status(500).json({ message: "Failed to retrieve user information. Please try again later." });
  }
};

// Update user's name
exports.updateProfile = async (req, res) => {
  try {
    const updated = await updateUserName(req.user.id, req.body.name);
    console.log(`[UPDATE PROFILE] User ${req.user.id} changed name to ${req.body.name}`);
    res.status(200).json({ user: updated });
  } catch (err) {
    console.error(`[UPDATE PROFILE ERROR] ${err.message}`);
    res.status(500).json({ message: "Failed to update profile. Please try again later." });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.newPassword, 10);
    await updateUserPassword(req.user.id, hashed);
    console.log(`[CHANGE PASSWORD] User ${req.user.id} changed password`);
    res.status(200).json({ message: "Password changed" });
  } catch (err) {
    console.error(`[CHANGE PASSWORD ERROR] ${err.message}`);
    res.status(500).json({ message: "Failed to change password. Please try again later." });
  }
};
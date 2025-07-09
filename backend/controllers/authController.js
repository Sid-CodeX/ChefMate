const bcrypt = require("bcrypt");
const { findUserByEmail, createUser, findUserById, updateUserName, updateUserPassword } = require("../models/userModel");
const { generateToken } = require("../utils/jwt");

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await createUser({ name, email, password: hashed });
    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout user (stateless JWT, just respond OK)
exports.logout = async (req, res) => {
  res.status(200).json({ message: "Logged out" });
};

// Get current user info
exports.getMe = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile (name)
exports.updateProfile = async (req, res) => {
  try {
    const updated = await updateUserName(req.user.id, req.body.name);
    res.status(200).json({ user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.newPassword, 10);
    await updateUserPassword(req.user.id, hashed);
    res.status(200).json({ message: "Password changed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
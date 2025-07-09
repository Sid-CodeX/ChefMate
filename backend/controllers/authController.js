const bcrypt = require("bcrypt");
const { findUserByEmail, createUser } = require("../models/userModel");
const { generateToken } = require("../utils/jwt");

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

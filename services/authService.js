const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// REGISTER NEW USER

// exports.registerUser = async ({ username, email, phoneNumber, password }) => {
//   const existingUser = await User.findOne({ email });
//   if (existingUser) throw new Error("User already exists");

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new User({ username, email, phoneNumber, password: hashedPassword });
//   await user.save();
//   return { msg: "User registered successfully" };
// };

// // LOGIN AN EXISTING USER

// exports.loginUser = async ({ email, username, password }) => {
//   const user = await User.findOne({ email, username });
//   if (!user) throw new Error("Invalid credentials");

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) throw new Error("Invalid credentials");

//   const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
//   return { token };
// };
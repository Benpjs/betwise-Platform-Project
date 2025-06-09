const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const token = crypto.randomBytes(32).toString('hex');
const http = require("http")
const cors = require("cors")
const sendEmail = require("../sendemail");


// REGISTER A NEW USER

exports.register = async (req, res) => {
  const { name, email, phoneNumber, username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      phoneNumber,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ msg: "Registration successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.isVerified) return res.status(400).json({ msg: "Email already verified" });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ msg: "Email verified successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};

  // LOGIN AN EXXISTING USER

  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
  
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        {expiresIn: "1d",}
      );
  
      res.json({ 
        message: "Login Successful",
        token,
        user:{
          name: user?.name,
          email: user?.email,
          phoneNumber: user?.phoneNumber,
          username: user?.username,
          role: user?.role
        }
      });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  };

  // GETTING ALL USERS
  
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password') // exclude passwords
    res.json(users)
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" })
  }
}

//FORGOT PASSWORD

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink =` http://localhost:4000/auth/reset-password/${resetToken}`;

    await sendEmail(
      process.env.EMAIL,  // send to same email as sender
      "Password Reset Link",
     ` Reset link for ${email}:\n\n${resetLink}`
    );

    return res.status(200).json({ msg: "Reset link sent to admin email." });

  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};


//RESET PASSWORD

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: "Password reset successful" });

  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};


//Reset Password (Logged-in User

exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


//Logout

exports.logout = (req, res) => {
  res.clearCookie("token"); // if using cookies
  res.status(200).json({ msg: "Logged out successfully" });
};


// module.exports = {
//   login
// }
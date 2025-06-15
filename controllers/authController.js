const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendEmail = require('../utility/sendEmail')


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, phoneNumber, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      isVerified: false,
    });

    const token = jwt.sign(
      { id: newUser._id, purpose: 'email-verification' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;

    const html = `
      <h3>Verify Your Email</h3>
      <p>Hello ${username},</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `;

    await sendEmail(email, 'Verify your Betwise account', html);

    res.status(201).json({ msg: 'Registration successful. Verification link sent to email.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
}
};


exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (user.isVerified) return res.status(400).json({ msg: 'Email already verified' });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ msg: 'Email verified successfully' });
  } catch (err) {
    return res.status(400).json({ msg: 'Invalid or expired token' });
}
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({ msg: 'Please verify your email before logging in' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        wallet_balance: user.wallet_balance,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.isVerified) {
      return res.status(400).json({ msg: 'User already verified' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const verificationLink = `https://betwise-platform-project.onrender.com/verify-email/${token}`;

    await sendEmail(
      email,
      'Resend Verification - Betwise',
      `<p>Hello ${user.username},</p><p>Click below to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`
    );

    res.status(200).json({ msg: 'Verification link resent. Check your email.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Generate token
    const token = generateToken(user._id);

    // Build reset link
    const resetLink = `${process.env.CLIENT_BASE_URL}/reset-password/${token}`;

    // Email content
    const subject = 'Password Reset - Betwise';
    const html = `
      <h3>Hello ${user.username},</h3>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 15 min.</p>
    `;

    // Send email
    await sendEmail(email, token);

    res.status(200).json({ msg: 'Reset link sent to your email.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token.trim();
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Reset token error:', err.message);
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
};



exports.logout = async (req, res) => {
  
  res.status(200).json({ message: 'User logged out successfully' });
};

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  wallet_balance: { type: Number, default: 1000 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetToken: String,
  resetTokenExpiry: Date,
  transaction_pin: { type: String, default: null }
});

module.exports = mongoose.model("User", userSchema);



const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Fund Wallet
exports.fundWallet = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.wallet_balance += amount;
    await user.save();

    res.status(200).json({ msg: "Wallet funded successfully", wallet_balance: user.wallet_balance });
  } catch (error) {
    console.error("Funding error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


//setTransactionPin

exports.setTransactionPin = async (req, res) => {
  try {
    const { transactionPin } = req.body;
    const userId = req.user.id; // assuming you have user id from auth middleware

    if (!transactionPin || transactionPin.length < 4) {
      return res.status(400).json({ msg: "Transaction pin must be at least 4 digits" });
    }

    // Hash the transaction pin
    const hashedPin = await bcrypt.hash(transactionPin, 10);

    // Update user's transaction pin in DB
    await User.findByIdAndUpdate(userId, { transactionPin: hashedPin });

    res.status(200).json({ msg: "Transaction pin set successfully" });
  } catch (error) {
    console.error("Set transaction pin error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


//WITHDRAW MONEY
exports.withdraw = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { amount, transactionPin } = req.body;

    if (!transactionPin) {
      return res.status(400).json({ msg: "Transaction pin is required" });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Compare provided pin with stored hashed pin
    const isPinValid = await bcrypt.compare(transactionPin, user.transactionPin);

    if (!isPinValid) {
      return res.status(400).json({ msg: "Invalid transaction pin" });
    }

    // Proceed with withdrawal logic here...
    // Check if balance is enough, update balance, record transaction, etc.

    return res.status(200).json({ msg: "Withdrawal successful" });

  } catch (error) {
    console.error("Withdraw error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

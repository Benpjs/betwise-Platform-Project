const User = require('../models/userModel');
const transaction = require('../models/transactionModel')
const bcrypt = require('bcryptjs');

exports.setTransactionPin = async (req, res) => {
    const { pin } = req.body;
    const userId = req.user.id;
  
    // Convert pin to string and validate
    const pinStr = String(pin);
    if (!/^\d{4}$/.test(pinStr)) {
      return res.status(400).json({ msg: 'PIN must be exactly 4 numeric digits' });
    }
  
    try {
      const hashedPin = await bcrypt.hash(pinStr, 10);
      await User.findByIdAndUpdate(userId, { transaction_pin: hashedPin });
  
      res.status(200).json({ msg: 'Transaction PIN set successfully' });
    } catch (err) {
      console.error('Set PIN Error:', err.message);
      res.status(500).json({ msg: 'Server error', error: err.message });
  }
  };
exports.fundWallet = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ msg: 'Amount must be greater than zero' });
  }

  try {
    const user = await User.findById(userId);
    user.wallet_balance += amount;
    await user.save();

    res.status(200).json({ msg: 'Wallet funded successfully', balance: user.wallet_balance });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.withdrawFunds = async (req, res) => {
  const { amount, pin } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user.transaction_pin) {
      return res.status(400).json({ msg: 'Set your transaction PIN first' });
    }

    const isMatch = await bcrypt.compare(pin, user.transaction_pin);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Incorrect transaction PIN' });
    }

    if (user.wallet_balance < amount) {
      return res.status(400).json({ msg: 'Insufficient balance' });
    }

    user.wallet_balance -= amount;
    await user.save();

    res.status(200).json({ msg: 'Withdrawal successful', balance: user.wallet_balance });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

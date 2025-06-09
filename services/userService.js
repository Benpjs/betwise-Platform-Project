const { getUsers } = require('../../controllers/authController');
const User = require('../models/userModel');

const findUserById = async (id) => {
  return await User.findById(id);
};

const updateUserWallet = async (userId, amount) => {
  const user = await User.findById(userId);
  user.wallet_balance += amount;
  await user.save();
  return user;
};

module.exports = {
    registerUser,
    loginUser,
    getUsers,
  findUserById,
  updateUserWallet,

};

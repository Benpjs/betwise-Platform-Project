//Bonus on Bet (Service Function)

const User = require("../models/userModel");

const giveBonus = async (userId, betAmount, percentage) => {
  const bonus = (percentage / 100) * betAmount;
  const user = await User.findById(userId);
  user.wallet += bonus;
  await user.save();
  return bonus;
};

module.exports = giveBonus;





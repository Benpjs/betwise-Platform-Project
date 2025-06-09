const Bet = require("../models/betModel");
const Game = require("../models/gameModel");
const User = require("../models/userModel");


const placeBet = async ({ userId, gameId, prediction, stake }) => {
  const user = await User.findById(userId);
  const game = await Game.findById(gameId);
  if (!game) throw new Error("Game not found");
  if (user.wallet_balance < stake) throw new Error("Insufficient wallet");

  let odds;
  if (prediction === "A") odds = game.oddsA;
  else if (prediction === "B") odds = game.oddsB;
  else if (prediction === "Draw") odds = game.oddsDraw;
  else throw new Error("Invalid outcome selected");

  const potentialPayout = stake * odds;

  user.wallet_balance -= stake;
  await user.save();
}
  //payout process
  const processPayouts = async (game) => {
    const bets = await Bet.find({ game: game._id });
  
    for (let bet of bets) {
      if (bet.status !== 'pending') continue;
  
      if (bet.prediction === game.result) {
        // User won the bet
        const user = await User.findById(bet.user);
        user.wallet_balance += bet.potentialPayout;
        await user.save();
  
        bet.status = 'won';
        bet.isPaid = true;
      } else {
        bet.status = 'lost';
      }
  
      await bet.save();
    }
  }
;
  
  module.exports = { 
    processPayouts,
    placeBet
  }
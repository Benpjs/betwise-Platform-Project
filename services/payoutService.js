const Bet = require("../models/betModel");
const Game = require("../models/gameModel");
const User = require("../models/userModel");

const processPayouts = async () => {
  const pendingBets = await Bet.find({ status: 'pending', isPaid: false }).populate('game');

  for (const bet of pendingBets) {
    const game = bet.game;

    // Skip if no game or no result yet
    if (!game || !game.result) continue;

    // Determine winning outcome
    const actualResult = game.result;
    const userPrediction = bet.prediction; // renamed from selectedOutcome

    let odds = 0;
    if (actualResult === 'A') odds = game.oddsA;
    else if (actualResult === 'B') odds = game.oddsB;
    else if (actualResult === 'D') odds = game.oddsDraw;

    if (userPrediction === actualResult) {
      const payout = bet.stake * odds;

      // Update user wallet
      await User.findByIdAndUpdate(bet.user, { $inc: { wallet: payout } });

      // Update bet
      bet.status = 'won';
      bet.isPaid = true;
      bet.payout = payout;
    } else {
      bet.status = 'lost';
      bet.isPaid = true;
      bet.payout = 0;
    }

    await bet.save();
  }

  return { success: true, message: "${pendingBets.length} bets processed." };

}
module.exports = { processPayouts };
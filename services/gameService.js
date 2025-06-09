const Game = require("../models/gameModel");

exports.addGame = async ({ teamA, teamB, oddsA, oddsB, oddsDraw, date }) => {
  const game = new Game({ teamA, teamB, oddsA, oddsB, oddsDraw, date });
  return await game.save();
};

exports.getAvailableGames = async () => {
  return await Game.find({ status: "pending" });
};

exports.setGameResult = async (gameId, result) => {
  const game = await Game.findById(gameId);
  if (!game) throw new Error("Game not found");
  game.result = result;
  game.status = "completed";
  return await game.save();
};

 // bet out come
const bets = await bets.find({ game: gameId });

  for (let bet of bets) {
    if (bet.prediction === result) {
      const payout = bet.potentialPayout;
      const user = await User.findById(bet.user);
      user.wallet_balance += payout;
      await user.save();

      bet.status = 'won';
    } else {
      bet.status = 'lost';
    }
    await bet.save();
  }

  return game;


module.exports = { setGameResult };

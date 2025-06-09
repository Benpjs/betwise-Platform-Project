const Bet = require("../models/betModel");
const Game = require("../models/gameModel");
const User = require("../models/userModel");
const giveBonus = require("../services/bonusSevice");




//PLACE BET

exports.placeBet = async (req, res) => {
  const { gameId, prediction, stake } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' })

    if (user.wallet_balance < stake) {
      return res.status(400).json({ msg: 'Insufficient wallet balance' })
    }

    let odds;
    if (prediction === 'A') odds = game.oddsA
    else if (prediction === 'B') odds = game.oddsB
    else if (prediction === 'Draw') odds = game.oddsDraw
    else return res.status(400).json({ msg: 'Invalid outcome selected' })

    const potentialPayout = stake * odds

     // Deduct stake
     user.wallet_balance -= stake
     await user.save()

     
 
     // Record bet
     const bet = new Bet({
       user: user._id,
       game: game._id,
       prediction,
       stake,
       potentialPayout
     });
 
     await bet.save();
 
     res.status(201).json({ msg: 'Bet placed successfully', bet });
   } catch (err) {
     console.error('Betting error:', err.message);
     res.status(500).json({ msg: 'Server error', error: err.message });
   }
 }
 
 
 //GET Bet History and Results
 
 const getBetHistory = async (req, res) => {
   try {
     const bets = await Bet.find({ user: req.user.id }).populate('game');
     res.json(bets);
   } catch (err) {
     console.error('Error fetching bet history:', err.message);
     res.status(500).json({ msg: 'Server error' });
   }
 };
 
 module.exports.getBetHistory = getBetHistory;


 


 
 const  processPayouts  = require('../services/betService');

exports.setGameResult = async (req, res) => {
  const { gameId, result } = req.body;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    return res.status(400).json({ msg: "Invalid game ID" });
  }

  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: "Game not found" });

    if (game.result !== "Pending") {
      return res.status(400).json({ msg: "Result already set" });
    }

    game.result = result;
    await game.save();

    // Process payouts
    await processPayouts(game);

    res.status(200).json({ msg: "Result set and payouts processed", game });
  } catch (error) {
    console.error("Error setting game result:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
 

//BONUS ON BET 

exports.setGameResult = async (req, res) => {
  const { gameId, result } = req.body;

  try {
    const game = await Game.findById(gameId);
    game.result = result;
    await game.save();

    const bets = await Bet.find({ game: gameId });

    for (const bet of bets) {
      const user = await User.findById(bet.user);

      if (bet.prediction === result) {
        const winnings = bet.amount * game.odds;
        user.wallet += winnings;
        await user.save();

        // 👇 Here is the right place to give bonus
        await giveBonus(user, bet._id, bet.amount, 5); // 5% bonus
      }

      bet.result = result;
      await bet.save();
    }

    res.status(200).json({ msg: "Game result set and winnings processed" });
  } catch (error) {
    console.error("Set game result error:", error.message);
    res.status(500).json({ msg: "Server error"});
}
};
 
 
const Bet = require('../models/betModel');
const User = require('../models/userModel');
const Game = require('../models/gameModel');

exports.placeBet = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { gameId, selectedOutcome, stake } = req.body;

    // 1. Check if game exists
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' });

    // 2. Get user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // 3. Check if user has enough balance
    if (user.wallet_balance < stake) {
      return res.status(400).json({ msg: 'Insufficient balance' });
    }

    // 4. Determine odds
    let odds;
    if (selectedOutcome === 'A') odds = game.oddsA;
    else if (selectedOutcome === 'B') odds = game.oddsB;
    else if (selectedOutcome === 'Draw') odds = game.oddsDraw;
    else return res.status(400).json({ msg: 'Invalid outcome' });

    const potentialPayout = stake * odds;

    // 5. Deduct stake and save user
    user.wallet_balance -= stake;
    await user.save();

    // 6. Save bet
    const bet = new Bet({
      user: userId,
      game: gameId,
      selectedOutcome,
      stake,
      potentialPayout,
    });

    await bet.save();

    res.status(201).json({ msg: 'Bet placed successfully', bet });
  } catch (err) {
    console.error('Error placing bet:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getUserBets = async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.user.id }).populate('game');
    res.status(200).json(bets);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
const Game = require('../models/gameModel');
const User = require('../models/userModel');
const Bet = require('../models/betModel');

exports.createGame = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // user info comes from auth middleware
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    const { teamA, teamB, oddsA, oddsB, oddsDraw, date } = req.body;

    if (!teamA || !teamB || !oddsA || !oddsB || !oddsDraw || !date) {
      return res.status(400).json({ msg: 'Please provide all game details.' });
    }

    const game = new Game({ teamA, teamB, oddsA, oddsB, oddsDraw, date });
    await game.save();

    res.status(201).json({ msg: 'Game created successfully', game });
  } catch (err) {
    console.error('Error creating game:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.setGameResult = async (req, res) => {
  try {
    const { gameId, result } = req.body;

    if (!['A', 'B', 'Draw'].includes(result)) {
      return res.status(400).json({ message: 'Invalid result value' });
    }

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    game.result = result;
    await game.save();

    const bets = await Bet.find({ game: gameId });

    for (const bet of bets) {
      if (bet.selectedOutcome === result) {
        bet.status = 'won';
        const user = await User.findById(bet.user);
        if (user) {
          user.wallet_balance += bet.potentialPayout;
          await user.save();
        }
      } else {
        bet.status = 'lost';
      }
      await bet.save();
    }

    res.status(200).json({ message: 'Result updated and bets processed successfully' });
  } catch (err) {
    console.error(' setGameResult error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
  
  exports.processPayouts = async (req, res) => {
    try {
      const { gameId } = req.body;
      const game = await Game.findById(gameId);
      if (!game || game.result === 'pending') {
        return res.status(400).json({ msg: 'Game result not set or game not found' });
      }
  
      const bets = await Bet.find({ game: gameId });
  
      for (const bet of bets) {
        if (bet.status !== 'pending') continue; // Skip already processed
  
        if (bet.selectedOutcome === game.result) {
          bet.status = 'won';
          const user = await User.findById(bet.user);
          user.wallet_balance += bet.potentialPayout;
          await user.save();
        } else {
          bet.status = 'lost';
        }
  
        await bet.save();
      }
  
      res.status(200).json({ msg: 'Payouts processed successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  };

  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
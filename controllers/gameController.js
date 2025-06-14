const Game = require('../models/gameModel');

exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ date: 1 });
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
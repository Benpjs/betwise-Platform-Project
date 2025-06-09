const Game = require("../models/gameModel");
const mongoose = require("mongoose");
const gameservice = require("../services/betService");


// CREATING OF GAMES

exports.createGame = async (req, res) => {
  const { teamA, teamB, oddsA, oddsB, oddsDraw } = req.body;

  try {
    const game = new Game({ teamA, teamB, oddsA, oddsB, oddsDraw });
    await game.save();
    res.status(201).json({ msg: "Game created", game });
  } catch (err) {
    res.status(500).json({ msg: "Error creating game", error: err.message });
  }
};

// GETTING OAA AVAILABLE GAMES

exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching games", error: err.message });
  }
};




// ADMIN SETS RESULT
const { processPayouts } = require("../services/betService");

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
    res.status(500).json({ msg: "Server error" });
  }
};

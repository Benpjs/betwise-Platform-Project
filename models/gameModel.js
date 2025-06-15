const mongoose = require("mongoose");
const gameSchema = new mongoose.Schema({
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  oddsA: { type: Number, required: true },
  oddsB: { type: Number, required: true },
  oddsDraw: { type: Number, required: true },
  date: { type: Date, required: true },
  result: { type: String, enum: ['A', 'B', 'Draw', 'pending'], default: 'pending' }

}, { timestamps: true } );

  
  
   const Game = new mongoose.model("Game", gameSchema)
  
  module.exports = Game
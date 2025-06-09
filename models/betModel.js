const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  prediction: { type: String, enum: ["A", "B", "draw"], required: true },
  stake: { type: Number, required: true },
  potentialPayout: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "won", "lost"], default: "pending" },
  isPaid: {type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Bet', betSchema);


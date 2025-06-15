const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  selectedOutcome: { type: String, enum: ['A', 'B', 'Draw'], required: true },
  stake: { type: Number, required: true },
  potentialPayout: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' }
}, { timestamps: true}  );

module.exports = mongoose.model('Bet', betSchema);


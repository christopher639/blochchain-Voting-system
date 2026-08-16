const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  voterId: { type: String, required: true },
  choice: { type: String, required: true },
  position: { type: String, required: true },
  timestamp: { type: Number, required: true },
  hash: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Vote', VoteSchema);

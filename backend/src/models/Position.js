const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Position', PositionSchema);

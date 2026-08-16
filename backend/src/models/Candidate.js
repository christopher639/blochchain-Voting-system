const mongoose = require('mongoose');

const RunningMateSchema = new mongoose.Schema({
  name: { type: String },
  studentId: { type: String },
  imageUrl: { type: String },
  biography: { type: String }
}, { _id: false });

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String },
  imageUrl: { type: String },
  biography: { type: String },
  position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true },
  runningMate: { type: RunningMateSchema },
  active: { type: Boolean, default: true },
  metadata: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);

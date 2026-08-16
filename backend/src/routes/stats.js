const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const Position = require('../models/Position');

router.get('/', async (req, res) => {
  try {
    const votesCount = await Vote.countDocuments();
    const candidatesCount = await Candidate.countDocuments();
    const positionsCount = await Position.countDocuments();
    const usersCount = await User.countDocuments();
    const pending = await User.countDocuments({ registrationStatus: 'pending' });
    const approved = await User.countDocuments({ registrationStatus: 'approved' });
    const rejected = await User.countDocuments({ registrationStatus: 'rejected' });
    res.json({ votesCount, candidatesCount, positionsCount, usersCount, pending, approved, rejected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

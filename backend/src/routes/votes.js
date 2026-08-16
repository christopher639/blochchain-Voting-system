const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const crypto = require('crypto');

// allow anonymous submissions (voterId provided by client) so frontend can submit without JWT
router.post('/', async (req, res) => {
  const { voterId, choice, position, timestamp } = req.body;
  if (!voterId || !choice || !position) return res.status(400).json({ error: 'voterId, choice, position required' });
  // prevent double-voting for same position
  const existing = await Vote.findOne({ voterId, position });
  if (existing) return res.json({ success: false, message: 'already voted', hash: existing.hash });
  const data = `${voterId}|${choice}|${position}|${timestamp || Date.now()}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  const vote = new Vote({ voterId, choice, position, timestamp: timestamp || Date.now(), hash });
  await vote.save();
  res.json({ success: true, hash });
});

router.get('/', async (req, res) => {
  const votes = await Vote.find();
  res.json(votes);
});

// Check if a voter has voted
router.get('/check/:voterId', async (req, res) => {
  const { voterId } = req.params;
  try {
    const votes = await Vote.find({ voterId });
    const hasVoted = votes && votes.length > 0;
    res.json({ hasVoted, voteCount: votes?.length || 0 });
  } catch (err) {
    console.error('Error checking voting status:', err);
    res.status(500).json({ error: 'Failed to check voting status' });
  }
});

module.exports = router;

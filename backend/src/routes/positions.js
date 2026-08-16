const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const Candidate = require('../models/Candidate');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const items = await Position.find().sort({ displayOrder: 1, name: 1 });
  // augment with candidate counts
  const results = await Promise.all(items.map(async p => {
    const count = await Candidate.countDocuments({ position: p._id, active: true });
    return { ...p.toObject(), candidateCount: count };
  }));
  res.json(results);
});

router.post('/', auth, requireRole('admin'), async (req, res) => {
  const { name, description, displayOrder, active } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try{
    const pos = new Position({ name, description, displayOrder: displayOrder || 0, active: active===undefined ? true : !!active });
    await pos.save();
    res.json(pos);
  }catch(err){ res.status(500).json({ error: err.message }) }
});

router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try{
    const pos = await Position.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pos) return res.status(404).json({ error: 'not found' });
    res.json(pos);
  }catch(err){ res.status(500).json({ error: err.message }) }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try{
    await Position.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }catch(err){ res.status(500).json({ error: err.message }) }
});

module.exports = router;

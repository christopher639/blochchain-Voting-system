const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const { auth, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir) },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const items = await Candidate.find({}).populate('position').lean();
  res.json(items.map(i=>({
    ...i,
    position: i.position ? { _id: i.position._id, name: i.position.name } : null
  })));
});

// Accept multipart/form-data with optional candidateImage and runningMateImage files
router.post('/', auth, requireRole('admin'), upload.fields([{ name: 'candidateImage' }, { name: 'runningMateImage' }]), async (req, res) => {
  try{
    const { name, studentId, biography, position, runningMate } = req.body;
    if (!name || !position) return res.status(400).json({ error: 'name and position required' });
    // validate position exists
    const pos = await Position.findById(position);
    if (!pos) return res.status(400).json({ error: 'invalid position' });

    const itemData = { name, studentId, biography, position };
    if (runningMate) {
      try { itemData.runningMate = JSON.parse(runningMate) } catch(e){ itemData.runningMate = { name: runningMate } }
    }

    if (req.files && req.files.candidateImage && req.files.candidateImage[0]){
      itemData.imageUrl = `/uploads/${req.files.candidateImage[0].filename}`;
    }
    if (req.files && req.files.runningMateImage && req.files.runningMateImage[0]){
      itemData.runningMate = itemData.runningMate || {};
      itemData.runningMate.imageUrl = `/uploads/${req.files.runningMateImage[0].filename}`;
    }

    const item = new Candidate(itemData);
    await item.save();
    res.json(item);
  }catch(err){ console.error(err); res.status(500).json({ error: err.message }) }
});

// update candidate
router.put('/:id', auth, requireRole('admin'), upload.fields([{ name: 'candidateImage' }, { name: 'runningMateImage' }]), async (req, res) => {
  try{
    const updates = {};
    const { name, studentId, biography, position, runningMate } = req.body;
    if (name) updates.name = name;
    if (studentId) updates.studentId = studentId;
    if (biography) updates.biography = biography;
    if (position) {
      const pos = await Position.findById(position);
      if (!pos) return res.status(400).json({ error: 'invalid position' });
      updates.position = position;
    }
    if (runningMate) {
      try { updates.runningMate = JSON.parse(runningMate) } catch(e){ updates.runningMate = { name: runningMate } }
    }
    if (req.files && req.files.candidateImage && req.files.candidateImage[0]){
      updates.imageUrl = `/uploads/${req.files.candidateImage[0].filename}`;
    }
    if (req.files && req.files.runningMateImage && req.files.runningMateImage[0]){
      updates.runningMate = updates.runningMate || {};
      updates.runningMate.imageUrl = `/uploads/${req.files.runningMateImage[0].filename}`;
    }
    const updated = await Candidate.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'not found' });
    res.json(updated);
  }catch(err){ console.error(err); res.status(500).json({ error: err.message }) }
});

// soft-delete / deactivate
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try{
    const updated = await Candidate.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!updated) return res.status(404).json({ error: 'not found' });
    res.json({ success: true, candidate: updated });
  }catch(err){ res.status(500).json({ error: err.message }) }
});

module.exports = router;

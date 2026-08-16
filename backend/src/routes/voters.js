const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: (req,file,cb)=>cb(null,uploadDir), filename: (req,file,cb)=>{
  const ext = path.extname(file.originalname); cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
}});
const upload = multer({ storage });

// Public registration (multipart w/ optional profileImage)
router.post('/register', upload.single('profileImage'), async (req, res) => {
  try{
    const { fullName, studentId, email, phone, username, password } = req.body;
    if (!username || !password || !email || !fullName) return res.status(400).json({ error: 'username, password, email, fullName required' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'username exists' });
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(password, 10);
    const userData = { username, passwordHash: hash, role: 'voter', fullName, email, studentId, phone };
    if (req.file) userData.profileImage = `/uploads/${req.file.filename}`;
    // registrationStatus default is pending, accountStatus inactive
    const user = new User(userData);
    await user.save();
    res.json({ success: true, userId: user._id });
  }catch(err){ console.error(err); res.status(500).json({ error: err.message }) }
});

// Admin: list voters with optional filter
router.get('/', auth, requireRole('admin'), async (req, res) => {
  const q = {};
  if (req.query.status) q.registrationStatus = req.query.status;
  const users = await User.find(q).sort({ createdAt: -1 }).limit(200);
  res.json(users);
});

// Admin: get pending
router.get('/pending', auth, requireRole('admin'), async (req, res) => {
  const users = await User.find({ registrationStatus: 'pending' }).sort({ createdAt: 1 });
  res.json(users);
});

// Admin: approve
router.post('/:id/approve', auth, requireRole('admin'), async (req, res) => {
  try{
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'not found' });
    user.registrationStatus = 'approved';
    user.accountStatus = 'active';
    user.verified = true;
    await user.save();
    res.json({ success: true });
  }catch(err){ res.status(500).json({ error: err.message }) }
});

// Admin: reject
router.post('/:id/reject', auth, requireRole('admin'), async (req, res) => {
  try{
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'not found' });
    user.registrationStatus = 'rejected';
    user.accountStatus = 'inactive';
    await user.save();
    res.json({ success: true });
  }catch(err){ res.status(500).json({ error: err.message }) }
});

module.exports = router;

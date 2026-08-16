const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  // keep original basic register for internal use (admin created users)
  const { username, password, role, fullName, email, studentId } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'username exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash: hash, role: role || 'voter', fullName, email, studentId });
    // if admin creates a user, mark active
    if (role === 'admin') { user.accountStatus = 'active'; user.registrationStatus = 'approved'; }
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'invalid credentials' });
    // check registration & account status for voters
    if (user.role === 'voter'){
      if (user.registrationStatus === 'pending') return res.status(403).json({ error: 'registration_pending', message: 'Your registration is awaiting administrator approval.' });
      if (user.registrationStatus === 'rejected') return res.status(403).json({ error: 'registration_rejected', message: 'Your registration was rejected. Contact an administrator.' });
      if (user.accountStatus !== 'active') return res.status(403).json({ error: 'account_inactive', message: 'Your account is not active.' });
    }
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
    return res.json({ token, user: { username: user.username, role: user.role, fullName: user.fullName, registrationStatus: user.registrationStatus } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

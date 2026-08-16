const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','voter'], default: 'voter' },
  fullName: { type: String },
  email: { type: String },
  studentId: { type: String },
  phone: { type: String },
  profileImage: { type: String },
  registrationStatus: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  accountStatus: { type: String, enum: ['inactive','active','suspended'], default: 'inactive' },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

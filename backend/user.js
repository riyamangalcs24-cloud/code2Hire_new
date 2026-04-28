const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const profileSchema = new mongoose.Schema({
  headline: { type: String, default: 'Interview aspirant focused on consistent growth.' },
  bio: { type: String, default: 'I am building my interview readiness one topic at a time.' },
  location: { type: String, default: '' },
  targetRole: { type: String, default: 'Software Engineer' },
  experienceLevel: { type: String, default: 'Student / Fresher' },
  skills: { type: [String], default: [] },
}, { _id: false });

const progressEntrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  level: { type: Number, min: 0, max: 4, required: true },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, immutable: true },
  password: { type: String, required: true },
  profile: { type: profileSchema, default: () => ({}) },
  progressHistory: { type: [progressEntrySchema], default: [] },
}, { timestamps: true });

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;

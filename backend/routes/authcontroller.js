const express = require('express');
const router = express.Router();

const User = require('../user');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');
const { buildUserResponse, generateUniqueUsername } = require('../utils/userUtils');
const { buildProgressPayload } = require('../utils/progressUtils');
const { track } = require('../utils/pulseiq');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const loginValue = String(identifier || email || '').trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: loginValue },
        { username: loginValue },
      ],
    });

    if (user && !user.username) {
      user.username = await generateUniqueUsername(user.name, user.email);
      await user.save();
    }

    if (user && (await user.matchPassword(password))) {
      await track('user_logged_in', user._id.toString(), {
        email: user.email,
        username: user.username,
      });
      res.json(buildUserResponse(user, generateToken(user._id)));
    } else {
      res.status(401).json({ message: 'Invalid username/email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      username: await generateUniqueUsername(name, email),
    });

    if (user) {
      await track('user_registered', user._id.toString(), {
        email: user.email,
        username: user.username,
      });
      res.status(201).json(buildUserResponse(user, generateToken(user._id)));
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  res.json(buildUserResponse(req.user, generateToken(req.user._id)));
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      name,
      headline,
      bio,
      location,
      targetRole,
      experienceLevel,
      skills,
    } = req.body;

    user.name = typeof name === 'string' && name.trim() ? name.trim() : user.name;
    user.profile.headline = typeof headline === 'string' ? headline.trim() : user.profile.headline;
    user.profile.bio = typeof bio === 'string' ? bio.trim() : user.profile.bio;
    user.profile.location = typeof location === 'string' ? location.trim() : user.profile.location;
    user.profile.targetRole = typeof targetRole === 'string' ? targetRole.trim() : user.profile.targetRole;
    user.profile.experienceLevel = typeof experienceLevel === 'string' ? experienceLevel.trim() : user.profile.experienceLevel;
    user.profile.skills = Array.isArray(skills)
      ? skills.map((skill) => String(skill).trim()).filter(Boolean).slice(0, 12)
      : user.profile.skills;

    await user.save();
    await track('profile_updated', user._id.toString(), {
      targetRole: user.profile.targetRole,
      experienceLevel: user.profile.experienceLevel,
      skillsCount: user.profile.skills.length,
    });

    return res.json(buildUserResponse(user, generateToken(user._id)));
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('progressHistory');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(buildProgressPayload(user.progressHistory));
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { date, level } = req.body;
    const normalizedDate = String(date || '').trim();
    const normalizedLevel = Number(level);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
      return res.status(400).json({ message: 'Invalid progress date' });
    }

    if (!Number.isInteger(normalizedLevel) || normalizedLevel < 0 || normalizedLevel > 4) {
      return res.status(400).json({ message: 'Progress level must be between 0 and 4' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingEntryIndex = user.progressHistory.findIndex((entry) => entry.date === normalizedDate);

    if (existingEntryIndex >= 0) {
      if (normalizedLevel === 0) {
        user.progressHistory.splice(existingEntryIndex, 1);
      } else {
        user.progressHistory[existingEntryIndex].level = normalizedLevel;
      }
    } else if (normalizedLevel > 0) {
      user.progressHistory.push({ date: normalizedDate, level: normalizedLevel });
    }

    user.progressHistory = user.progressHistory
      .filter((entry) => entry.level > 0)
      .sort((left, right) => left.date.localeCompare(right.date))
      .slice(-365);

    await user.save();
    await track('progress_updated', user._id.toString(), {
      date: normalizedDate,
      level: normalizedLevel,
      totalTrackedDays: user.progressHistory.length,
    });

    return res.json(buildProgressPayload(user.progressHistory));
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.get('/progress', protect, getProgress);
router.put('/progress', protect, updateProgress);

module.exports = router;
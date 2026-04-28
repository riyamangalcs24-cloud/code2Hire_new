const express = require('express');
const router = express.Router();
const roadmapData = require('../data/roadmap');

// @desc    Fetch roadmap plans
// @route   GET /api/roadmap
// @access  Public
const getRoadmap = (req, res) => {
  try {
    res.json(roadmapData);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching roadmap' });
  }
};

router.get('/', getRoadmap);

module.exports = router;

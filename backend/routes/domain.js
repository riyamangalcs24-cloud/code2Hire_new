const express = require('express');
const router = express.Router();
const domains = require('../data/domains');
const { getTopicDetail } = require('../utils/topicCatalog');

// @desc    Fetch domain structure
// @route   GET /api/domains
// @access  Public
const getDomains = (req, res) => {
  try {
    res.json(domains);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching domains' });
  }
};

router.get('/', getDomains);

router.get('/:domainId/categories/:categoryId/topics/:topicId', (req, res) => {
  const topic = getTopicDetail(req.params.domainId, req.params.categoryId, req.params.topicId);

  if (!topic) {
    return res.status(404).json({ message: 'Topic detail not found' });
  }

  return res.json(topic);
});

module.exports = router;
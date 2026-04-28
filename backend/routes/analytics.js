const express = require('express');
const { track } = require('../utils/pulseiq');

const router = express.Router();

router.post('/event', async (req, res) => {
  const {
    eventName,
    userId = null,
    anonymousId = 'web_anonymous',
    properties = {},
  } = req.body || {};

  if (!eventName) {
    return res.status(400).json({ message: 'eventName is required' });
  }

  await track(eventName, userId, properties, anonymousId);
  return res.status(202).json({ success: true });
});

module.exports = router;
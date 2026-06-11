const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { message: 'API v1 is healthy' } });
});

module.exports = router;

const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { message: 'API v1 is healthy' } });
});

router.use('/auth', authRoutes);

module.exports = router;


const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const tasksRoutes = require('../modules/tasks/tasks.routes');
const usersRoutes = require('../modules/users/users.routes');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { message: 'API v1 is healthy' } });
});

router.use('/auth', authRoutes);
router.use('/tasks', tasksRoutes);
router.use('/users', usersRoutes);

module.exports = router;



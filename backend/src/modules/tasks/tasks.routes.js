const express = require('express');
const validate = require('../../middleware/validate');
const { createTaskSchema, updateTaskSchema } = require('./tasks.schema');
const { getTasks, createTask, updateTask, deleteTask, getAllTasks } = require('./tasks.controller');
const { authenticateJWT, requireRole } = require('../../middleware/auth');

const router = express.Router();

router.use(authenticateJWT);

// Admin-only route must come before /:id routes
router.get('/all', requireRole('ADMIN'), getAllTasks);

router.get('/', getTasks);
router.post('/', validate(createTaskSchema), createTask);
router.patch('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;

const express = require('express');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema } = require('./auth.schema');
const { register, login, refresh, logout } = require('./auth.controller');
const { authenticateJWT } = require('../../middleware/auth');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', authenticateJWT, logout);

module.exports = router;

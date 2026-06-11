const express = require('express');
const validate = require('../../middleware/validate');
const { updateRoleSchema } = require('./users.schema');
const { getUsers, updateUserRole, deleteUser } = require('./users.controller');
const { authenticateJWT, requireRole } = require('../../middleware/auth');

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole('ADMIN'));

router.get('/', getUsers);
router.patch('/:id/role', validate(updateRoleSchema), updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;

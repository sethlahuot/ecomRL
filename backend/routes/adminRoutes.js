const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// User management routes
router.get('/users', isAdmin, userController.getAllUsers);
router.delete('/users/:id', isAdmin, userController.deleteUser);
router.patch('/users/:id/role', isAdmin, userController.updateUserRole);

module.exports = router; 
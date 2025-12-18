const express = require('express');
const { adminLogin, logout, checkAuth, protect } = require('../controller/adminController');

const router = express.Router();

// POST /api/admin/login - Admin login
router.post('/login', adminLogin);

// POST /api/admin/logout - Admin logout
router.post('/logout', logout);

// GET /api/admin/check-auth - Check if admin is authenticated
router.get('/check-auth', checkAuth);

module.exports = router;
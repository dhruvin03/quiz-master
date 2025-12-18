const express = require('express');
const { adminLogin } = require('../controller/adminController');

const router = express.Router();

// POST /api/admin/login - Admin login
router.post('/login', adminLogin);

module.exports = router;
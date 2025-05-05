const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profile');
const authenticate = require('../Midellware/authMiddleware');

router.post('/profile', authenticate, profileController.getProfile);
module.exports = router;
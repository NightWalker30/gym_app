const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/profile');

router.post('/profile', getProfile);

module.exports = router;
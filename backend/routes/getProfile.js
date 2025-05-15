const express = require('express');
const router = express.Router();
const User = require('../models/Utilisateur'); // Adjust the path if needed


const profileController = require('../controllers/profile');
const authenticate = require('../Midellware/authMiddleware');

router.post('/profile', authenticate, profileController.getProfile);
router.put('/update', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});
module.exports = router;
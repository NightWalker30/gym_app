const express = require('express');
const router = express.Router();
const Exercice = require('../models/exercice');

// POST route to bulk upload exercises (use once)
router.post('/exercises/init', async (req, res) => {
  try {
    const { exercises } = req.body;
    await Exercice.insertMany(exercises);
    return res.status(200).json({ success: true, message: 'Exercises saved to MongoDB' });
  } catch (error) {
    console.error('Error saving exercises:', error);
    return res.status(500).json({ success: false, message: 'Error saving exercises to MongoDB' });
  }
});

module.exports = router;

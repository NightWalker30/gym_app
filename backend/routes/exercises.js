const express = require('express');
const router = express.Router();
const Exercice = require('../models/exercice');

// Endpoint to fetch all exercises
router.get('/exercises', async (req, res) => {
  try {
    const exercises = await Exercice.find();
    // If you want to include additional processing (e.g., format images or filter fields), do it here
    const formattedExercises = exercises.map(ex => ({
      id: ex._id,
      name: ex.nom,
      force: ex.force,
      level: ex.level,
      mechanic: ex.mechanic,
      equipment: ex.equipement || "body only",  // Default to "body only" if no equipment
      primaryMuscles: ex.primaryMuscles,
      secondaryMuscles: ex.secondaryMuscles,
      instructions: ex.description ? [ex.description] : [],  // Format as array
      category: ex.category || 'general',  // Default category
      images: ex.images,
      video: ex.video,
    }));

    return res.json(formattedExercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return res.status(500).json({ success: false, message: 'Error fetching exercises' });
  }
});

module.exports = router;

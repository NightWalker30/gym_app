const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Utilisateur = require('../models/Utilisateur');
const { exercices } = require('../data/exercices'); // Static list

// Helper to match exercise name from the static list
function getExerciseByName(name) {
  return exercices.find(ex => ex.name === name);
}

// ▶️ Create a new workout for a user
router.post('/create/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, exerciseNames = [], notes } = req.body;

    // Check if user exists
    const user = await Utilisateur.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Match exercises from static data
    const matchedExercises = exerciseNames.map(name => {
      const ex = getExerciseByName(name);
      if (!ex) throw new Error(`Exercise "${name}" not found`);
      return {
        name: ex.name,
        description: ex.instructions.join(' '),
        category: ex.category || 'Other',
        muscleGroups: [...(ex.primaryMuscles || []), ...(ex.secondaryMuscles || [])],
        photo: ex.images[0] || '',
        video: '', // optional
        duration: 10, // default 10 mins
        calories: 50 // default 50 cals
      };
    });

    const totalDuration = matchedExercises.reduce((sum, ex) => sum + ex.duration, 0);
    const totalCalories = matchedExercises.reduce((sum, ex) => sum + ex.calories, 0);

    const workout = new Workout({
      userId,
      name,
      exercises: matchedExercises,
      duration: totalDuration,
      caloriesBurned: totalCalories,
      notes
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ▶️ Get all workouts for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ▶️ (Optional) Get all workouts
router.get('/', async (req, res) => {
  try {
    const allWorkouts = await Workout.find().populate('userId', 'prenom nom email');
    res.json(allWorkouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ▶️ Get a specific workout by ID
router.get('/:id', async (req, res) => {
  try {
    
    const workout = await Workout.findById(req.params.id).populate('userId', 'prenom nom email');
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

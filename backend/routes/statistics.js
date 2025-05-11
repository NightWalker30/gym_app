const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const User = require('../models/Utilisateur');
const authenticate = require('../Midellware/authMiddleware'); // ⬅️ import middleware

// Calculate calories
const calculateCalories = (exercise, weight, gender) => {
  let MET = exercise.met || 5;
  let duration = exercise.duration || 30;
  let caloriesBurned = ((MET * 3.5 * weight) / 200) * duration;

  if (gender === 'female') {
    caloriesBurned *= 0.85;
  }

  return caloriesBurned;
};

// 🛡 Apply authentication middleware
router.get('/', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, exerciseType } = req.query;
    const user = await User.findById(req.user.userId); // now this will work

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    let query = { userId: req.user.userId };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (exerciseType) {
      query['exercises.type'] = exerciseType;
    }

    const workouts = await Workout.find(query);

    let totalCalories = 0;
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const calories = calculateCalories(exercise, user.poids || 70, user.sexe || 'male');
        totalCalories += calories;
      });
    });

    res.status(200).json({
      workouts,
      totalCalories,
      workoutCount: workouts.length,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;

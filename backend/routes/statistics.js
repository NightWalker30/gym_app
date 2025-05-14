const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const User = require('../models/Utilisateur');
const authenticate = require('../Midellware/authMiddleware');

// 🔥 Updated calorie calculator
const calculateCalories = (workout, weight, gender) => {
  let calories = 0;

  if (workout.type === 'strength' && Array.isArray(workout.exercises)) {
    // Calculate based on each exercise
    workout.exercises.forEach(ex => {
      const MET = ex.met || 5;
      const duration = ex.duration || 10;
      let exCalories = ((MET * 3.5 * weight) / 200) * duration;
      if (gender === 'female') exCalories *= 0.85;
      calories += exCalories;
    });
  } else if (workout.type === 'cardio' || workout.type === 'yoga') {
    const MET = workout.type === 'cardio' ? 6 : 3; // Avg MET values
    const duration = workout.duration || 30;
    calories = ((MET * 3.5 * weight) / 200) * duration;
    if (gender === 'female') calories *= 0.85;
  }

  return calories;
};

// 📊 Stats endpoint
router.get('/', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, exerciseType } = req.query;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    let query = {
      userId: req.user.userId,
      status: 'completed',
      ...(startDate && endDate && {
        completedDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }),
      ...(exerciseType && { type: exerciseType })
    };

    const workouts = await Workout.find(query);
    let totalCalories = 0;

    workouts.forEach(workout => {
      totalCalories += calculateCalories(workout, user.poids || 70, user.sexe || 'male');
    });

    res.status(200).json({
      workouts,
      totalCalories,
      workoutCount: workouts.length
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;

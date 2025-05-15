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

router.get('/progress', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    let query = {
      userId: req.user.userId,
      status: 'completed',
      ...(startDate && endDate && {
        completedDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
      })
    };

    const workouts = await Workout.find(query);
    const poids = user.poids || 70;
    const sexe = user.sexe || 'male';

    // --- Grouping logic ---
    const caloriesPerDay = {};
    const workoutsPerDay = {};
    const workoutTypes = {};

    workouts.forEach(workout => {
      const date = new Date(workout.completedDate).toISOString().slice(0, 10); // '2025-05-14'
      const dayLabel = new Date(workout.completedDate).toLocaleDateString('en-US', { weekday: 'short' }); // 'Mon'

      const calories = calculateCalories(workout, poids, sexe);

      // Line chart data: calories per day
      caloriesPerDay[date] = (caloriesPerDay[date] || 0) + calories;

      // Bar chart data: workout count per day of week
      workoutsPerDay[dayLabel] = (workoutsPerDay[dayLabel] || 0) + 1;

      // Pie chart data: workout types
      workoutTypes[workout.type] = (workoutTypes[workout.type] || 0) + 1;
    });

    // Format output
    const formattedCaloriesPerDay = Object.entries(caloriesPerDay).map(([date, calories]) => ({
      date,
      calories: Math.round(calories)
    }));

    const formattedWorkoutsPerDay = Object.entries(workoutsPerDay).map(([day, count]) => ({
      day,
      count
    }));

    const formattedWorkoutTypes = Object.entries(workoutTypes).map(([name, count]) => ({
      name,
      count
    }));

    res.status(200).json({
      caloriesPerDay: formattedCaloriesPerDay,
      workoutsPerDay: formattedWorkoutsPerDay,
      workoutTypes: formattedWorkoutTypes
    });

  } catch (error) {
    console.error('Erreur progress stats:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

const dayjs = require('dayjs');

// 📅 Streaks & Consistency
router.get('/streaks', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = dayjs().startOf('day');
    const startOfMonth = today.startOf('month');

    // Get all completed workouts this month
    const workouts = await Workout.find({
      userId,
      status: 'completed',
      completedDate: { $gte: startOfMonth.toDate(), $lte: today.toDate() }
    });

    // Extract unique workout dates in YYYY-MM-DD format
    const workoutDatesSet = new Set(
      workouts.map(w =>
        dayjs(w.completedDate).startOf('day').format('YYYY-MM-DD')
      )
    );

    const allDates = Array.from(workoutDatesSet).sort(); // for consistency % and calendar
    const totalDays = today.diff(startOfMonth, 'day') + 1;
    const consistency = Math.round((allDates.length / totalDays) * 100);

    // Calculate current streak (consecutive days including today)
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD');
      if (workoutDatesSet.has(date)) {
        streak++;
      } else {
        break;
      }
    }

    res.status(200).json({
      dates: allDates,
      currentStreak: streak,
      consistency: consistency
    });
  } catch (error) {
    console.error('Erreur dans /streaks:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;

module.exports = router;

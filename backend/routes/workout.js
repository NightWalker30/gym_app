const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Utilisateur = require('../models/Utilisateur');
const { exercices } = require('../data/exercices'); // Static list

// Helper to match exercise name from the static list
function getExerciseByName(name) {
  return exercices.find(ex => ex.name === name);
}

// ▶️ Create a reusable workout template
router.post('/create/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, exerciseNames = [], notes, type = 'strength', duration } = req.body;

    const user = await Utilisateur.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let matchedExercises = [];
    let totalDuration = 0;
    let totalCalories = 0;

    if (type === 'cardio' || type === 'yoga') {
      if (!duration) return res.status(400).json({ error: 'Duration is required for cardio/yoga' });

      matchedExercises.push({
        name: type === 'cardio' ? 'Cardio Session' : 'Yoga Session',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} workout of ${duration} minutes`,
        muscleGroups: [],
        photo: '',
        video: '',
        duration,
        calories: duration * 8, // estimate ~8 kcal/min
      });

      totalDuration = duration;
      totalCalories = duration * 8;

    } else {
      // Handle strength workouts with actual exercises
      matchedExercises = exerciseNames.map(name => {
        const ex = getExerciseByName(name);
        if (!ex) throw new Error(`Exercise "${name}" not found`);
        return {
          name: ex.name,
          description: ex.instructions.join(' '),
          muscleGroups: [...(ex.primaryMuscles || []), ...(ex.secondaryMuscles || [])],
          photo: ex.images[0] || '',
          video: '',
          duration: 10,
          calories: 50,
        };
      });

      totalDuration = matchedExercises.reduce((sum, ex) => sum + ex.duration, 0);
      totalCalories = matchedExercises.reduce((sum, ex) => sum + ex.calories, 0);
    }

    const workout = new Workout({
      userId,
      name,
      type,
      exercises: matchedExercises,
      duration: totalDuration,
      caloriesBurned: totalCalories,
      notes,
      isTemplate: true,
      status: 'template',
    });

    await workout.save();
    res.status(201).json(workout);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📅 Plan a workout from a template
// 📅 Plan or re-plan a workout (template or not)
router.post('/plan/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    const { plannedDate } = req.body;

    const workout = await Workout.findById(templateId);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (workout.isTemplate) {
      // ➕ It's a template: create a new planned copy
      const plannedWorkout = new Workout({
        ...workout.toObject(),
        _id: undefined, // Create new
        isTemplate: false,
        status: 'planned',
        plannedDate
      });

      await plannedWorkout.save();
      return res.status(201).json(plannedWorkout);
    } else {
      // 🔁 Not a template: just update plannedDate
      workout.plannedDate = plannedDate;
      workout.status = 'planned';
      await workout.save();
      return res.status(200).json(workout);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start a workout now from a template
router.post('/start/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = await Workout.findById(templateId);
    if (!template || !template.isTemplate) {
      return res.status(404).json({ error: 'Workout template not found' });
    }

    const completedWorkout = new Workout({
      ...template.toObject(),
      _id: undefined,
      isTemplate: false,
      status: 'completed',
      completedDate: new Date()
    });
    await completedWorkout.save();
    res.status(201).json(completedWorkout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all planned workouts for a user
router.get('/planned/:userId', async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.params.userId,
      status: 'planned'
    });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch('/complete/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        completedDate: new Date()
      },
      { new: true }
    );
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/user/:userId', async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.params.userId
    });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/:id' , async (req , res) =>  {
try {
  const workout = await Workout.findById(req.params.id);
  res.json(workout);
  } catch (err) {
    res.status(500).json({error : err.message});
  }

});


module.exports = router;

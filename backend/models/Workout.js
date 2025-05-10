const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  muscleGroups: [String],
  photo: { type: String },
  video: { type: String },
  duration: { type: Number }, // in minutes
  calories: { type: Number },
});

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['cardio', 'yoga', 'strength'], required: false },
  date: { type: Date, default: Date.now },

  // Time-based sessions (cardio/yoga)
  duration: { type: Number }, // in minutes
  caloriesBurned: { type: Number },

  // Strength session
  exercises: [exerciseSchema],

  notes: { type: String }
});

module.exports = mongoose.model('Workout', workoutSchema);

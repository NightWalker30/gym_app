const mongoose = require('mongoose'); // Import mongoose

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
  type: { type: String, enum: ['cardio', 'yoga', 'strength'], required: true },

  // Reusability & Planning
  isTemplate: { type: Boolean, default: true },  // ✅ Indicates if reusable
  plannedDate: { type: Date },                    // ✅ Optional planning calendar
  completedDate: { type: Date },                  // ✅ When the user actually did it
  status: {                                       // ✅ Status of this workout instance
    type: String,
    enum: ['planned', 'completed', 'template'],
    default: 'template'
  },

  // Time-based sessions
  duration: { type: Number },
  caloriesBurned: { type: Number },

  // Strength workouts
  exercises: [exerciseSchema],

  notes: { type: String }
});
const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
const mongoose = require('mongoose');

const exerciceSchema = new mongoose.Schema({
  nom: { type: String, required: false },
  series: { type: Number, required: false },
  repetitions: { type: Number, required: false },
  charge: { type: Number, required: false },
  rythme: { type: String, required: false },
  duree: { type: String, required: false },
  description: { type: String, required: false },
  images: [{ type: String }],  // Array of image URLs
  video: { type: String },  // URL for a video (if applicable)
  category: { type: String, required: false },  // Category like 'strength', etc.
  force: { type: String, required: false },  // Force type like 'push', 'pull', etc.
  level: { type: String, required: false },  // Difficulty level like 'beginner', etc.
  mechanic: { type: String, required: false },  // Mechanic type (e.g., compound)
  primaryMuscles: [{ type: String }],  // Primary muscles worked
  secondaryMuscles: [{ type: String }],  // Secondary muscles worked
});

const Exercice = mongoose.model('Exercice', exerciceSchema);

module.exports = Exercice;

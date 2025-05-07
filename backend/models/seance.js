const mongoose = require('mongoose');
const Exercice = require('./exercice'); // Import du modèle Exercice

const seanceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String, enum: ['musculation', 'course'], required: true },
  duree: { type: String },
  exercices: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Exercice', // Référence au modèle Exercice
    default: []
  }
});
const Seance = mongoose.model('Seance', seanceSchema);
module.exports = Seance;

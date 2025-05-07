const mongoose = require('mongoose');

const exerciceSchema = new mongoose.Schema({
  nom: { type: String, required: false },

  series: { type: Number, required: false },
  repetitions: { type: Number, required: false },
  charge: { type: Number, required: false },
  rythme: { type: String, required: false },
  duree: { type: String, required: false },
  description: { type: String, required: false }
});

const Exercice = mongoose.model('Exercice', exerciceSchema);

module.exports = Exercice;

const mongoose = require('mongoose');

// Définition du schéma de l'utilisateur
const UserSchema = new mongoose.Schema({
  prenom: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  date_naissance: {
    type: Date,
    required: true,
  },
  ville: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pay: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  sexe: {
    type: String,
    enum: ['homme', 'femme'],
    required: false,
  },
  poids: {
    type: Number, // en kilogrammes
    required: false,
  },
  taille: {
    type: Number, // en centimètres
    required: false,
  },
  niveau_activite: {
    type: String,
    enum: ['faible', 'modere', 'eleve'],
    default: 'modere',
  }
}, { timestamps: true });

module.exports = mongoose.model('Utilisateur', UserSchema);

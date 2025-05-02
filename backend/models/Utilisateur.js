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
  age: {
    type: Number,
    required: true,
  },
  ville: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // L'email doit être unique dans la base de données
  },
  pay: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Ajoute les champs `createdAt` et `updatedAt`

// Création du modèle à partir du schéma
module.exports = mongoose.model('Utilisateur', UserSchema);

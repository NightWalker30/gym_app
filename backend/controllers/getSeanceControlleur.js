// controllers/seanceController.js
const Seance = require('../models/seance');

// Fonction pour récupérer toutes les séances
const getSeances = async (req, res) => {
  try {
    const seances = await Seance.find(); // Récupérer toutes les séances de la base de données
    res.json(seances); // Retourner les séances en réponse
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des séances');
  }
};

// Fonction pour ajouter une nouvelle séance
const addSeance = async (req, res) => {
  const { nom, type, duree } = req.body; // Récupérer les données de la requête

  try {
    // Créer une nouvelle séance avec les données
    const newSeance = new Seance({
      nom,
      type,
      duree,
    });

    // Sauvegarder la séance dans la base de données
    await newSeance.save();

    res.status(201).json(newSeance); // Retourner la séance ajoutée en réponse
  } catch (error) {
    res.status(500).send('Erreur lors de l\'ajout de la séance');
  }
};

module.exports = { getSeances, addSeance };

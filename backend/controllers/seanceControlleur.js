const Seance = require('../models/seance');

exports.creerSeance = async (req, res) => {
  try {
    const { nom, type, duree } = req.body;

    const nouvelleSeance = new Seance({
      nom,
      type,
      duree,
      exercices: []
    });

    const saved = await nouvelleSeance.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la séance' });
  }
};

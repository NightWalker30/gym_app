const Seance = require('../models/seance');
const Exercice = require('../models/exercice');

// Méthode pour ajouter un exercice à une séance
exports.ajouterExercice = async (req, res) => {
  const { id } = req.params; // Récupération de l'ID de la séance depuis les paramètres
  const { nom, series, repetitions, charge, description } = req.body; // Récupération des données de l'exercice depuis le corps de la requête

  // Vérification des données reçues
  console.log("ID de la séance reçu:", id);
  console.log("Données de l'exercice reçues:", { nom, series, repetitions, charge, description });

  try {
    // Création d'un nouvel exercice
    const newExercice = new Exercice({
      nom,
      series,
      repetitions,
      charge,
      description
    });

    // Sauvegarde du nouvel exercice dans la base de données
    const savedExercice = await newExercice.save();
    console.log("Exercice sauvegardé:", savedExercice);

    // Récupérer la séance avec l'ID donné
    const seance = await Seance.findById(id);
    console.log("Séance trouvée:", seance);

    if (!seance) {
      console.log("Séance introuvable");
      return res.status(404).json({ success: false, message: 'Séance introuvable' });
    }

    // Ajouter l'exercice à la séance
    seance.exercices.push(savedExercice._id);
    console.log("Exercice ajouté à la séance, exercice ID:", savedExercice._id);

    // Sauvegarder la séance mise à jour
    await seance.save();
    console.log("Séance mise à jour et sauvegardée");

    return res.status(200).json({ success: true, message: 'Exercice ajouté avec succès à la séance !' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'exercice:', error);
    return res.status(500).json({ success: false, message: 'Une erreur est survenue' });
  }
};

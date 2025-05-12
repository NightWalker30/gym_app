const Utilisateur = require('../models/Utilisateur');

exports.updateProfile = async (req, res) => {
  const { userId } = req.params;  // Get userId from route parameters
  const { poids, taille, sexe, objectif_fitness } = req.body;  // Get the new profile data from the request body

  try {
    // Find the user by userId
    const utilisateur = await Utilisateur.findById(userId);

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Update the user's profile fields
    if (poids) utilisateur.poids = poids;
    if (taille) utilisateur.taille = taille;
    if (sexe) utilisateur.sexe = sexe;
    if (objectif_fitness) utilisateur.objectif_fitness = objectif_fitness;

    // Save the updated user
    await utilisateur.save();

    // Respond with success
    res.status(200).json({ message: 'Profil mis à jour avec succès', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
};

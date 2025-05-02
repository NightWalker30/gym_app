// controllers/userController.js
const User = require('../models/Utilisateur');

// Récupérer le profil de l'utilisateur connecté en utilisant son email
exports.getProfile = async (req, res) => {
  const { email } = req.body; // On suppose que l'email est envoyé dans le corps de la requête (sinon vous pouvez l'obtenir du `req.session`)

  try {
    // Chercher l'utilisateur dans la base de données par son email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Si l'utilisateur est trouvé, on renvoie ses informations
    res.json({ profile: user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
 console.log('hello bro you are in this page')
};

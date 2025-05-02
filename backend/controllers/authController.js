const User = require('../models/Utilisateur'); // Modèle d'utilisateur

// Fonction pour la connexion de l'utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Veuillez fournir un email et un mot de passe." });
    }

    // Trouver l'utilisateur par son email
    const user = await User.findOne({ email });

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(400).json({ success: false, message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Vérifier si le mot de passe correspond
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Si tout est correct, envoyer une réponse de succès
    res.status(200).json({ success: true, message: "Connexion réussie !" });

  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

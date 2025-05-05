const User = require('../models/Utilisateur'); // Modèle d'utilisateur
const jwt = require('jsonwebtoken'); // Importer jsonwebtoken
const bcrypt = require('bcryptjs'); // Importer bcrypt

// Fonction pour la connexion de l'utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Veuillez fournir un email et un mot de passe." });
    }

    console.log('Email reçu:', email);

    // Trouver l'utilisateur par son email
    const user = await User.findOne({ email });

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(400).json({ success: false, message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    //console.log('Utilisateur trouvé:', user);

    // Comparer le mot de passe fourni avec celui stocké (haché)
    const isMatch = await bcrypt.compare(password, user.password);
   // console.log('Match des mots de passe:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload avec les informations de l'utilisateur
      process.env.JWT_SECRET,                  // Clé secrète pour signer le token
      { expiresIn: '1h' }                     // Durée d'expiration du token (1 heure dans cet exemple)
    );

    //console.log('Token généré:', token);

    // Répondre avec le token JWT
    res.status(200).json({ 
      success: true, 
      message: "Connexion réussie !", 
      token: token // Retourner le token dans la réponse
    });

  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur', error: error.message });
  }
};

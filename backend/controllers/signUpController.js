const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

exports.signUp = async (req, res) => {
  const { prenom, nom, date_naissance, ville, email, pay, password } = req.body;

  // Basic validation for required fields
  if (!prenom || !nom || !date_naissance || !ville || !email || !pay || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await Utilisateur.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const utilisateur = new Utilisateur({
      prenom,
      nom,
      date_naissance,
      ville,
      email,
      pay,
      password: hashedPassword,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await utilisateur.save();

    // ✅ Créer un token JWT après enregistrement
  const token = jwt.sign(
      { userId: utilisateur._id, email: utilisateur.email }, // Payload avec les informations de l'utilisateur
      process.env.JWT_SECRET,                  // Clé secrète pour signer le token
      { expiresIn: '1h' }                     // Durée d'expiration du token (1 heure dans cet exemple)
    );

    // Répondre avec le message de succès et le token
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      success: true,
      token,  // Retourner le token pour l'authentification future
      userId: utilisateur._id,  // Retourner l'ID de l'utilisateur
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
  }
};

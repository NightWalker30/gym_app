const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/Utilisateur');

// Enregistrement d'un nouvel utilisateur
exports.signUp = async (req, res) => {
  const { prenom, nom, date_naissance, ville, email, pay, password } = req.body;
  console.log('Données reçues:', req.body);

  try {
    // Vérifier si l'email est déjà utilisé
    const existingUser = await Utilisateur.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hacher le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // Créer un nouvel utilisateur avec le mot de passe haché et la date de naissance
    const utilisateur = new Utilisateur({
      prenom,
      nom,
      date_naissance,  // Utiliser la date de naissance au lieu de l'âge
      ville,
      email,
      pay,
      password: hashedPassword, // Utiliser le mot de passe haché
    });

    await utilisateur.save();

    // Répondre avec un message de succès
    res.status(201).json({ message: 'Utilisateur créé avec succès', success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
};

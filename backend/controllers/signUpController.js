const Utilisateur = require('../models/Utilisateur');

// Enregistrement d'un nouvel utilisateur
exports.signUp = async (req, res) => {
  const { prenom, nom, age, ville, email, pay, password } = req.body;
  console.log('Données reçues:', req.body);
  try {
    const existingUser = await Utilisateur.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const utilisateur = new Utilisateur({
      prenom,
      nom,
      age,
      ville,
      email,
      pay,
      password,
    });

    await utilisateur.save();

    // ==> CETTE PARTIE EST TRES IMPORTANTE :
    res.status(201).json({ message: 'Utilisateur créé avec succès', success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
};

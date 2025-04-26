const User = require('../models/User');

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }
  try {
    // Recherche si l'utilisateur existe
    let user = await User.findOne({ username });
    if (!user) {
      // Si l'utilisateur n'existe pas, on le crée (juste pour le test)
      user = await User.create({ username, password });
      return res.status(201).json({ success: true, message: "Utilisateur créé avec succès !" });
    }

   
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect." });
    }

    return res.status(200).json({ success: true, message: "Connexion réussie !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

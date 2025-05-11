const User = require('../models/Utilisateur');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Calculate age from date_naissance
    const today = new Date();
    const birthDate = new Date(user.date_naissance);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust age if birthday hasn't occurred yet this year
    const adjustedAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;

    res.status(200).json({
      profile: {
        ...user._doc,
        age: adjustedAge
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

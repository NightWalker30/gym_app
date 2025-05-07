// routes/seance.js
const express = require('express');
const { getSeances, addSeance } = require('../controllers/getSeanceControlleur'); // Import des contrôleurs
const router = express.Router();

// Route pour récupérer toutes les séances
router.get('/getSeances', getSeances);
module.exports = router;

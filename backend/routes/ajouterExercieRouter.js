const express = require('express');
const router = express.Router();
const { ajouterExercice } = require('../controllers/ajouterExercice');
router.post('/seances/:id/ajouterExercice', ajouterExercice);
module.exports = router;
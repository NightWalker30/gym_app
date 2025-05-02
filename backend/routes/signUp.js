const express = require('express');
const router = express.Router();
const { signUp } = require('../controllers/signUpController');
router.post('/signUp', signUp);
// console.log(req.body); 
// router.post('/signUp', (req, res) => {
//     console.log(req.body);  // Vérifie les données envoyées par le frontend
//     // Reste de la logique de traitement
//   });
  
module.exports = router;
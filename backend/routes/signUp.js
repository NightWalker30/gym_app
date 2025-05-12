const express = require('express');
const router = express.Router();
const { signUp } = require('../controllers/signUpController');
router.post('/signUp', signUp);

const utilisateurController = require('../controllers/updateProfileController');

// This is the missing line 👇
router.put('/updateProfile/:userId', utilisateurController.updateProfile);
  
module.exports = router;
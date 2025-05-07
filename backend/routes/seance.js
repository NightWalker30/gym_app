const express = require('express');
const router = express.Router();
const {creerSeance} = require('../controllers/seanceControlleur');
router.post('/setSeance', creerSeance);

  
module.exports = router;
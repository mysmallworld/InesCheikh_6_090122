const express = require('express');
const router = express.Router();
//Controller pour associer les routes
const userCtrl = require('../controllers/user');

//Récupération des fonctions d'enregistement et de connexion
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Exportation du router du fichier user.js
module.exports = router;
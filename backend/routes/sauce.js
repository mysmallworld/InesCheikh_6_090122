//Importation de express
const express = require('express');
//Création d'un routeur express
const router = express.Router();

//Importation des données de Sauces
const sauceCtrl = require('../controllers/sauce');
//Importation de l'authentification
const auth = require('../middleware/auth');
//Importation de multer 
const multer = require('../middleware/multer-config');

//Récupération des fonctions
router.post('/', auth, multer, sauceCtrl.createSauces);
router.put('/:id', auth, multer, sauceCtrl.modifySauces);
router.delete('/:id', auth, sauceCtrl.deleteSauces);
router.get('/:id', auth, sauceCtrl.getOneSauces);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth,multer,  sauceCtrl.likeDislikeSauces);

//Exportation du router du fichier sauce.js
module.exports = router;
//Importation de express
const express = require('express');
//Appel de la méthode express pour créer une application express
const app = express();
//Mise en place de mongoose pour la base de donnée
const mongoose = require('mongoose');
//Accès au chemin de notre système de fichier
const path= require('path');
//Enregistrement des routeurs
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Importation du package pour utiliser les variables d'environnement
const dotenv = require('dotenv');
const result = dotenv.config();

//Connection à la base de donnée MongoDB
mongoose.connect(`mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@clustersauces.qy7kb.mongodb.net/${process.env.NAME_DB}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Mise en place des requête POST
app.use(express.json());

//Middleware appliqué à toutes les routes, ajout de headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Acccès au système de gestion de téléchargement de fichier image
app.use('/images', express.static(path.join(__dirname, 'images')));

//Enregistrement du routeur pour toutes les demandes effectuées vers /api/sauces et /api/auth
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//Exportation vers les autres fichiers pour l'accès d'express 
module.exports = app;
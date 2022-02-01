//Importation de bcrypt pour hasher le password
const bcrypt = require('bcrypt');
//Importation de crypto-js pour chiffrer l'email
const cryptojs = require('crypto-js');

const jwt = require('jsonwebtoken');
const User = require('../models/User');
//Importation du package pour utiliser les variables d'environnement
const dotenv = require('dotenv');
const result = dotenv.config();

//Fonction d'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
  //Chiffrer l'email avant de l'envoyer dans la base de donnée
  const emailCryptoJs = cryptojs.HmacSHA512(req.body.email, `${process.env.CRYPTOJS_RANDOM_SECRET_KEY}`).toString(cryptojs.enc.Base64);

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: emailCryptoJs,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({message: error }));
    })
    .catch(error => res.status(500).json({ message: error }));  
};

//Fonction de connexion pour les utilisateurs existants
exports.login = (req, res, next) => {
  const emailCryptoJs = cryptojs.HmacSHA512(req.body.email, `${process.env.CRYPTOJS_RANDOM_SECRET_KEY}`).toString(cryptojs.enc.Base64);
  User.findOne({ email: emailCryptoJs })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.RANDOM_TOKEN_SECRET,
              { expiresIn: '24h' } 
            )
          });
        })
        .catch(error => res.status(500).json({ message: error }));
    })
    .catch(error => res.status(500).json({ message: error }));
};
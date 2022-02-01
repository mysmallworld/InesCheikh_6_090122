//Récupération du fichier contenant les données
const Sauces = require('../models/Sauces');
const fs = require('fs');
const jwt = require('jsonwebtoken');
//Importation du package pour utiliser les variables d'environnement
const dotenv = require('dotenv');
const result = dotenv.config();

//Fonction qui permet d'enregistrer une nouvelle sauce
exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  const sauces = new Sauces({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauces.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ message: error }));
};

//Fonction qui permet la mise à jour de la sauce avec l'_id fourni
exports.modifySauces = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
  const userId = decodedToken.userId;
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId == userId) {
        // utilisateur qui a créé la sauce 
        const saucesObject = req.file ?
          {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          } : { ...req.body };
          Sauces.findOne({ _id: req.params.id})
          .then(sauce => {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => { 
        Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
          .then(() => res.status(201).json({ message: 'Sauce modifiée !' }))
          .catch(error => res.status(400).json({ message: error }))
      });
    }).catch(error => res.status(500).json({ message: error }))
  }
      else {
        res.status(403).json({ message : "Seul l'utilisateur qui a créé la sauce peut la modifier !"})
        .catch((error) => res.status(403).json({ message: error }));
  }})
};

//Fonction qui permet de supprimer la sauce avec l'_id fourni
exports.deleteSauces = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
  const userId = decodedToken.userId;
  Sauces.findOne({ _id: req.params.id })
    .then(sauces => {
      if (sauces.userId == userId) {
        const filename = sauces.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
            .catch(error => res.status(400).json({ message: error }));
        });
      }
      else {
        res.status(403).json({ message: "Seul l'utilisateur qui a créé la sauce peut la supprimer" })
          .catch((error) => res.status(403).json({ message: error }));
      }
    })
    .catch(error => res.status(500).json({ message: error }));
};

//Fonction de renvoie de la sauce avec l'_id fourni
exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ message: error }));
};

//Fonction de renvoie d'un tableau de toutes les sauces présentes dans la base de données
exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ message: error }));
};

//Fonction qui permet de liker ou disliker une sauce
exports.likeDislikeSauces = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;
  console.log(like + "/" + userId + "/" + sauceId);
  switch (like) {
    case 1:
      Sauces.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
        .then(() => res.status(200).json({ message: `J'aime` }))
        .catch((error) => res.status(400).json({ error }))
      break;

    case 0:
      Sauces.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            Sauces.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
              .then(() => res.status(200).json({ message: `Je retire mon like` }))
              .catch((error) => res.status(400).json({ error }))
          }
          if (sauce.usersDisliked.includes(userId)) {
            Sauces.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
              .then(() => res.status(200).json({ message: `Je retire mon dislike` }))
              .catch((error) => res.status(400).json({ error }))
          }
        })
        .catch((error) => { console.log(error); res.status(404).json({ error }); });
      break;

    case -1:
      Sauces.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
        .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
        .catch((error) => res.status(400).json({ error }))
      break;
    default:
      console.log(error);
  }
}
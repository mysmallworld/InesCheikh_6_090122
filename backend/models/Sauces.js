//Importation de mongoose
const mongoose = require('mongoose');

//Création d'un schéma de données contenant les champs souhaités pour les sauces
const saucesSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true },
});

//Exportation du schéma en tant que modèle Mongoose
module.exports = mongoose.model('Sauces', saucesSchema);
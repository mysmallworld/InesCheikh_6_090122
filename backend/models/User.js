const mongoose= require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Création d'un modèle de données
//unique = deux utilisateurs ne pourront pas utiliser le même email
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

//Permet d'améliorer les messages d'erreur lors de l'enregistrement de données uniques
userSchema.plugin(uniqueValidator);

//Exportation du schéma
module.exports = mongoose.model('User', userSchema);
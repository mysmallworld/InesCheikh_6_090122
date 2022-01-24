//Importation de multer
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Création d'un objet de configuration pour multer, enregistrement avec diskStorage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const nom = file.originalname.substring(0, file.originalname.lastIndexOf("."));
    const name = nom.split(' ').join('_');
    
    const extension = MIME_TYPES[file.mimetype];
 
    callback(null, name + Date.now() + '.' + extension);
  }
});

//But de multer = implémenter des téléchargements d'un fichier unique (une image)
module.exports = multer({ storage: storage }).single('image');
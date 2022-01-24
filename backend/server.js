//Importation du package HTTP de Node.js
const http = require('http');
//Importation de l'application app.js
const app = require('./app');

//Fonction qui renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };
//Paramétrage du port avec la méthode set de Express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//Fonction qui recherche les différentes erreurs et les gère de manière appropriée
//elle est enregistrée dans le server
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

//Prend en argument la fonction qui sera appelé à chaque requête reçu par le serveur
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//Port que l'on veut écouter, si le port n'est pas disponible => port 3000 par défaut
server.listen(port);
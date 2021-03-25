const dotenv = require("dotenv"); // Permet de stocker les données sensibles sous forme de variable définie dans un fichier à part sous forme de paire key/value - l'appeler le plus tôt possible
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser'); // Middleware pour prendre en charge le JSON
const mongoose = require('mongoose');
const path = require('path'); 
const cors = require('cors'); // Cross Origin Request Security - autorise nos serveurs différents à se connecter
const { expressShield } = require('node-shield'); // protection des app node contre les injections
const helmet = require('helmet'); // Sécurise les headers http lors du transit

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://'+ process.env.DB_USER +':'+ process.env.DB_PASS + '@cluster0.yrsar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', // connexion base de données
    { useNewUrlParser: true,
        useUnifiedTopology: true })
      .then(() => console.log('Connexion à MongoDB réussie !'))
      .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(helmet());
app.use(cors());

app.use(
  expressShield({
    errorHandler: (shieldError, req, res, next) => {
      console.error(shieldError);
      res.sendStatus(400);
    },
  })
);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
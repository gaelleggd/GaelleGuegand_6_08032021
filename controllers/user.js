const bcrypt = require ('bcrypt'); // crypte le mot de passe
const jwt = require ('jsonwebtoken'); // génère un token pour un utilisateur
const CryptoJS = require('crypto-js'); // crypte les e-mails dans la base de données
const validator = require('validator'); // valider les données saisies dans les champs de saisie

const User = require ('../models/user');

exports.signup = (req, res, next) => {
  if (validator.isEmail(req.body.email, {blacklisted_chars: '$=' })){
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: CryptoJS.MD5(req.body.email).toString(),
      password: hash
    });
    user.save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
      .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
  }else{
    res.status(400).json({ error: "Le format de l'adresse n'est pas correct" });
  }
};

  exports.login = (req, res, next) => {
    let cryptedMail = CryptoJS.MD5(req.body.email).toString();
    User.findOne({ email: cryptedMail })
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
              token: jwt.sign (
                {userId : user._id},
                process.env.TOKEN,
                {expiresIn : '24h'}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
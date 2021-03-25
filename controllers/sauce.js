const fs = require('fs'); // filesystem -> travailler avec le système de fichier de l'ordinateur
const validator = require('validator'); // valider les données saisies dans les champs de saisie

const Sauce = require('../models/sauce');


// Route POST //
exports.createSauce = (req, res, next) => {
  let saveSauce = true;
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  let sauceData = Object.values(sauceObject);
  for(value in sauceData){
    if(validator.contains(sauceData[value].toString(),'$') || validator.contains(sauceData[value].toString(),'=')){
      console.log(sauceData[value] + " : ce texte est invalide");
      saveSauce = false;
    }
  }
  if (saveSauce){ //si le texte est valide
    const sauce = new Sauce({
      ...sauceObject,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  }
  else{ //si le texte n'est pas valide
    res.status(401).json({ error: 'Certains caractères ne sont pas autorisés' });
  }
};


// Route PUT // 
exports.modifySauce = (req, res, next) => {
  let saveSauce = true;
  if (req.file) {     // Supprime l'ancienne image
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) throw err;
      });
    })
    .catch(error => res.status(400).json({ error }));
  }
  const sauceObject = req.file ?   // Met à jour l'image et les infos
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  let sauceData = Object.values(sauceObject);
  for(value in sauceData){ // si le texte n'est pas valide
    if(validator.contains(sauceData[value].toString(),'$') || validator.contains(sauceData[value].toString(),'=')){
      console.log(sauceData[value] + " : ce texte est invalide");
      saveSauce = false;
    }
  }
  if(saveSauce){  // Si le texte est valide
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  } else{
    res.status(401).json({ error: 'Certains caractères ne sont pas autorisés' });
  }
};


//Route DELETE //
exports.deleteSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => { // supprime également l'image de la BDD
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({error}))
        })
    })
    .catch(error => res.status(500).json({error}));
};


// Route GET + ID //
exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};


// Route GET //
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
  };


  // Route POST // 
 // Like sauce
exports.likeSauce = (req, res, next) => {
  if (req.body.like == 1) {
    Sauce.updateOne({ _id: req.params.id }, {
      $inc: { likes: 1 },
      $push: { usersLiked: req.body.userId },
      _id: req.params.id
    })
      .then(() => { res.status(201).json({ message: 'Like ajouté' }); })
      .catch((error) => { res.status(400).json({ error }); });
  }
  // Dislike sauce
  else if (req.body.like == -1) {
    Sauce.updateOne({ _id: req.params.id }, {
      $inc: { dislikes: 1 },
      $push: { usersDisliked: req.body.userId },
      _id: req.params.id
    })
      .then(() => { res.status(201).json({ message: 'Dislike ajouté' }); })
      .catch((error) => { res.status(400).json({ error }); });
  }
  else if (req.body.like == 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {   // Retire le like 
        if (sauce.usersLiked.find(user => user === req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
            _id: req.params.id
          })
            .then(() => { res.status(201).json({ message: 'Like retiré' }); })
            .catch((error) => { res.status(400).json({ error }); });
        } 
        if (sauce.usersDisliked.find(user => user === req.body.userId)) { // Retire le dislike 
          Sauce.updateOne({ _id: req.params.id }, {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
            _id: req.params.id
          })
            .then(() => { res.status(201).json({ message: 'Dislike retiré' }); })
            .catch((error) => { res.status(400).json({ error }); });
        }
      })
      .catch((error) => { res.status(404).json({ error }); });
  }
};
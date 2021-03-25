const mongoose = require('mongoose'); // Permet de se connecter à la base de données Mongo DB - prend en charge les promesses et les rappels.

const sauceSchema = mongoose.Schema({
  userId: {type: String, required: true},
  name: {type: String, required: true},
  manufacturer: {type: String, required: true},
  description: {type: String, required: true},
  mainPepper: {type: String, required: true},
  imageUrl: {type: String, required: false},
  heat: {type: Number, required: true},
  likes: {type: Number, required: true},
  dislikes: {type: Number, required: true},
  usersLiked: {type: [String], required: true},
  usersDisliked: {type: [String], required: true},
});

module.exports = mongoose.model('Sauce', sauceSchema);
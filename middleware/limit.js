const rateLimit = require("express-rate-limit"); // limite le nombre de tentatives de connexion

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  message: "Too many accounts connexion from this IP, please try again later",
});

module.exports = { limiter };
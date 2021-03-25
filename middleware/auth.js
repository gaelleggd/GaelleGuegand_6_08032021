const jwt = require ('jsonwebtoken'); // génère un token pour un utilisateur

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split (' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN); // utilisation du dotenv
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valide';
        } else {
            next();
        }
    }
    catch (error) {
        res.status(401).json ({error : error | 'Requête non authentifiée ! '});
    }
};

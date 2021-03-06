const express = require('express'); // Framework node 
const router = express.Router();

const auth = require ('../middleware/auth');
const multer = require ('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);

module.exports = router;
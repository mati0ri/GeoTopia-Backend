const express = require("express");
const { registerUser, loginUser, currentUser, controlToken, getUserRanking, countUsers, updateUserScore, updateUserTitre, getTitreFromPseudo } = require("../controllers/userController");
const validateToken = require("../middleware/tokenValidationHandler");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/controlToken", controlToken);

router.get("/current", validateToken, currentUser);
router.get('/ranking/:id', validateToken, getUserRanking);
router.get('/count', countUsers);
router.get('/title/:username', getTitreFromPseudo);

router.put("/updateScore/:id", updateUserScore);
router.put("/updateTitre/:id", updateUserTitre);


module.exports = router;
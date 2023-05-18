const express = require("express");
const router = express.Router();
const { createPassage, getPassageFromQuizId, updatePassage, getBestScoreFromPseudo, getAllPassagesFromPseudo } = require("../controllers/passageController");
const validateToken = require("../middleware/tokenValidationHandler");

router.use(validateToken);

router.route('/').post(createPassage);
router.route('/quiz/:quizId').get(getPassageFromQuizId);
router.route('/quiz/:quizId/pseudo/:pseudo').put(updatePassage).get(getBestScoreFromPseudo);
router.route('/:pseudo').get(getAllPassagesFromPseudo);



module.exports = router;
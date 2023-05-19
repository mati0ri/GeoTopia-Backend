const express = require("express");
const router = express.Router();
const { getQuizzes, createQuiz, getQuiz, updateQuiz, deleteQuiz } = require("../controllers/quizController");
const validateToken = require("../middleware/tokenValidationHandler");

//router.use(validateToken);
router.route('/').get(getQuizzes).post(createQuiz);
router.route('/:id').get(getQuiz).put(updateQuiz).delete(deleteQuiz);

module.exports = router;
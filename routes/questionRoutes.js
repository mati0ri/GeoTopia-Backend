const express = require("express");
const router = express.Router();
const { getQuestions, createQuestion, getQuestion, updateQuestion, deleteQuestion, getQuestionsFromCategory, getQuestionsByCategoryAndDifficulty, getAllQuestionsFromCategory } = require("../controllers/questionController");
const validateToken = require("../middleware/tokenValidationHandler");

router.use(validateToken);

router.route('/').get(getQuestions).post(createQuestion);
router.route('/:id').get(getQuestion).put(updateQuestion).delete(deleteQuestion);
router.route('/category/:categoryName').get(getQuestionsFromCategory);
router.route('/allFromCategory/:categoryName').get(getAllQuestionsFromCategory);
router.get("/category/:categoryName/difficulty/:difficulty", getQuestionsByCategoryAndDifficulty);



module.exports = router;
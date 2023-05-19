const asyncHandler = require("express-async-handler");
const Question = require("../models/questionModel");

//@desc Get all questions
//@route GET /api/question
//@access private
const getQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.find();
    res.status(200).json(questions);
});

//@desc Get a question from id
//@route GET /api/question/:id
//@access private
const getQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    if (!question) {
        res.status(404);
        throw new Error("Question not found");
    }
    res.status(200).json(question);
});

//@desc Create new question
//@route POST /api/question
//@access private
const createQuestion = asyncHandler(async (req, res) => {
    console.log("requested body : ", req.body);
    const { question, answer, category, wrongAnswers, difficulty, image } = req.body;
    if (!question || !answer || !category || !wrongAnswers || !difficulty || !image) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const createdQuestion = await Question.create({
        question,
        answer,
        category,
        wrongAnswers,
        difficulty,
        image
    });


    res.status(201).json(createdQuestion);
});

//@desc Update a question from id
//@route PUT /api/question/:id
//@access private
const updateQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    if (!question) {
        res.status(404);
        throw new Error("Question not found");
    }
    const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedQuestion);
});

//@desc Delete a question from id
//@route DELETE /api/question/:id
//@access private
const deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    if (!question) {
        res.status(404);
        throw new Error("Question not found");
    }
    await question.deleteOne();
    res.status(200).json(question);
});

//@desc Get a variable number of questions from a category
//@route GET /api/question/category/:categoryName?limit=3
//@access private
const getQuestionsFromCategory = asyncHandler(async (req, res) => {
    const categoryName = req.params.categoryName;
    const limit = parseInt(req.query.limit) || 10; // default limit is 10
    const questions = await Question.find({ category: categoryName }).limit(limit);
    res.status(200).json(questions);
});


//@desc Get all questions from a category
//@route GET /api/question/category/:categoryName?limit=3
//@access private
const getAllQuestionsFromCategory = asyncHandler(async (req, res) => {
    const categoryName = req.params.categoryName;
    const questions = await Question.find({ category: categoryName });
    res.status(200).json(questions);
});


//@desc Get a variable number of questions from a category and difficulty
//@route GET /api/question/category/:categoryName/difficulty/:difficulty?limit=3
//@access private
const getQuestionsByCategoryAndDifficulty = asyncHandler(async (req, res) => {
    const categoryName = req.params.categoryName;
    const difficulty = parseInt(req.params.difficulty);
    const limit = parseInt(req.query.limit) || 10;

    // Récupère le nombre total de questions correspondant aux critères
    const count = await Question.countDocuments({ category: categoryName, difficulty: difficulty });

    // Génère un tableau d'index aléatoires uniques
    const randomIndexes = new Set();
    while (randomIndexes.size < Math.min(limit, count)) {
        randomIndexes.add(Math.floor(Math.random() * count));
    }

    // Récupère les questions correspondant aux index aléatoires
    const questions = [];
    for (const index of randomIndexes) {
        const question = await Question.findOne({ category: categoryName, difficulty: difficulty }).skip(index).exec();
        questions.push(question);
    }

    res.status(200).json(questions);
});


module.exports = { getQuestions, createQuestion, getQuestion, updateQuestion, deleteQuestion, getQuestionsFromCategory, getQuestionsByCategoryAndDifficulty, getAllQuestionsFromCategory };

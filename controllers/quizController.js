const asyncHandler = require("express-async-handler");
const quizModel = require("../models/quizModel");
const Quiz = require("../models/quizModel");

//@desc Get all quizzes
//@route GET /api/quiz
//@access private
const getQuizzes = asyncHandler(async (req, res) => {
    res.send("1");
    const quiz = await Quiz.find();
    res.send("quiz:",quiz);
    res.status(200).json(quiz);
    res.send("res:",res);
});

//@desc Get a quiz from id
//@route GET /api/quiz/:id
//@access private
const getQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
        res.status(404);
        throw new Error("Quiz not found");
    }
    res.status(200).json(quiz);
});

//@desc Create new quiz
//@route POST /api/quiz
//@access private
const createQuiz = asyncHandler(async (req, res) => {
    console.log("requested body : ", req.body);
    const { category, image, description } = req.body;
    if (!category || !image || !description) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const createdQuiz = await Quiz.create({
        category,
        image,
        description,
    });


    res.status(201).json(createdQuiz);
});

//@desc Update a quiz from id
//@route PUT /api/quiz/:id
//@access private
const updateQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
        res.status(404);
        throw new Error("Quiz not found");
    }
    const updatedQuiz = await Quiz.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedQuiz);
});

//@desc Delete a quiz from id
//@route DELETE /api/quiz/:id
//@access private
const deleteQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
        res.status(404);
        throw new Error("Quiz not found");
    }
    await quiz.deleteOne();
    res.status(200).json(quiz);
});

module.exports = { getQuizzes, createQuiz, getQuiz, updateQuiz, deleteQuiz };
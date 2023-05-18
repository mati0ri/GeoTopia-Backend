const asyncHandler = require("express-async-handler");
const enAttente = require("../models/enAttenteModel");

//@desc Create new question
//@route POST /api/proposition
//@access private
const createEnAttente = asyncHandler(async (req, res) => {
    console.log("requested body : ", req.body);
    const { question, answer, image, wrongAnswers } = req.body;
    if (!question || !answer) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const createdQuestion = await enAttente.create({
        question,
        answer,
        image,
        wrongAnswers
    });


    res.status(201).json(createdQuestion);
});

//@desc Get all questions
//@route GET /api/proposition
//@access private
const getEnAttente = asyncHandler(async (req, res) => {
    const questions = await enAttente.find();
    res.status(200).json(questions);
});

//@desc Delete a question from id
//@route DELETE /api/proposition/:id
//@access private
const deleteEnAttente = asyncHandler(async (req, res) => {
    const question = await enAttente.findById(req.params.id);
    if (!question) {
        res.status(404);
        throw new Error("Question not found");
    }
    await question.deleteOne();
    res.status(200).json(question);
});

module.exports = { createEnAttente, getEnAttente, deleteEnAttente };
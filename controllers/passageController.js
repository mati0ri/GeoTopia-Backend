const asyncHandler = require("express-async-handler");
const passageModel = require("../models/passageModel");
const Passage = require("../models/passageModel");

//@desc Create new passage
//@route POST /api/passage
//@access private
const createPassage = asyncHandler(async (req, res) => {
    console.log("requested body : ", req.body);
    const { idQuiz, pseudo, score } = req.body;
    if (!idQuiz || !pseudo || !score) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const createdPassage = await Passage.create({
        idQuiz,
        pseudo,
        score
    });

    res.status(201).json(createdPassage);
});

//@desc Get 5 best passages from quizId
//@route GET /api/passage/quiz/:quizId?limit=5
//@access private
const getPassageFromQuizId = asyncHandler(async (req, res) => {
    const quizId = req.params.quizId;
    const limit = parseInt(req.query.limit) || 5; // default limit is 5

    // Step 1: Cleanup duplicate passages
    // Get all distinct users for this quiz
    const users = await Passage.distinct('pseudo', { idQuiz: quizId });
    
    for (const user of users) {
        // Get all passages for this user and this quiz, sorted by score in descending order, then by createdAt in ascending order
        const passages = await Passage.find({ idQuiz: quizId, pseudo: user })
            .sort({ score: -1, createdAt: 1 });
        
        // If there's more than one passage, remove all but the first one
        if (passages.length > 1) {
            // Skip the first passage, remove all the others
            for (let i = 1; i < passages.length; i++) {
                await Passage.findByIdAndDelete(passages[i]._id);
            }
        }
    }

    // Step 2: Get the 5 best passages
    const bestPassages = await Passage.find({ idQuiz: quizId })
        .sort({ score: -1 })  // sort by score in descending order
        .limit(limit);
    
    res.status(200).json(bestPassages);
});


//@desc Get best score of a user from quizId
//@route GET /api/passage/quiz/:quizId/pseudo/:pseudo
//@access private
const getBestScoreFromPseudo = asyncHandler(async (req, res) => {
    const { quizId, pseudo } = req.params;

    //normalement pas besoin mais au cas ou 
    const passage = await Passage.findOne({ idQuiz: quizId, pseudo: pseudo })
        .sort({ score: -1 })  // sort by score in descending order
        .limit(1);  // limit to 1 document

    if (!passage) {
        res.status(404);
        throw new Error("No passages found for the user");
    }

    res.status(200).json(passage);
});

//@desc Update a passage
//@route PUT /api/passage/quiz/:quizId/pseudo/:pseudo
//@access private
const updatePassage = asyncHandler(async (req, res) => {
    const { quizId, pseudo } = req.params;
    const { score } = req.body || 0;

    if (score === undefined) {
        res.status(400);
        throw new Error("Score is required to update the passage");
    }

    // First, try to find an existing passage
    let passage = await Passage.findOne({ idQuiz: quizId, pseudo: pseudo });

    if (!passage) {
        // If no passage is found, create a new one
        passage = new Passage({ idQuiz: quizId, pseudo: pseudo, score: score });

        await passage.save();

        res.status(201).json(passage); // Return a 201 Created status
    } else {
        // If a passage is found, update it
        passage.score = score;

        await passage.save();

        res.status(200).json(passage);
    }
});


//@desc Get all passages of a user
//@route GET /api/passage/user/:pseudo
//@access private
const getAllPassagesFromPseudo = asyncHandler(async (req, res) => {
    const pseudo = req.params.pseudo;

    // Step 1: Cleanup duplicate passages
    // Get all distinct quizIds for this user
    const quizIds = await Passage.distinct('idQuiz', { pseudo: pseudo });
    
    for (const quizId of quizIds) {
        // Get all passages for this user and this quiz, sorted by score in descending order, then by createdAt in ascending order
        const passages = await Passage.find({ idQuiz: quizId, pseudo: pseudo })
            .sort({ score: -1, createdAt: 1 });
        
        // If there's more than one passage, remove all but the first one
        if (passages.length > 1) {
            // Skip the first passage, remove all the others
            for (let i = 1; i < passages.length; i++) {
                await Passage.findByIdAndDelete(passages[i]._id);
            }
        }
    }

    // Step 2: Get all passages for this user
    const passages = await Passage.find({ pseudo: pseudo });
    
    if (!passages || passages.length === 0) {
        res.status(404);
        throw new Error("No passages found for the user");
    }

    res.status(200).json(passages);
});






module.exports = { createPassage, getPassageFromQuizId, updatePassage, getBestScoreFromPseudo, getAllPassagesFromPseudo };

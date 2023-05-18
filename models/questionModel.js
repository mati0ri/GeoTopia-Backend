const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
    question: {
        type: String,
        required: [true, "Add a question"],
    },
    answer: {
        type: String,
        required: [true, "Add an answer"],
    },
    wrongAnswers: {
        type: [String],
        required: [true, "Add wrong answers"],
    },
    difficulty: {
        type: String,
        required: [true, "Add a difficulty"],
    },
    category: {
        type: String,
        required: [true, "Add a category"],
    },
    image: {
        type: String,
        required: [true, "Add an image"],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Question", questionSchema);
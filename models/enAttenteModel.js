const mongoose = require("mongoose");

const enAttenteSchema = mongoose.Schema({
    question: {
        type: String,
        required: [true, "Add a question"],
    },
    answer: {
        type: String,
        required: [true, "Add an answer"],
    },
    image: {
        type: String,
        required: [false],
    },
    wrongAnswers: {
        type: [String],
        required: [false],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("enAttente", enAttenteSchema);
const mongoose = require("mongoose");

const passageSchema = mongoose.Schema({
    idQuiz: {
        type: String,
        required: [true, "Add a quiz id"],
    },
    pseudo: {
        type: String,
        required: [true, "Add a pseudo"],
    },
    score: {
        type: Number,
        required: [true, "Add a score"],
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Passage", passageSchema);
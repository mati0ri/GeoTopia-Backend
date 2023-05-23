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
        min: [0, 'Score should not be less than 0'],
        max: [100, 'Score should not be more than 100']
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Passage", passageSchema);
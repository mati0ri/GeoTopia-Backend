const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
    category: {
        type: String,
        required: [true, "Add a category"],
        unique: [true, "category already taken"],
    },
    image: {
        type: String,
        required: [true, "Add an image URL"],
    },
    description: {
        type: String,
        required: [true, "Add a description"],
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Quiz", quizSchema);
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "please add the username"],
        unique: [true, "pseudo already taken"],

    },
    email: {
        type: String,
        required: [true, "please add the email"],
        unique: [true, "Email adress already taken"],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    },
    role: {
        type: String,
        required: [true, "Please enter role"],
    },
    titre: {
        type: String,
        required: [true, "please enter title"],
    },
    scoreTot: {
        type: Number,
        required: [true, "please enter total score"],
    }
}, {
    timestamps: true,
}
);

module.exports = mongoose.model("User", userSchema);
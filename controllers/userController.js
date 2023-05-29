const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");

//@desc Register a user
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, encryptedPassword } = req.body;
    const bytes  = CryptoJS.AES.decrypt(encryptedPassword, 'secret key 123');
    const password = bytes.toString(CryptoJS.enc.Utf8);

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already created");
    }

    //Hash pswd
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed pswd: ", hashedPassword);
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: "user",
        titre: "l'astéroïde",
        scoreTot: 0
    });

    console.log(`user created: ${newUser}`);
    if (newUser) {
        res.status(201).json({ _id: newUser.id, email: newUser.email, role: newUser.role });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({ message: "User registration" });
});

//@desc Log a user in
//@route POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, encryptedPassword } = req.body;
    const bytes  = CryptoJS.AES.decrypt(encryptedPassword, 'secret key 123');
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    //console.log("crypté back: ", encryptedPassword);
    //console.log("décrypté back: ", originalPassword);

    if (!email || !originalPassword) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({ email });

    //compare pswd with hashed
    if (user && (await bcrypt.compare(originalPassword, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
                role: user.role,
                titre: user.titre,
                scoreTot: user.scoreTot
            },
        }, process.env.ACCESS_TOKEN_SECERT,
            { expiresIn: "6h" }
        );
        console.log(accessToken);
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("email or password is not valid");
    }
});

//@desc Current user info
//@route POST /api/user/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

//@desc Validate an access token
//@route POST /api/validate-token
//@access private
const controlToken = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
        console.log("token:", token);
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
            if (err) {
                return res.status(401).json({ isValid: false });
            } else {
                return res.status(200).json({ isValid: true });
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Error validating token' });
    }
});

//@desc Get the ranking of a user
//@route GET /api/user/ranking/:id
//@access private
const getUserRanking = asyncHandler(async (req, res) => {
    const allUsers = await User.find({}).sort({ scoreTot: -1 }); // Get all users, sorted by score in descending order
    const userRank = allUsers.findIndex(user => user._id.toString() === req.params.id); // Find the index of the user

    if (userRank > -1) {
        res.json({ ranking: userRank + 1 }); // Add 1 to make the ranking start from 1 instead of 0
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


/////////
const countUsers = async (req, res, next) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        next(error);
    }
};


//@desc Update user total score
//@route PUT /api/user/:id
//@access private
const updateUserScore = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { scoreTot } = req.body;

    if (scoreTot === undefined) {
        res.status(400);
        throw new Error("ScoreTot is required to update the user");
    }

    // Find the user and update their scoreTot
    const user = await User.findOneAndUpdate({ _id: id }, { scoreTot }, { new: true });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json(user);
});


//@desc Update user titre
//@route PUT /api/user/:id
//@access private
const updateUserTitre = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { titre } = req.body;

    if (titre === undefined) {
        res.status(400);
        throw new Error("ScoreTot is required to update the user");
    }

    // Find the user and update their scoreTot
    const user = await User.findOneAndUpdate({ _id: id }, { titre }, { new: true });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json(user);
});

//@desc Get user's title by username
//@route GET /api/user/title/:username
//@access public
const getTitreFromPseudo = asyncHandler(async (req, res) => {
    const { username } = req.params;
    
    const user = await User.findOne({ username });
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({ titre: user.titre });
});

module.exports = { registerUser, loginUser, currentUser, controlToken, getUserRanking, countUsers, updateUserScore, updateUserTitre, getTitreFromPseudo };

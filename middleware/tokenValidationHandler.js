const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
            if (err) {
                res.status(401).send("User is not authorized");
                throw new Error("User is not authorized");
            }
            req.user = decoded.user;
        });

        if (!token) {
            res.status(401).send("Token is missing");
            throw new Error("Token is missing");
        }
    } else {
        res.status(401).send("No Authorization header has been provided");
        throw new Error("No Authorization header has been provided");
    }
    next();
});

module.exports = validateToken;
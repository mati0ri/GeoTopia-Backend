const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require("cors");


//ajout test
const questionRoutes = require("./routes/questionRoutes")
const passageRoutes = require("./routes/passageRoutes")
const userRoutes = require("./routes/userRoutes")
const quizRoutes = require("./routes/quizRoutes")
const enAttenteRoutes = require("./routes/enAttenteRoutes")
//fin

connectDb();
const app = express();

const port = process.env.PORT || 3002;

app.use(cors());

app.use(express.json());

/*
app.use("/api/question", require("./routes/questionRoutes"));
app.use("/api/passage", require("./routes/passageRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/proposition", require("./routes/enAttenteRoutes"));
*/

app.use("/api/question", questionRoutes);
app.use("/api/passage", passageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/proposition", enAttenteRoutes);



app.get("/api/test", (req, res) => {
    res.send("api ok");
});


app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
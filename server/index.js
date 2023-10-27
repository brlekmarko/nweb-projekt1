const express = require("express");
const app = express(); // create express app
const path = require("path");
const { client } = require("./database/client");
const queries = require("./database/dbQueries");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const auth0config = require('./auth0/config');


// auth0


// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(auth0config));

// req.isAuthenticated is provided from the auth router
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

client.connect();

//cors
const cors = require("cors");
app.use(cors());

// database calls
app.get("/api/allTournaments", async (req, res) => {
  const dbres = await client.query(queries.getAllTournaments());
  res.json(dbres.rows);
});

app.get("/api/fetchTournament/:id", async (req, res) => {
  // need to first get tournament info, then get natjecatelji, then get kola
  const id = req.params.id;
  try{
    const dbres = await client.query(queries.getTournament(id));
    const tournament = dbres.rows[0];
    const natjecatelji = await client.query(queries.getTournamentNatjecatelji(id));
    const kola = await client.query(queries.getTournamentKola(id));
    res.json({ tournament: tournament, natjecatelji: natjecatelji.rows, igre: kola.rows });
  }catch(e){
    res.json({ tournament: {}, natjecatelji: [], igre: [] });
  }
});

app.post("/api/createTournament", jsonParser, async (req, res) => {
  client.query("BEGIN");
  try{
    const tournament = req.body;
    if (tournament.natjecatelji.length < 4 || tournament.natjecatelji.length > 8) {
      res.json({ id: -1 });
      return;
    }

    const dbres = await client.query(queries.newTournamentCreateNatjecanje(tournament));
    const id = dbres.rows[0].idnatjecanje;

    const natjecateljires = await client.query(queries.newTournamentCreateNatjecatelji(id, tournament));
    const natjecatelji = natjecateljires.rows;
    let natjecateljiIds = [];
    for(let i = 0; i < natjecatelji.length; i++){
        natjecateljiIds.push(natjecatelji[i].idnatjecatelj);
    }

    const idkolares = await client.query(queries.newTournamentCreateKola(id, tournament, natjecateljiIds));
    const idkola = idkolares.rows;
    let idkolaIds = [];
    for(let i = 0; i < idkola.length; i++){
        idkolaIds.push(idkola[i].idigra);
    }

    res.json({ id: id
    });
    client.query("COMMIT");
  }catch(e){
    client.query("ROLLBACK");
    console.log(e);
    res.json({ id: -1 });
  }

});

app.get("/api/user", async (req, res) => {
  res.json(req.oidc.user);
});

app.post("/api/updatePobjednik", jsonParser, async (req, res) => {
  await client.query("BEGIN");


  try{
    const idigra = req.body.idigra;
    const pobjednik = req.body.pobjednik;
    const idnatjecanje = req.body.idnatjecanje;
    // updateamo pobjednika u kolu
    await client.query(queries.updatePobjednik(idigra, pobjednik));
    // potrebno proci kroz sva kola i updateati bodove natjecateljima
    // dohvatimo natjecanje da znamo koliko bodova nose pobjeda/poraz/nerjeseno
    const dbres = await client.query(queries.getTournament(idnatjecanje));
    const kola = await client.query(queries.getTournamentKola(idnatjecanje));
    const tournament = dbres.rows[0];
    const igre = kola.rows;

    const bodoviPobjeda = tournament.bodovipobjeda;
    const bodoviPoraz = tournament.bodoviporaz;
    const bodoviNerjeseno = tournament.bodovinerjeseno;
    
    
    let bodovi = {};
    for(let i = 0; i < igre.length; i++){
        const igra = igre[i];
        if(bodovi[igra.idnatjecatelj] == undefined){
            bodovi[igra.idnatjecatelj] = 0;
        }
        if(bodovi[igra.igracdvaidnatjecatelj] == undefined){
            bodovi[igra.igracdvaidnatjecatelj] = 0;
        }
        if(igra.pobjednik == "0"){ // meč nije odigran
          continue;
        }else if(igra.pobjednik == "X"){ // nerješeno
          bodovi[igra.idnatjecatelj] += bodoviNerjeseno;
          bodovi[igra.igracdvaidnatjecatelj] += bodoviNerjeseno;
        }else if(igra.pobjednik == "1"){ // pobjeda prvog
          bodovi[igra.idnatjecatelj] += bodoviPobjeda;
          bodovi[igra.igracdvaidnatjecatelj] += bodoviPoraz;
        }else if(igra.pobjednik == "2"){ // pobjeda drugog
          bodovi[igra.idnatjecatelj] += bodoviPoraz;
          bodovi[igra.igracdvaidnatjecatelj] += bodoviPobjeda;
        }      
    }
    // updateamo bodove natjecateljima
    for(let natjecatelj in bodovi){
        await client.query(queries.updateBodoviNatjecatelj(natjecatelj, bodovi[natjecatelj]));
    }
    // dohvatimo natjecatelje da korisnik zna novo stanje bodova
    const natjecatelji = await client.query(queries.getTournamentNatjecatelji(idnatjecanje));
    res.json({ success: true, natjecatelji: natjecatelji.rows });
    await client.query("COMMIT");





  }catch(e){
    await client.query("ROLLBACK");
    console.log(e);
    res.json({ success: false });
  }
});







app.use(express.static(path.join(__dirname, "..", "build")));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});


// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});
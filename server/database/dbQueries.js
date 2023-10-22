function getAllTournaments(){
    return "SELECT * FROM natjecanje"
}

function newTournamentPart1(tournament){
    return "INSERT INTO natjecanje (naziv, bodoviPobjeda, bodoviPoraz, bodoviNerjeseno, kreator) VALUES ('" 
    + tournament.naziv + "', '" + tournament.bodoviPobjeda + "', '" + tournament.bodoviPoraz + "', " + tournament.bodoviNerjeseno + ", '" + tournament.kreator + "')" 
    + " RETURNING idnatjecanje;";
}

function newTournamentPart2(id, tournament){
    if(tournament.natjecatelji.length == 0){
        return "";
    }
    
    let toReturn = "INSERT INTO natjecatelj (ime, idNatjecanje, bodovi) VALUES ";
    for(let i = 0; i < tournament.natjecatelji.length; i++){
        toReturn += "('" + tournament.natjecatelji[i] + "', " + id + ", 0)";
        if(i != tournament.natjecatelji.length - 1){
            toReturn += ", ";
        }
    }
    toReturn += ";";
    return toReturn;
}

module.exports = {
    getAllTournaments,
    newTournamentPart1,
    newTournamentPart2
}

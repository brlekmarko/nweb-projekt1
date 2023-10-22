import axios from "axios";
import Natjecanje from "./interfaces/natjecanje";

const BASE_URL = "api";

export function getAllTournaments() {
    return axios.get(`${BASE_URL}/allTournaments`);
}

export function createTournament(tournament: Natjecanje) {
    return axios.post(`${BASE_URL}/createTournament`, tournament);
}
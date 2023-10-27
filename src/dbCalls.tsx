import axios from "axios";
import { NatjecanjeForma } from "./interfaces/natjecanje";

const BASE_URL = "/api";

export function getAllTournaments() {
    return axios.get(`${BASE_URL}/allTournaments`);
}

export function createTournament(tournament: NatjecanjeForma) {
    return axios.post(`${BASE_URL}/createTournament`, tournament);
}

export function fetchTournament(id: number) {
    return axios.get(`${BASE_URL}/fetchTournament/${id}`);
}

export function getUser() {
    return axios.get(`${BASE_URL}/user`);
}

export function updatePobjednik(idigra: number, idnatjecanje: number, pobjednik: string, idkorisnik: string) {
    return axios.post(`${BASE_URL}/updatePobjednik`, { idigra, idnatjecanje, pobjednik, idkorisnik });
}

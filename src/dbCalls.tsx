import axios from "axios";

const BASE_URL = "api";

export function getAllTournaments() {
    return axios.get(`${BASE_URL}/allTournaments`);
}
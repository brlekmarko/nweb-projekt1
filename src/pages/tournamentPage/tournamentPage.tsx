import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTournament } from "../../dbCalls";
import { Natjecanje } from "../../interfaces/natjecanje";

const TournamentPage = () => {
    const { id } = useParams();
    const [tournament, setTournament] = useState<Natjecanje>({
        idnatjecanje: -1,
        naziv: "",
        natjecatelji: [],
        bodovipobjeda: 0,
        bodoviporaz: 0,
        bodovinerjeseno: 0,
        kreator: "",
        igre: [],
    });

    useEffect(() => {
        async function fetchData() {
            if (id){
                const res = await fetchTournament(parseInt(id));
                setTournament({
                    ...res.data.tournament,
                    natjecatelji: res.data.natjecatelji,
                    igre: res.data.igre,
                });
                console.log({
                    ...res.data.tournament,
                    natjecatelji: res.data.natjecatelji,
                    igre: res.data.igre,
                })
            }
        }
        fetchData();
    }, []);


    return (
        <div>
            TournamentPage {id}
        </div>
    )
};

export default TournamentPage;
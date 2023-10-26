import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTournament } from "../../dbCalls";
import { Igra, Natjecanje } from "../../interfaces/natjecanje";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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
            <div className="tournament-info">
                <h1>{tournament.naziv}</h1>
                <h2>Ukupno igrača: {tournament.natjecatelji.length}</h2>
                <h2>Kreator: {tournament.kreator}</h2>
                <h2>Bodovi (pobjeda/nerješeno/poraz): {tournament.bodovipobjeda}/{tournament.bodovinerjeseno}/{tournament.bodoviporaz}</h2>
            </div>
            <div className="tournament-table">
                <DataTable value={tournament.natjecatelji} sortField="bodovi" tableStyle={{ minWidth: '50rem' }}>
                    <Column field="ime" header="Ime" />
                    <Column field="bodovi" header="Bodovi" />
                </DataTable>
            </div>
            <div className="tournament-games">
                <h1>Mečevi</h1>
                <DataTable value={tournament.igre} tableStyle={{ minWidth: '50rem' }}>
                    <Column header="Natjecatelj 1" body={(data: Igra) => tournament.natjecatelji.find((natjecatelj) => natjecatelj.idnatjecatelj === data.idnatjecatelj)?.ime + " (" + data.idnatjecatelj + ")"} />
                    <Column header="Natjecatelj 2" body={(data: Igra) => tournament.natjecatelji.find((natjecatelj) => natjecatelj.idnatjecatelj === data.igracdvaidnatjecatelj)?.ime + " (" + data.igracdvaidnatjecatelj + ")"} />
                    <Column field="pobjednik" header="Pobjednik" />
                </DataTable>
            </div>
        </div>
    )
};

export default TournamentPage;
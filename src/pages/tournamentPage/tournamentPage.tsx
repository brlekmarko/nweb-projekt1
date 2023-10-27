import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTournament, getUser, updatePobjednik } from "../../dbCalls";
import { Igra, Natjecanje, Natjecatelj } from "../../interfaces/natjecanje";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

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

    const [user, setUser] = useState<any>(null);
    const [inEditMode, setInEditMode] = useState<boolean[]>([]);
    const [oldPobjednici, setOldPobjednici] = useState<string[]>([]);
    const [newPobjednici, setNewPobjednici] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            if (id){
                const res = await fetchTournament(parseInt(id));
                let sortedNatjecatelji = res.data.natjecatelji;
                sortedNatjecatelji.sort((a : Natjecatelj, b: Natjecatelj) => b.bodovi - a.bodovi);
                let sortedIgre = res.data.igre;
                sortedIgre.sort((a : Igra, b: Igra) => a.idigra - b.idigra);

                setTournament({
                    ...res.data.tournament,
                    natjecatelji: sortedNatjecatelji,
                    igre: sortedIgre,
                });
                setInEditMode(res.data.igre.map(() => false));
                setOldPobjednici(res.data.igre.map((igra : Igra) => igra.pobjednik));
                setNewPobjednici(res.data.igre.map((igra : Igra) => igra.pobjednik));
            }
            const res = await getUser();
            setUser(res.data);
        }
        fetchData();
    }, []);

    const openEditMode = (data: Igra) => {
        // prebaciti ovu igru u edit mode
        setInEditMode(inEditMode.map((igra, index) => index === tournament.igre.findIndex((igra) => igra.idigra === data.idigra) ? true : igra));
    }

    const closeEditMode = (data: Igra) => {
        // prebaciti ovu igru iz edit moda u normalni mod
        setInEditMode(inEditMode.map((igra, index) => index === tournament.igre.findIndex((igra) => igra.idigra === data.idigra) ? false : igra));
    }

    const cancelEditMode = (data: Igra) => {
        // prebaciti ovu igru iz edit moda u normalni mod
        // i vratiti starog pobjednika na ovo mjesto
        setNewPobjednici(newPobjednici.map((pobjednik, index) => index === tournament.igre.findIndex((igra) => igra.idigra === data.idigra) ? oldPobjednici[index] : pobjednik));
        closeEditMode(data);
    }

    const updateBodovi = async (data: Igra) => {
        const indexIgre = tournament.igre.findIndex((igra) => igra.idigra === data.idigra);
        updatePobjednik(data.idigra, tournament.idnatjecanje, newPobjednici[indexIgre]);
        const res = await updatePobjednik(data.idigra, tournament.idnatjecanje, newPobjednici[indexIgre]);
        if (res.data.success){
            const noviNatjecatelji = res.data.natjecatelji;
            setTournament({
                ...tournament,
                igre: tournament.igre.map((igra, index) => index === indexIgre ? {...igra, pobjednik: newPobjednici[index]} : igra),
                natjecatelji: noviNatjecatelji,
            });
        }
    }
        

    const saveMatchResult = (data: Igra) => {
        // usporedimo nove i stare pobjednike da bi vidjeli je li se promijenio pobjednik
        // ako se promijenio, onda treba promijeniti bodove i pobjednika u bazi
        // nakon provjere, u starim pobjednicima postavimo novog pobjednika za tu igru
        // i prebacimo igru iz edit moda u normalni mod
        const indexIgre = tournament.igre.findIndex((igra) => igra.idigra === data.idigra);
        if (oldPobjednici[indexIgre] !== newPobjednici[indexIgre]){
            // promijenio se pobjednik
            // treba promijeniti bodove i pobjednika u bazi
            // nakon toga, treba promijeniti i u starim pobjednicima novog pobjednika
            // i prebaciti igru iz edit moda u normalni mod
            setOldPobjednici(oldPobjednici.map((pobjednik, index) => index === indexIgre ? newPobjednici[index] : pobjednik));
            updateBodovi(data);
        }
        closeEditMode(data);
    }

    const pobjednikBody = (data: Igra) => {
        return (
            <>
                {(!inEditMode[tournament.igre.findIndex((igra) => igra.idigra === data.idigra)]) ? (
                    <>
                        {data.pobjednik === "1" && tournament.natjecatelji.find((natjecatelj) => natjecatelj.idnatjecatelj === data.idnatjecatelj)?.ime + " (" + data.idnatjecatelj + ")"}
                        {data.pobjednik === "2" && tournament.natjecatelji.find((natjecatelj) => natjecatelj.idnatjecatelj === data.igracdvaidnatjecatelj)?.ime + " (" + data.igracdvaidnatjecatelj + ")"}
                        {data.pobjednik === "X" && "Nerješeno"}
                        {data.pobjednik === "0" && "Nije još odigrano"}
                        {tournament.kreator === user?.sub && <Button label="Uredi" onClick={() => openEditMode(data)} />}
                    </>
                ) : (
                    <>
                        <Dropdown value={newPobjednici[tournament.igre.findIndex((igra) => igra.idigra === data.idigra)]} onChange={(e) => {
                            setNewPobjednici(newPobjednici.map((pobjednik, index) => index === tournament.igre.findIndex((igra) => igra.idigra === data.idigra) ? e.value : pobjednik));
                        }}
                        options={
                            [
                                { name: tournament.natjecatelji.find((natjecatelj) => natjecatelj.idnatjecatelj === data.idnatjecatelj)?.ime + " (" + data.idnatjecatelj + ")", value: "1" },
                                { name: tournament.natjecatelji.find((natjecatelj) => natjecatelj.idnatjecatelj === data.igracdvaidnatjecatelj)?.ime + " (" + data.igracdvaidnatjecatelj + ")", value: "2" },
                                { name: "Nerješeno", value: "X" },
                                { name: "Nije još odigrano", value: "0" },
                            ]
                        } optionLabel="name" 
                            placeholder="Odaberite pobjednika" className="w-full md:w-14rem" />

                        <Button label="Spremi" onClick={() => saveMatchResult(data)} />
                        <Button label="Odustani" onClick={() => cancelEditMode(data)} />
                    </>
                )}
            </>
        );
    };


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
                    <Column header="Pobjednik" body={pobjednikBody} />
                </DataTable>
            </div>
        </div>
    )
};

export default TournamentPage;
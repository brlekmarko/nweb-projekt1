import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Natjecanje from "../../interfaces/natjecanje";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import "./createTournamentPopup.css";
import { getAllTournaments } from "../../dbCalls";

export default function PopupCreateTournament(props: any) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [natjecanje, setNatjecanje] = useState<Natjecanje>({
        naziv: "",
        natjecatelji: [],
        bodoviPobjeda: 0,
        bodoviPoraz: 0,
        bodoviNerjeseno: 0,
    });

    async function stvoriNatjecanje(natjecanje: Natjecanje) {
        console.log(natjecanje);
        const res = await getAllTournaments();
        console.log(res.data);
        //navigate("/natjecanje/" + natjecanje.naziv, { state: natjecanje });
    }

    async function handleClick() {
        setError("");
        try {
            await stvoriNatjecanje(natjecanje);
            closePopup();
        } catch {
            setError("Greška pri stvaranju natjecanja.");
        }
    }

    function handleChange(e: any) {
        if (e.target.name === "natjecatelji") {
            setNatjecanje((prev) => ({
                ...prev,
                [e.target.name]: e.target.value.split("\n"),
            }));
            return;
        }

        setNatjecanje((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    function handleChangeBodovi(bodovi: number | null, name: string) {
        setNatjecanje((prev) => ({
            ...prev,
            [name]: bodovi,
        }));
    }

    function closePopup() {
        setNatjecanje({
            naziv: "",
            natjecatelji: [],
            bodoviPobjeda: 0,
            bodoviPoraz: 0,
            bodoviNerjeseno: 0,
        });
        setError("");
        props.setTrigger(false);
    }

    return props.trigger ? (
        <div className="popup">
            <div className="popup-inner">
                {error && <h1 className="errorMsg">{error}</h1>}
                <h2>Stvorite novo natjecanje</h2>
                <div className="natjecanjeForma">
                    <label>Naziv natjecanja</label>
                    <InputText value={natjecanje.naziv} onChange={handleChange} name="naziv" placeholder="Naziv natjecanja" />
                    <br />
                    <label>Natjecatelji</label>
                    <InputTextarea rows={5} value={natjecanje.natjecatelji.join("\n")} onChange={handleChange} name="natjecatelji" placeholder="Natjecatelji u obliku:
Natjecatelj Prvi 
Natjecatelj Drugi" />
                    <br />
                    <label>Bodovi za pobjedu</label>
                    <InputNumber value={natjecanje.bodoviPobjeda} onChange={(e) => handleChangeBodovi(e.value, "bodoviPobjeda")} name="bodoviPobjeda" placeholder="Bodovi za pobjedu" />
                    <br />
                    <label>Bodovi za poraz</label>
                    <InputNumber value={natjecanje.bodoviPoraz} onChange={(e) => handleChangeBodovi(e.value, "bodoviPoraz")} placeholder="Bodovi za poraz" />
                    <br />
                    <label>Bodovi za nerješeno</label>
                    <InputNumber value={natjecanje.bodoviNerjeseno} onChange={(e) => handleChangeBodovi(e.value, "bodoviNerjeseno")} placeholder="Bodovi za nerješeno" />
                    <br />

                </div>

                <div className="natjecanjeFormaButtons">
                    <Button label="Stvori natjecanje" onClick={handleClick} />
                    <Button label="Zatvori" onClick={closePopup} />
                </div>

                {props.children}
            </div>
        </div>
    ) : (
        <></>
    );
}

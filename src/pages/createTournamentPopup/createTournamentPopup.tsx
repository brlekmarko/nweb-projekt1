import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Natjecanje from "../../interfaces/natjecanje";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import "./createTournamentPopup.css";
import { createTournament } from "../../dbCalls";

export default function PopupCreateTournament(props: any) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [natjecanje, setNatjecanje] = useState<Natjecanje>({
        naziv: "",
        natjecatelji: [],
        bodoviPobjeda: 0,
        bodoviPoraz: 0,
        bodoviNerjeseno: 0,
        kreator: "",
    });

    function validateNatjecanje(natjecanje: Natjecanje) {
        // all fields have to be filled
        if (natjecanje.naziv === "") return "Naziv natjecanja nije ispunjen.";
        if (natjecanje.natjecatelji.length === 0) return "Natjecatelji nisu ispunjeni.";
        if (natjecanje.bodoviPobjeda === null) return "Bodovi za pobjedu nisu ispunjeni.";
        if (natjecanje.bodoviPoraz === null) return "Bodovi za poraz nisu ispunjeni.";
        if (natjecanje.bodoviNerjeseno === null) return "Bodovi za nerješeno nisu ispunjeni.";
        // number of players has to be 4-8
        if (natjecanje.natjecatelji.length < 4 || natjecanje.natjecatelji.length > 8) return "Broj natjecatelja mora biti između 4 i 8.";
        return "";
    }

    async function stvoriNatjecanje(natjecanje: Natjecanje) {
        const validation = validateNatjecanje(natjecanje);
        if (validation !== "") {
            setError(validation);
            return false;
        }

        const res = await createTournament(natjecanje);
        const newId = res.data.id;
        
        if (newId == -1){
            setError("Greška pri stvaranju natjecanja.");
            return false;
        }
        navigate("/natjecanje/" + newId);
        return true;
    }

    async function handleClick() {
        setError("");
        try {
            const success = await stvoriNatjecanje(natjecanje);
            if (success) closePopup();
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
            kreator: "",
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

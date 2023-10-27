import { Button } from 'primereact/button';   
import { useState, useEffect } from 'react';
import PopupCreateTournament from '../createTournamentPopup/createTournamentPopup';
import './homePage.css';
import { getTournamentsForUser, getUser } from '../../dbCalls';
import { NatjecanjeSimple } from '../../interfaces/natjecanje';

const HomePage = () => {

    const [popupCreate, setPopupCreate] = useState<Boolean>(false);

    const [user, setUser] = useState<any>(null);
    const [myTournaments, setMyTournaments] = useState<NatjecanjeSimple[]>([]);

    const stvoriNatjecanje = () => {
        setPopupCreate(true);
    }

    const login = () => {
        window.location.href = "/login";
    }

    const logout = () => {
        window.location.href = "/logout";
    }

    useEffect(() => {
        async function fetchData() {
            const res = await getUser();
            setUser(res.data);
            const res2 = await getTournamentsForUser();
            setMyTournaments(res2.data);
        }
        fetchData();
    }, []);


    return (
        <div className="home-page-center">
            <PopupCreateTournament
                trigger={popupCreate}
                setTrigger={setPopupCreate}
                user={user}
            />
            
            <div>
                {user && <>
                    <br/>
                    <Button label="Stvori novo natjecanje" onClick={ stvoriNatjecanje }/>
                    <br/>
                    <h2>Moja natjecanja:</h2>
                    {myTournaments.map((tournament) => (
                        <>
                            <a href={"/natjecanje/" + tournament.idnatjecanje}>{tournament.naziv}</a>
                            <br/>
                        </>
                    ))}
                    {myTournaments.length === 0 && <h3>Još nemate natjecanja</h3>}
                </>}
                {!user && <>
                    <h1>Ulogirajte se kako bi mogli kreirati svoja natjecanja</h1>
                </>
                }
            </div>
            <h1>
                
            </h1>

        </div>
    );
};

export default HomePage;
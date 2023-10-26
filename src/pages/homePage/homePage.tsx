import { Button } from 'primereact/button';   
import { useState, useEffect } from 'react';
import PopupCreateTournament from '../createTournamentPopup/createTournamentPopup';
import './homePage.css';
import { getUser } from '../../dbCalls';

const HomePage = () => {

    const [popupCreate, setPopupCreate] = useState<Boolean>(false);

    const [user, setUser] = useState<any>(null);

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
            console.log(res.data);
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
                    <Button label="Stvori natjecanje" onClick={ stvoriNatjecanje }/>
                    <br/>
                    <Button label="Logout" onClick= { logout }/>
                    <h1>Ulogiran kao: {user.name}</h1>
                </>}
                {!user && <>
                    <Button label="Login" onClick={ login }/>
                </>
                }
            </div>
            <h1>
                
            </h1>

        </div>
    );
};

export default HomePage;
import { Button } from 'primereact/button';   
import { useState } from 'react';
import PopupCreateTournament from '../createTournamentPopup/createTournamentPopup';
import './homePage.css';

const HomePage = () => {

    const [popupCreate, setPopupCreate] = useState<Boolean>(false);

    const stvoriNatjecanje = () => {
        setPopupCreate(true);
    }

    return (
        <div className="home-page-center">
            <PopupCreateTournament
                trigger={popupCreate}
                setTrigger={setPopupCreate}
            />
            
            <div>
                <Button label="Stvori natjecanje" onClick={ stvoriNatjecanje }/>
            </div>

        </div>
    );
};

export default HomePage;
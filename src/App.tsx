import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import HomePage from './pages/homePage/homePage';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import TournamentPage from './pages/tournamentPage/tournamentPage';
import { useEffect } from 'react';
import { getUser } from './dbCalls';

function App() {

  const [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    async function fetchData() {
        const res = await getUser();
        setUser(res.data);
    }
    fetchData();
  }, []);

  return (
    <div className="App">

      <header className="App-header">
        {user ? <>
          <span className="left-align-header">
            <a className="header-link" href="/">Home</a>
          </span>
          <span className="right-align-header">
            {user.name}
            <a className="header-link logout-button" href="/logout">Logout</a>
          </span>
          
        </> : <>
          <span className="left-align-header">
            <a className="header-link" href="/">Home</a>
          </span>
          <span className="right-align-header">
            <a className="header-link" href="/login">Login</a>
          </span>
        </>}
      </header>

      <Routes>
        <Route
          path={"/"}
          element={<HomePage/>}
        />
        <Route
            path={"/natjecanje/:id"}
            element={<TournamentPage/>}
        />
        <Route
            path="*"
            element={<NotFoundPage />}
        />
    </Routes>
    </div>
  );
}

export default App;

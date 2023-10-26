import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import HomePage from './pages/homePage/homePage';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import TournamentPage from './pages/tournamentPage/tournamentPage';

function App() {
  return (
    <div className="App">
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

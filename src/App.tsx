import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import HomePage from './pages/homePage/homePage';
import NotFoundPage from './pages/notFoundPage/notFoundPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path={"/"}
          element={<HomePage/>}
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

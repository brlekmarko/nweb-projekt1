import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "primereact/resources/themes/lara-light-indigo/theme.css";
// import { Client } from "pg";

// export const client = new Client({
//   host: "localhost",
//   user: "postgres",
//   port: 5432,
//   password: "bazepodataka",
//   database: "nweb-projekt1",
// });

// client.connect();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={"/"}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

//import { useEffect, useState } from 'react';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './App.css';
import LoginForm from './login/loginForm';
import EditarUsuario from './usuarios/EditarUsuarios';
import MainLayout from './menu/mainLayout';
import UserMaintenance from './consultar_usuarios/consultas';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
                <Route path="/main" element={<MainLayout />} />
                <Route path="/user-maintenance" element={<UserMaintenance />} /> 
            </Routes>
                
        </Router>
    );
    //const [forecasts, setForecasts] = useState();

    //useEffect(() => {
    //    populateWeatherData();
    //}, []);

    //const contents = forecasts === undefined
    //    ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
    //    : <table className="table table-striped" aria-labelledby="tableLabel">
    //        <thead>
    //            <tr>
    //                <th>nombre</th>
    //                <th>Apellido</th>
    //                <th>cedula</th>
    //                <th>telefono</th>
    //            </tr>
    //        </thead>
    //        <tbody>
    //            {forecasts.map(user =>
    //                <tr key={user.idPadre}>
    //                    <td>{user.nombrePadre}</td>
    //                    <td>{user.apellidosPadre}</td>
    //                    <td>{user.cedulaPadre}</td>
    //                    <td>{user.telefonoPadre}</td>
    //                </tr>
    //            )}
    //        </tbody>
    //    </table>;

    //return (
    //    <div>
    //        <h1 id="tableLabel">Weather forecast</h1>
    //        <p>This component demonstrates fetching data from the server.</p>
    //        {contents}
    //    </div>
    //);
    
    //async function populateWeatherData() {
    //    const response = await fetch('/padres/ObtenerPadres');
    //    const data = await response.json();
    //    console.log(data);

    //    setForecasts(data);
    //}
}

export default App;
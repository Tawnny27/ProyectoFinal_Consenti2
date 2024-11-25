import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import ModalCalendar from './modalcalendar'
import { useUser } from '../UserContext'; // Importar el hook del contexto



function Navbar({ handleCalendarClick, handleLogout }) {
    const { user } = useUser(); // Obtener el usuario del contexto

    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/main">
                <img src={logo} alt="Logo" className="logo-main" />
                    <h1>Consenti2</h1>
                </Link>
            </div>
            <div className="spacer"></div>
            <div className="user-info">
                {user ? (
                    <span>
                        Hola, {user.nombreUsuario} {user.apellidosUsuario}, {'Rol '}({user.rolId})
                    </span> // Mostrar el nombre del usuario
                ) : (
                    <span>Cargando...</span>
                )}
            </div>
            <div className="header-actions">
                <button onClick={ModalCalendar} className="calendar-button">
                    <FontAwesomeIcon icon={faCalendarAlt} /> Calendario
                </button>
                <button onClick={handleLogout} className="logout-button">
                    <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar
                </button>
            </div>
        </header>
    );
}

export default Navbar;

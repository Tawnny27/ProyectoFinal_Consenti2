import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import logo from '../assets/logo.jpg';
import ModalCalendar from './modalcalendar'

function Navbar ({ handleCalendarClick, handleLogout }) {
    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo-main" />
                <h1>Consenti2</h1>
            </div>
            <div className="spacer"></div>
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

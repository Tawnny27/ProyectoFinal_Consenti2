import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import './estilos.css';




function Sidebar ({ showAdminSubmenu, toggleAdminSubmenu, showPlatformSubmenu, togglePlatformSubmenu, showGestFSubMenu, toggleGestFSubMenu }) {
    return (
        <aside className="sidebar">
            <h2>Menú</h2>
            <ul>
                <li>
                    <div onClick={toggleAdminSubmenu} className="menu-item">
                        <span>Administrativo</span>
                        <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                    </div>
                    {showAdminSubmenu && (
                        <ul className="submenu">
                            <li><Link to="/register">Registrar Usuario</Link></li>
                            <li><Link to="/user-maintenance">Mantenimiento de Usuarios</Link></li>
                            <li><Link to="/reportes">Reportes</Link></li>
                            <li><Link to="/Gastos">Control de gastos</Link></li>
                        </ul>
                    )}
                </li>
                <li>
                    <div onClick={togglePlatformSubmenu} className="menu-item">
                        <span>Plataforma</span>
                        <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                    </div>
                    {showPlatformSubmenu && (
                        <ul className="submenu">
                            <li><Link to="/actividades">Actividades (Maestro)</Link></li>
                        </ul>
                    )}
                </li>
                <li>
                    <div onClick={toggleGestFSubMenu} className="menu-item">
                        <span>Gestión Financiera</span>
                        <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                    </div>
                    {showGestFSubMenu && (
                        <ul className="submenu">
                            <li><Link to="/registrar-pago">Registrar Pago</Link></li>
                            <li><Link to="/recibo-pago">Recibo de Pagos</Link></li>
                            <li><Link to="/control-pago">Control de pagos</Link></li>
                        </ul>
                    )}
                </li>
                <li><Link to="/matricula">Matrícula</Link></li>
                <li><Link to="/expedientes">Expedientes</Link></li>
                <li><Link to="/comunicacion">Comunicación</Link></li>
                <li><Link to="/inventario">Inventario</Link></li>
                
            </ul>
        </aside>
    );
}

export default Sidebar;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './mainLayout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faCalendarAlt, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.jpg'; 
import Footer from '../componentes/footer';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const usuario = location.state?.usuario; // Obtener el objeto usuario desde el estado

    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [importantDate, setImportantDate] = useState('');
    const [activityDescription, setActivityDescription] = useState('');
    const [showAdminSubmenu, setShowAdminSubmenu] = useState(false);
    const [showPlatformSubmenu, setShowPlatformSubmenu] = useState(false);
    const [showGestFSubMenu, setShowGestFSubMenu] = useState(false);

    useEffect(() => {
        console.log(usuario)
        // Valida si el usuario necesita cambiar su contraseña
        if (usuario?.passGenerico === true) {
            navigate('/change-password'); 
        }
    }, [usuario, navigate]);

    const handleLogout = () => {
        navigate('/'); 
    };

    const handleCalendarClick = () => {
        setShowCalendarModal(true);
    };

    const handleModalClose = () => {
        setShowCalendarModal(false);
    };

    const handleDateSubmit = (e) => {
        e.preventDefault();
        setShowCalendarModal(false);
    };

    const toggleAdminSubmenu = () => {
        setShowAdminSubmenu(!showAdminSubmenu);
    };

    const toggleGestFSubMenu = () => {
        setShowGestFSubMenu(!showGestFSubMenu);
    }

    const togglePlatformSubmenu = () => {
        setShowPlatformSubmenu(!showPlatformSubmenu);
    };

    return (
        <div className="main-layout">
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo-main" />
                    <h1>Consenti2</h1>
                </div>
                <div className="spacer"></div>
                <div className="header-actions">
                    <button onClick={handleCalendarClick} className="calendar-button">
                        <FontAwesomeIcon icon={faCalendarAlt} /> Calendario
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                        <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar
                    </button>
                </div>
            </header>
            <div className="content-container">
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
                                    <li><Link to="/registrar-usuario">Registrar Usuario</Link></li>
                                    <li><Link to="/user-maintenance">Mantenimiento de Usuarios</Link></li>
                                    <li><Link to="/reportes">Reportes</Link></li>
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
                                    {/* <li><Link to="/main">?</Link></li>
                  <li><Link to="/main">?</Link></li> */}
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
                <main className="main-content">
                    <div className="bienvenidos">
                        <h1>¡Bienvenido!</h1>
                        <img src='/static/media/logo.347a6ba3d825eb7f06e8.jpg' alt='' style={{ width: '150px', paddingTop: '50px' }} />
                        <p className="welcome-text">
                            En Kínder Consenti2, nos dedicamos a brindar una experiencia de aprendizaje amorosa y enriquecedora para los más pequeños. Creemos en un ambiente donde cada niño es valorado y respetado, desarrollando sus habilidades a través del juego, la creatividad y la exploración.
                        </p>
                    </div>
                </main>
            </div>

            {/* Modal para el calendario */}
            {showCalendarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Registrar Actividad</h2>
                        <form onSubmit={handleDateSubmit}>
                            <label>
                                Fecha:
                                <input
                                    className="date-input"
                                    type="date"
                                    value={importantDate}
                                    onChange={(e) => setImportantDate(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Descripción de la Actividad:
                                <textarea
                                    className="activity-textarea"
                                    value={activityDescription}
                                    onChange={(e) => setActivityDescription(e.target.value)}
                                    required
                                    rows="1"
                                />
                            </label>
                            <div className="modal-buttons">
                                <button type="submit" className="submit-button">Registrar</button>
                                <button type="button" onClick={handleModalClose} className="close-button">Cerrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default MainLayout;

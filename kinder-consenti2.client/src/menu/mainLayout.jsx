import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './mainLayout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserPlus, faSignOutAlt, faCalendarAlt, faCaretDown, faChildren,faClipboardList,faMoneyBillWave,faGraduationCap,faFileAlt,faCommentDots,faBoxes,
    faUserEdit, faChartBar  } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.jpg'; 
import Footer from '../componentes/footer';
import { useUser } from '../UserContext';
import { faAddressBook, faBoxesStacked, faCheck, faFileInvoice, faFolderOpen, faHandHoldingDollar, faImages, faSchoolCircleCheck, faSquarePollHorizontal, faWallet } from '../../../node_modules/@fortawesome/free-solid-svg-icons/index';


const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const usuario = location.state?.usuario; // Obtener el objeto usuario desde el estado
    const { user } = useUser();

    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [importantDate, setImportantDate] = useState('');
    const [activityDescription, setActivityDescription] = useState('');
    const [showAdminSubmenu, setShowAdminSubmenu] = useState(false);
    const [showPlatformSubmenu, setShowPlatformSubmenu] = useState(false);
    const [showGestFSubMenu, setShowGestFSubMenu] = useState(false);
    const [showEvaluaSubmenu, setShowEvaluaSubmenu] = useState(false);
    const [showContenidoSubmenu, setShowContenidoSubmenu] = useState(false);

    useEffect(() => {
        console.log(usuario)
        // Valida si el usuario necesita cambiar su contrase�a
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
    const toggleEvaluaSubmenu = () => {
        setShowEvaluaSubmenu(!showEvaluaSubmenu);
    };
    const toggleContenidoSubmenu = () => {
        setShowContenidoSubmenu(!showContenidoSubmenu);
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
                    <h2>Men�</h2>
                    <ul>
                        {user.rolId === 1 && (
                        <li>
                            <div onClick={toggleAdminSubmenu} className="menu-item">
                                <span>Administrativo</span>
                                <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                            </div>
                            {showAdminSubmenu && (
                                <ul className="submenu">
                                    <li>
                                        <Link to="/registrar-usuario">
                                            <FontAwesomeIcon icon={faUserPlus} className="menu-icon" /> Registrar Usuario
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/user-maintenance">
                                            <FontAwesomeIcon icon={faUserEdit} className="menu-icon" /> Consultar Usuarios
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/reportes">
                                            <FontAwesomeIcon icon={faChartBar} className="menu-icon" /> Reportes
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        )}
                        {user.rolId !== 3 && (
                        <li>
                            <div onClick={togglePlatformSubmenu} className="menu-item">
                                <span>Plataforma</span>
                                <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                            </div>
                            {showPlatformSubmenu && (
                                <ul className="submenu">
                                    <li>
                                    <Link to="/activity-panel">
                                        <FontAwesomeIcon icon={faChildren} className="menu-icon" /> Actividades (Maestro)
                                    </Link>
                                    </li>
                                    <li><Link to="/attendance-panel">Asistencia</Link></li>
                                    {/* <li><Link to="/main">?</Link></li>
                  <li><Link to="/main">?</Link></li> */}
                                </ul>
                            )}
                            </li>
                        )}
                        {user.rolId === 1 && (
                        <li>
                            <div onClick={toggleGestFSubMenu} className="menu-item">
                                <span>Gesti�n Financiera</span>
                                <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                            </div>
                            {showGestFSubMenu && (
                                <ul className="submenu">
                                    <li><Link to="/registrar-pago">
                                        <FontAwesomeIcon icon={faWallet} className="menu-icon" /> Registrar Pago</Link></li>
                                    <li><Link to="/recibo-pago">
                                        <FontAwesomeIcon icon={faFileInvoice} className="menu-icon" /> Recibo de Pagos</Link></li>
                                    <li><Link to="/control-pago">
                                        <FontAwesomeIcon icon={faHandHoldingDollar} className="menu-icon" /> Control de pagos</Link></li>
                                </ul>
                            )}
                        </li>
                        )}
                        <li className="menu-link"><Link to="/matricula">
                            <FontAwesomeIcon icon={faSchoolCircleCheck} className="menu-icon" />  Matr�cula</Link></li>
                        <li className="menu-link"><Link to="/expedientes">
                            <FontAwesomeIcon icon={faAddressBook} className="menu-icon" />Expedientes</Link></li>
                        <li className="menu-link"><Link to="/comunicacion">
                            <FontAwesomeIcon icon={faCommentDots} className="menu-icon" />Comunicaci�n</Link></li>
                        <li className="menu-link"><Link to="/inventario">
                            <FontAwesomeIcon icon={faBoxesStacked} className="menu-icon" />Inventario</Link></li>
                        {user.rolId === 3 && (
                            <li>

                                <div onClick={toggleEvaluaSubmenu} className="menu-item">
                                    <span>Evaluaci�n</span>
                                    
                                    <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                                </div>
                                {showEvaluaSubmenu && (
                                    <ul className="submenu">
                                        <li><Link to="/registrar-encuesta">
                                            <FontAwesomeIcon icon={faSquarePollHorizontal} className="menu-icon" />Encuesta</Link></li>
                                        <li><Link to="/evalua-maestra">
                                            <FontAwesomeIcon icon={faClipboardList} className="menu-icon" />Evaluaci�n Docente</Link></li>
                                    </ul>
                                )}
                            </li>
                        )}
                        <li>
                            <div onClick={toggleContenidoSubmenu} className="menu-item">
                                <span>Contenido</span>
                                <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                            </div>
                            {showContenidoSubmenu && (
                                <ul className="submenu">
                                    <li><Link to="/materiales">
                                        <FontAwesomeIcon icon={faFolderOpen} className="menu-icon" />Materiales</Link></li>
                                    <li><Link to="/fotos">
                                        <FontAwesomeIcon icon={faImages} className="menu-icon" />Fotos</Link></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </aside>
                <main className="main-content">
                    <div className="bienvenidos">
                        <h1>�Bienvenido!</h1>
                        <img src='/static/media/logo.347a6ba3d825eb7f06e8.jpg' alt='' style={{ width: '150px', paddingTop: '50px' }} />
                        <p className="welcome-text">
                            En K�nder Consenti2, nos dedicamos a brindar una experiencia de aprendizaje amorosa y enriquecedora para los m�s peque�os. Creemos en un ambiente donde cada ni�o es valorado y respetado, desarrollando sus habilidades a trav�s del juego, la creatividad y la exploraci�n.
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
                                Descripci�n de la Actividad:
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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './mainLayout.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import {
//    faUserPlus, faSignOutAlt, faCalendarAlt, faCaretDown, faChildren, faClipboardList, faMoneyBillWave, faGraduationCap, faFileAlt, faCommentDots, faBoxes,
//    faUserEdit, faChartBar
//} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.jpg';
import Footer from '../componentes/footer';
import Navbar from "../componentes/navbar";
import Sidebar from "../componentes/Sidebar";
import { useUserContext } from '../UserContext';
//import { faAddressBook, faReceipt, faBoxesStacked, faCheck, faFileInvoice, faFolderOpen, faHandHoldingDollar, faImages, faSchoolCircleCheck, faSquarePollHorizontal, faWallet, faChartSimple } from '../../../node_modules/@fortawesome/free-solid-svg-icons/index';
//import { Nav } from '../../../node_modules/react-bootstrap/esm/index';
//import { use } from 'react';


const MainLayout = () => {
    const navigate = useNavigate();
    //const location = useLocation();
    //const usuario = location.state?.usuario; // Obtener el objeto usuario desde el estado
    const { user, setUser } = useUserContext();

    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [importantDate, setImportantDate] = useState('');
    const [activityDescription, setActivityDescription] = useState('');
    const [showAdminSubmenu, setShowAdminSubmenu] = useState(false);
    const [showPlatformSubmenu, setShowPlatformSubmenu] = useState(false);
    const [showGestFSubMenu, setShowGestFSubMenu] = useState(false);
    const [showEvaluaSubmenu, setShowEvaluaSubmenu] = useState(false);
    const [showContenidoSubmenu, setShowContenidoSubmenu] = useState(false);
    const [showComunicacionSubmenu, setShowComunicacionSubmenu] = useState(false);

    /*
    useEffect(() => {
        console.log(usuario)
        // Valida si el usuario necesita cambiar su contrase�a
        if (usuario?.passGenerico === true) {
            navigate('/change-password'); 
        }
    }, [usuario, navigate]);
    */
    useEffect(() => {
        console.log(user)
        // Valida si el usuario necesita cambiar su contrase�a
        if (user.passGenerico === true) {
            navigate('/change-password');
        }
    }, []);

    useEffect(() => {
        if (Object.keys(user).length === 0) {
            navigate('/');
        }
    }, [user]);

    const handleLogout = () => {
        setUser({});
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

    /*
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
    const toggleComunicacionSubmenu = () => {
        setShowComunicacionSubmenu(!showComunicacionSubmenu);
    };
    */
    return (
        <div className="main-layout">
            { /* Navbar*/}
            {/*
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
            */}

            <Navbar />
            { /* Lateral */}
            <div className="content-container">
                <Sidebar />
                { /* 
                     <aside className="sidebar">
                    <h2>Menú</h2>
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
                                    </ul>
                                )}
                            </li>
                        )}
                        {user.rolId === 1 && (
                        <li>
                            <div onClick={toggleGestFSubMenu} className="menu-item">
                                <span>Gestión Financiera</span>
                                <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                            </div>
                            {showGestFSubMenu && (
                                <ul className="submenu">
                                    <li><Link to="/registrar-pago2">
                                        <FontAwesomeIcon icon={faWallet} className="menu-icon" /> Registrar Pago</Link></li>
                                    <li><Link to="/recibo-pago">
                                        <FontAwesomeIcon icon={faFileInvoice} className="menu-icon" /> Recibo de Pagos</Link></li>
                                        <li><Link to="/Factura-maintenance">
                                            <FontAwesomeIcon icon={faHandHoldingDollar} className="menu-icon" /> Control de pagos</Link></li>       
                                        <li><Link to="/Gastos">
                                            <FontAwesomeIcon icon={faReceipt} className="menu-icon" /> Control de gastos</Link></li>
                                    </ul>
                                )}
                            </li>
                        )}
                        <li>
                            <Link to="/Grupos">Aulas</Link>
                        </li>

                        <li className="menu-link"><Link to="/matricula">
                            <FontAwesomeIcon icon={faSchoolCircleCheck} className="menu-icon" />  Matrícula</Link></li>
                        {user.rolId === 1 && (
                            <li className="menu-link"><Link to="/expedientes">
                                <FontAwesomeIcon icon={faAddressBook} className="menu-icon" />Expedientes</Link></li>
                        )}
                        <li>
                            <div onClick={toggleComunicacionSubmenu} className="menu-item">
                                <span>Comunicación</span>
                                <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                            </div>
                            {showComunicacionSubmenu && (
                                <ul className="submenu">
                                    <li><Link to="/comunicacion">
                                        <FontAwesomeIcon icon={faWallet} className="menu-icon" /> Comunicación correo</Link></li>
                                    <li><Link to="/comunicacion-mensajes">
                                        <FontAwesomeIcon icon={faFileInvoice} className="menu-icon" /> Comunicación mensajería</Link></li>
                                    
                                </ul>
                            )}
                        </li>
                        
                        {user.rolId === 1 && (
                            <li className="menu-link"><Link to="/inventario">
                                <FontAwesomeIcon icon={faBoxesStacked} className="menu-icon" />Inventario</Link>
                            </li>
                        )}
                        {user.rolId === 3 && (
                            <li>

                                <div onClick={toggleEvaluaSubmenu} className="menu-item">
                                    <span>Evaluación</span>

                                    <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                                </div>
                                {showEvaluaSubmenu && (
                                    <ul className="submenu">
                                        <li><Link to="/registrar-encuesta">
                                            <FontAwesomeIcon icon={faSquarePollHorizontal} className="menu-icon" />Encuesta</Link></li>
                                        <li><Link to="/evalua-maestra">
                                            <FontAwesomeIcon icon={faClipboardList} className="menu-icon" />Evaluación Docente</Link></li>
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
                                    <li><Link to="/Lista-actividades">
                                        <FontAwesomeIcon icon={faImages} className="menu-icon" />Lista de actividades</Link></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </aside>
                
                */}
               

                <main className="main-content">
                    <div className="bienvenidos">
                        <h1>!Bienvenido!</h1>
                        <img src='/static/media/logo.347a6ba3d825eb7f06e8.jpg' alt='' style={{ width: '150px', paddingTop: '50px' }} />
                        <p className="welcome-text">
                            En Kínder Consenti2, nos dedicamos a brindar una experiencia de aprendizaje amorosa y enriquecedora para los más pequeños. Creemos en un ambiente donde cada niño es valorado y respetado, desarrollando sus habilidades a través del juego, la creatividad y la exploración.
                        </p>
                    </div>
                </main>
            </div>

            { /* Fin de Lateral*/}

            {/* Modal para el calendario */}
            {/*showCalendarModal && (
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
            )*/}
            {/* Fin  Modal para el calendario */}

            <Footer />
        </div>
    );
};

export default MainLayout;

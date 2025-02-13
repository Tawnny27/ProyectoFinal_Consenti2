import './estilos.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCaretDown, faChildren, faClipboardList, faUserEdit, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../UserContext';
import { faAddressBook, faReceipt, faBoxesStacked, faFileInvoice, faFolderOpen, faHandHoldingDollar, faImages, faSchoolCircleCheck, faSquarePollHorizontal, faWallet } from '../../../node_modules/@fortawesome/free-solid-svg-icons/index';

function Sidebar() {

    const { user } = useUserContext();
    const [showAdminSubmenu, setShowAdminSubmenu] = useState(false);
    const [showPlatformSubmenu, setShowPlatformSubmenu] = useState(false);
    const [showGestFSubMenu, setShowGestFSubMenu] = useState(false);
    const [showEvaluaSubmenu, setShowEvaluaSubmenu] = useState(false);
    const [showContenidoSubmenu, setShowContenidoSubmenu] = useState(false);
    const [showComunicacionSubmenu, setShowComunicacionSubmenu] = useState(false);


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



    return (

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
                                <li><Link to="/FacturasPagadas">
                                    <FontAwesomeIcon icon={faFileInvoice} className="menu-icon" /> Recibo de Pagos</Link></li>
                                <li><Link to="/Factura-maintenance">
                                    <FontAwesomeIcon icon={faHandHoldingDollar} className="menu-icon" /> Control de pagos</Link></li>
                                <li><Link to="/Gastos">
                                    <FontAwesomeIcon icon={faReceipt} className="menu-icon" /> Control de gastos</Link></li>
                            </ul>
                        )}
                    </li>
                )}

                { /*-----------------------------------------------------------------------------------*/}

                {user.rolId === 3 && (
                    <li>
                        <Link to="/registrar-pago2">
                            <FontAwesomeIcon icon={faWallet} className="menu-icon" /> Registrar Pago</Link>
                    </li>
                )}

                { /*-----------------------------------------------------------------------------------*/}
                {/*<li>                   */}
                {/*    <Link to="/comportamiento">*/}
                {/*        <FontAwesomeIcon icon={faWallet} className="menu-icon" /> Comportamiento</Link>*/}
                {/*</li>*/}

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

    );
}

export default Sidebar;

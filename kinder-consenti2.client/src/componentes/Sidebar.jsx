/* eslint-disable react/prop-types */
import './estilos.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCaretDown, faChildren, faClipboardList, faUserEdit, faChartBar, faUsers, faChild } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../UserContext';
import {
    faAddressBook, faReceipt, faBoxesStacked, faFileInvoice, faFolderOpen,
    faHandHoldingDollar, faImages, faSchoolCircleCheck, faSquarePollHorizontal, faWallet
} from '../../../node_modules/@fortawesome/free-solid-svg-icons/index';
<FontAwesomeIcon icon="fa-regular fa-users" />

function Sidebar( {ViewSidebard}) {

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

        <aside className={ViewSidebard ?"sidebarOpen": "sidebardClose"}>
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
                                    <Link to="/pages/registrar-usuario">
                                        <FontAwesomeIcon icon={faUserPlus} className="menu-icon" /> Registrar Usuario
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/alumno-maintenance">
                                        <FontAwesomeIcon icon={faChild} className="menu-icon" /> Alumnos
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/user-maintenance">
                                        <FontAwesomeIcon icon={faUserEdit} className="menu-icon" /> Consultar Usuarios
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/Grupos">
                                        <FontAwesomeIcon icon={faUsers} className="menu-icon" />
                                        Aulas
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/reportes">
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
                                    <Link to="/pages/activity-panel">
                                        <FontAwesomeIcon icon={faChildren} className="menu-icon" /> Actividades (Maestro)
                                    </Link>
                                </li>
                                <li><Link to="/pages/attendance-panel">Asistencia</Link></li>
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
                                <li><Link to="/pages/registrar-pago">
                                    <FontAwesomeIcon icon={faWallet} className="menu-icon" />
                                    Registrar Pago
                                </Link>
                                </li>
                                <li>
                                    <Link to="/pages/Factura-maintenance">
                                        <FontAwesomeIcon icon={faHandHoldingDollar} className="menu-icon" />
                                        Control de pagos
                                    </Link>
                                </li>
                                <li><Link to="/pages/Gastos">
                                    <FontAwesomeIcon icon={faReceipt} className="menu-icon" />
                                    Control de gastos
                                </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                )}

                { /*-----------------------------------------------------------------------------------*/}

                {user.rolId === 3 && (
                    <li>
                        <Link to="/pages/registrar-pago">
                            <FontAwesomeIcon icon={faWallet} className="menu-icon" />
                            Registrar Pago
                        </Link>
                    </li>
                )}

                <li>
                    <Link to="/pages/comportamiento">
                        <FontAwesomeIcon icon={faWallet} className="menu-icon" />
                        Comportamiento
                    </Link>
                </li>

                <li className="menu-link">
                    <Link to="/pages/matricula">
                        <FontAwesomeIcon icon={faSchoolCircleCheck} className="menu-icon" />
                        Matrícula
                    </Link>
                </li>
                {user.rolId === 1 && (
                    <li className="menu-link">
                        <Link to="/pages/expedientes">
                            <FontAwesomeIcon icon={faAddressBook} className="menu-icon" />
                            Expedientes
                        </Link>
                    </li>
                )}
                <li>
                    <div onClick={toggleComunicacionSubmenu} className="menu-item">
                        <span>Comunicación</span>
                        <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
                    </div>
                    {showComunicacionSubmenu && (
                        <ul className="submenu">
                            <li><Link to="/pages/comunicacion">
                                <FontAwesomeIcon icon={faWallet} className="menu-icon" /> Comunicación correo</Link></li>
                            <li><Link to="/pages/comunicacion-mensajes">
                                <FontAwesomeIcon icon={faFileInvoice} className="menu-icon" /> Comunicación mensajería</Link></li>

                        </ul>
                    )}
                </li>

                {user.rolId === 1 && (
                    <li className="menu-link"><Link to="/pages/inventario">
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
                                <li><Link to="/pages/registrar-encuesta">
                                    <FontAwesomeIcon icon={faSquarePollHorizontal} className="menu-icon" />Encuesta</Link></li>
                                <li><Link to="/pages/evalua-maestra">
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
                            <li>
                                {/* <div onClick={navegar('/pages/materiales')} > */}
                                <Link to="/pages/materiales" >
                                    <FontAwesomeIcon icon={faFolderOpen} className="menu-icon" />Materiales
                                </Link>
                                {/* </div> */}
                            </li>
                            <li>
                                {/* <div onClick={navegar('/pages/fotos')}> */}
                                <Link to="/pages/fotos" >
                                    <FontAwesomeIcon icon={faImages} className="menu-icon" />Fotos
                                </Link>
                                {/* </div> */}
                            </li>
                            <li>
                                {/* <div onClick={navegar('/pages/Lista-actividades')}> */}
                                <Link to="/pages/Lista-actividades" >
                                    <FontAwesomeIcon icon={faImages} className="menu-icon" />Lista de actividades
                                </Link>
                                {/* </div> */}
                            </li>
                        </ul>
                    )}
                </li>
            </ul>


        </aside>

    );
}

export default Sidebar;

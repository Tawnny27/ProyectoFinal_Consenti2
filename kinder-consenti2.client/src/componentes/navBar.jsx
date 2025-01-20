import {  useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { useUserContext } from '../UserContext'; // Importar el hook del contexto


function Navbar() {
    const { user, setUser } = useUserContext(); // Obtener el usuario del contexto
    const navigate = useNavigate(); // Inicializa el hook useNavigate

    const handleMenuClick = () => {
        navigate('/main'); // Redirige al usuario a la ruta '/main'
    };

    const handleLogout = () => {
        setUser({});
        navigate('/'); // Redirigir a la p�gina de inicio de sesi�n
    };

    useEffect(() => {
        if (Object.keys(user).length === 0) {
            navigate('/');
        }
    }, [user]);
    
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
                <button onClick={handleMenuClick} className="home-button">
                    <FontAwesomeIcon icon={faHome} /> Men�
                </button>
                <button onClick={handleLogout} className="logout-button">
                    <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar
                </button>
            </div>
        </header>
    );
}

export default Navbar;

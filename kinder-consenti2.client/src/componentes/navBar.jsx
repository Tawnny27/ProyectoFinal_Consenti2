/* eslint-disable react/prop-types */
import { useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { useUserContext } from '../UserContext'; // Importar el hook del contexto



function Navbar({ setearSide }) {
    const { user, setUser } = useUserContext(); // Obtener el usuario del contexto
    const navigate = useNavigate(); // Inicializa el hook useNavigate

 
    const handleLogout = () => {
        setUser({});
        navigate('/'); // Redirigir a la página de inicio de sesión
    };

    useEffect(() => {
        if (Object.keys(user).length === 0) {
            navigate('/');
        }
    }, [user]);
    
    return (
        <header className="header">
            <div className="logo-container" onClick={setearSide}>
               {/* <Link to="/main"> */}
                <img src={logo} alt="Logo" className="logo-main" />
                    <h1>Consenti2</h1>
               {/* </Link> */} 
            </div>
            <div className="spacer"></div>
            <div className="user-info">
                {user ? (
                    <span>
                        Hola, {user.nombreUsuario} {user.apellidosUsuario}
                    </span> // Mostrar el nombre del usuario
                ) : (
                    <span>Cargando...</span>
                )}
            </div>
            <div className="header-actions">              
                <button onClick={handleLogout} className="logout-button">
                    <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar
                </button>
            </div>
        </header>
    );
}

export default Navbar;

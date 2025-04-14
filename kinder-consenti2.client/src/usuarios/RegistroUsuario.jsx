// src/usuarios/RegistroUsuario.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './registro.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield, faIdCard, faPhone, faInfoCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import { ObtenerRolesRegistro, CrearUsuario } from '../apiClient';

const RegistroUsuario = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [usuario, setUsuario] = useState({
        idUsuario: 0,
        rolId: '',
        nombreUsuario: '',
        apellidosUsuario: '',
        cedulaUsuario: '',
        telefonoUsuario: '',
        correoUsuario: '',
        contrasennaUsuario: '',
    });
    const [mensajeExito, setMensajeExito] = useState('');
    const [error, setError] = useState('');

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setUsuario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // RegistroUsuario.jsx
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await ObtenerRolesRegistro();  // Ahora data es el array de roles
                setRoles(data);  // Establecer el estado de roles con el array recibido
            } catch (error) {
                console.error("Error al cargar roles:", error);
            }
        };
        fetchRoles();
    }, []);


    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        try {
            const response = await CrearUsuario(usuario);

            if (response) {
                setMensajeExito('Usuario registrado exitosamente.');
                setTimeout(() => {
                    navigate(usuario.rolId === "3" ? '/pages/alumno-maintenance' : '/pages/user-maintenance');
                }, 2000);
            }
        } catch (error) {
            let mensajeError = 'Hubo un problema al registrar el usuario.';

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        mensajeError = error.response.data?.message || 'La Cédula o Correo ya están registrados.';
                        break;
                    case 401:
                        mensajeError = 'No autorizado. Inicie sesión nuevamente.';
                        break;
                    case 409:
                        mensajeError = 'El usuario ya existe en el sistema.';
                        break;
                    case 500:
                        mensajeError = 'Error interno del servidor.';
                        break;
                    default:
                        mensajeError = `Error: ${error.response.status} - Intente nuevamente.`;
                }
            } else if (error.request) {
                mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión.';
            }

            setError(mensajeError);
        }
    };

    return (
        <div className="usuario-maintenance-containerR">      
            <div className="usuario-form-containerR">
                <h1 className="usuario-titleR">Registrar Usuario</h1>
                {mensajeExito && <div className="usuario-success-messageR">{mensajeExito}</div>}

                <form onSubmit={manejarEnvio} className="usuario-formR">
                    <div className="usuario-form-groupR">
                        <label className="usuario-labelR">Rol</label>
                        <div className="usuario-input-containerR">
                            <select
                                name="rolId"
                                value={usuario.rolId}
                                onChange={manejarCambio}
                                className="usuario-selectR"
                                required
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map((rol) => (
                                    <option key={rol.idRol} value={rol.idRol}>
                                        {rol.nombreRol}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="usuario-form-groupR">
                        <label className="usuario-labelR">Nombre</label>
                        <div className="usuario-input-containerR">
                            <FontAwesomeIcon icon={faUser} className="usuario-input-iconR" />
                            <input
                                type="text"
                                name="nombreUsuario"
                                value={usuario.nombreUsuario}
                                onChange={manejarCambio}
                                className="usuario-inputR"
                                required
                            />
                        </div>
                    </div>

                    <div className="usuario-form-groupR">
                        <label className="usuario-labelR">Apellidos</label>
                        <div className="usuario-input-containerR">
                            <FontAwesomeIcon icon={faUser} className="usuario-input-iconR" />
                            <input
                                type="text"
                                name="apellidosUsuario"
                                value={usuario.apellidosUsuario}
                                onChange={manejarCambio}
                                className="usuario-inputR"
                                required
                            />
                        </div>
                    </div>

                    <div className="usuario-form-groupR">
                        <label className="usuario-labelR">Cédula</label>
                        <div className="usuario-input-containerR">
                            <FontAwesomeIcon icon={faIdCard} className="usuario-input-iconR" />
                            <input
                                type="text"
                                name="cedulaUsuario"
                                value={usuario.cedulaUsuario}
                                onChange={manejarCambio}
                                className="usuario-inputR"
                                required
                            />
                        </div>
                    </div>

                    <div className="usuario-form-groupR">
                        <label className="usuario-labelR">Teléfono</label>
                        <div className="usuario-input-containerR">
                            <FontAwesomeIcon icon={faPhone} className="usuario-input-iconR" />
                            <input
                                type="text"
                                name="telefonoUsuario"
                                value={usuario.telefonoUsuario}
                                onChange={manejarCambio}
                                className="usuario-inputR"
                                required
                            />
                        </div>
                    </div>

                    <div className="usuario-form-groupR">
                        <label className="usuario-labelR">Correo</label>
                        <div className="usuario-input-containerR">
                            <FontAwesomeIcon icon={faInfoCircle} className="usuario-input-iconR" />
                            <input
                                type="email"
                                name="correoUsuario"
                                value={usuario.correoUsuario}
                                onChange={manejarCambio}
                                className="usuario-inputR"
                                required
                            />
                        </div>
                    </div>                 

                    <button type="submit" className="usuario-button-saveR">Registrar Usuario</button>
                    {error && <div className="usuario-error-messageR">{error}</div>}
                </form>
            </div>
        
        </div>
    );
};

export default RegistroUsuario;
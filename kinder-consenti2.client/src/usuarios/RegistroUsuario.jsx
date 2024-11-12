// src/usuarios/RegistroUsuario.jsx
import React, { useState, useEffect } from 'react';
import axios from '../axios'; // Importar configuración de axios
import { useNavigate } from 'react-router-dom';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import './registro.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield, faIdCard, faPhone, faInfoCircle, faLock } from '@fortawesome/free-solid-svg-icons';


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

    useEffect(() => {
        
        const fetchRoles = async () => {
            const response = await fetch('https://localhost:44369/Roles/ObtenerRoles'); 
            const data = await response.json();
            setRoles(data);
        };
        fetchRoles();
    }, []);




    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            // Limpiar mensajes anteriores
            setError('');
            setMensajeExito('');

            const response = await axios.post('https://localhost:44369/Usuarios/CrearUsuario/', usuario);

            // Verificar si la respuesta es exitosa
            if (response.data) {
                setMensajeExito('Usuario registrado exitosamente.');

                // Espera 2 segundos y luego redirige según el rol seleccionado
                setTimeout(() => {
                    if (usuario.rolId === "3") {
                        navigate('/alumno-maintenance');
                    } else {
                        navigate('/user-maintenance');
                    }
                }, 2000);
            }
        } catch (error) {
            // Manejo detallado de errores
            let mensajeError = 'Hubo un problema al registrar el usuario.';

            if (error.response) {
                // El servidor respondió con un estado de error
                if (error.response.data && error.response.data.message) {
                    mensajeError = error.response.data.message;
                } else {
                    switch (error.response.status) {
                        case 400:
                            mensajeError = 'La Cedula o Correo electronico ya fueron registrados anteriormente.';
                            break;
                        case 401:
                            mensajeError = 'No autorizado. Por favor inicie sesión nuevamente.';
                            break;
                        case 409:
                            mensajeError = 'El usuario ya existe en el sistema.';
                            break;
                        case 500:
                            mensajeError = 'Error interno del servidor. Por favor intente más tarde.';
                            break;
                        default:
                            mensajeError = `Error: ${error.response.status} - Por favor intente nuevamente.`;
                    }
                }
            } else if (error.request) {
                // La solicitud se hizo pero no se recibió respuesta
                mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
            }

            console.error("Error al registrar usuario:", error);
            setError(mensajeError);
        }
    };


    return (
        <div className="usuario-maintenance-container">
            <Navbar />
            <div className="usuario-form-container">
                <h1 className="usuario-title">Registrar Usuario</h1>
                {mensajeExito && <div className="usuario-success-message">{mensajeExito}</div>}

                <form onSubmit={manejarEnvio} className="usuario-form">
                    <div className="usuario-form-group">
                        <label className="usuario-label">ID Rol</label>
                        <div className="usuario-input-container">
                            
                            <select
                                name="rolId"
                                value={usuario.rolId}
                                onChange={manejarCambio}
                                className="usuario-select"
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

                    <div className="usuario-form-group">
                        <label className="usuario-label">Nombre</label>
                        <div className="usuario-input-container">
                            <FontAwesomeIcon icon={faUser} className="usuario-input-icon" />
                            <input
                                type="text"
                                name="nombreUsuario"
                                value={usuario.nombreUsuario}
                                onChange={manejarCambio}
                                className="usuario-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="usuario-form-group">
                        <label className="usuario-label">Apellidos</label>
                        <div className="usuario-input-container">
                            <FontAwesomeIcon icon={faUser} className="usuario-input-icon" />
                            <input
                                type="text"
                                name="apellidosUsuario"
                                value={usuario.apellidosUsuario}
                                onChange={manejarCambio}
                                className="usuario-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="usuario-form-group">
                        <label className="usuario-label">Cédula</label>
                        <div className="usuario-input-container">
                            <FontAwesomeIcon icon={faIdCard} className="usuario-input-icon" />
                            <input
                                type="text"
                                name="cedulaUsuario"
                                value={usuario.cedulaUsuario}
                                onChange={manejarCambio}
                                className="usuario-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="usuario-form-group">
                        <label className="usuario-label">Teléfono</label>
                        <div className="usuario-input-container">
                            <FontAwesomeIcon icon={faPhone} className="usuario-input-icon" />
                            <input
                                type="text"
                                name="telefonoUsuario"
                                value={usuario.telefonoUsuario}
                                onChange={manejarCambio}
                                className="usuario-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="usuario-form-group">
                        <label className="usuario-label">Correo</label>
                        <div className="usuario-input-container">
                            <FontAwesomeIcon icon={faInfoCircle} className="usuario-input-icon" />
                            <input
                                type="email"
                                name="correoUsuario"
                                value={usuario.correoUsuario}
                                onChange={manejarCambio}
                                className="usuario-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="usuario-form-group">
                        <label className="usuario-label">Contraseña</label>
                        <div className="usuario-input-container">
                            <FontAwesomeIcon icon={faLock} className="usuario-input-icon" />
                            <input
                                type="password"
                                name="contrasennaUsuario"
                                value={usuario.contrasennaUsuario}
                                onChange={manejarCambio}
                                className="usuario-input"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="usuario-button-save">Registrar Usuario</button>
                    {error && <div className="usuario-error-message">{error}</div>}
                </form>
            </div>
            <Footer />
        </div>

    );
};

export default RegistroUsuario;

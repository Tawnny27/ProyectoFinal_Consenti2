
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faUser, faEnvelope, faPhone, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import './EditarUsuarios.css'; 

const EditarUsuario = () => {
    const { id } = useParams(); // Obtener el id del usuario desde la URL
    const navigate = useNavigate(); // Hook para la navegación
    const [usuario, setUsuario] = useState({
        idUsuario: '',
        rolId: '',
        nombreUsuario: '',
        apellidosUsuario: '',
        cedulaUsuario: '',
        telefonoUsuario: '',
        correoUsuario: '',
        estado: false,
        rol: { idRol: '', nombreRol: '' },
    });
    const [mensajeExito, setMensajeExito] = useState(''); // Estado para el mensaje de éxito

    useEffect(() => {
        // Función para obtener el usuario a editar
        const obtenerUsuario = async () => {
            try {
                const response = await axios.get(`https://localhost:44369/Usuarios/BuscarUsuarios/${id}`);
                setUsuario(response.data);
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };

        obtenerUsuario();
    }, [id]);

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;

        // Si el campo es rolId, actualizamos el objeto rol
        if (name === 'rolId') {
            setUsuario((prevState) => ({
                ...prevState,
                rol: {
                    ...prevState.rol,
                    idRol: value, // Actualiza solo el idRol dentro del objeto rol
                },
            }));
        } else {
            setUsuario((prevState) => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            await axios.put('https://localhost:44369/Usuarios/EditarUsuario', usuario);
            setMensajeExito('Los cambios se guardaron correctamente.');
            setTimeout(() => {
                navigate(`/editar-usuario/${usuario.idUsuario}`);
            }, 2000);
        } catch (error) {
            console.error("Error al editar el usuario:", error);
        }
    };

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <div className="register-user-form-container">
                <form onSubmit={manejarEnvio} className="edit-user-form">
                    <h2>Editar Usuario</h2>
                    {mensajeExito && <div className="success-message">{mensajeExito}</div>}

                    <div className="edit-form-group">
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faIdCard} />
                            <input
                                type="text"
                                name="idUsuario"
                                value={usuario.idUsuario}
                                onChange={manejarCambio}
                                disabled
                                placeholder="ID Usuario"
                            />
                        </div>
                    </div>

                    <div className="edit-form-group">
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faUser} />
                            <input
                                type="text"
                                name="rolId"
                                value={usuario.rol.idRol}
                                onChange={manejarCambio}
                                required
                                placeholder="ID Rol"
                            />
                        </div>
                    </div>

                    <div className="edit-form-group">
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faUser} />
                            <input
                                type="text"
                                name="nombreUsuario"
                                value={usuario.nombreUsuario}
                                onChange={manejarCambio}
                                required
                                placeholder="Nombre"
                            />
                        </div>
                    </div>

                    <div className="edit-form-group">
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faUser} />
                            <input
                                type="text"
                                name="apellidosUsuario"
                                value={usuario.apellidosUsuario}
                                onChange={manejarCambio}
                                required
                                placeholder="Apellidos"
                            />
                        </div>
                    </div>

                    <div className="edit-form-group">
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faIdCard} />
                            <input
                                type="text"
                                name="cedulaUsuario"
                                value={usuario.cedulaUsuario}
                                onChange={manejarCambio}
                                required
                                placeholder="Cédula"
                            />
                        </div>
                    </div>

                    <div className="edit-form-group">
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faPhone} />
                            <input
                                type="text"
                                name="telefonoUsuario"
                                value={usuario.telefonoUsuario}
                                onChange={manejarCambio}
                                required
                                placeholder="Teléfono"
                            />
                        </div>
                    </div>

                    <div className="edit-form-group">
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faEnvelope} />
                            <input
                                type="email"
                                name="correoUsuario"
                                value={usuario.correoUsuario}
                                onChange={manejarCambio}
                                required
                                placeholder="Correo"
                            />
                        </div>
                    </div>

                    <div className="edit-form-group">
                        <div className="input-icon">
                            <label>
                                <FontAwesomeIcon icon={faUserCheck} />
                                <input
                                    type="checkbox"
                                    name="estado"
                                    checked={usuario.estado}
                                    onChange={manejarCambio}
                                />
                                Estado: {usuario.estado ? " Activo" : " Inactivo"}
                            </label>
                        </div>
                    </div>

                    <div className="button-group">
                        <button type="submit">Guardar Cambios</button>
                        <button style={{ backgroundColor: '#A569BD' }} type="button" onClick={() => navigate('/main')}>Cancelar</button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EditarUsuario;

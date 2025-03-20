
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faUser, faEnvelope, faPhone, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import './EditarUsuarios.css'; 
import { EditarUsuarioAp, BuscarUsuarios } from '../apiClient'; // Importar las funciones desde apiClient.js

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


    async function obtenerUsuario ()  {
        try {
            const response = await BuscarUsuarios(id);
            if (response.status == 200) {
                setUsuario(response.data);
                console.log(response.data);
                console.log(response);
                //console.log(id);
            } else {
                console.log(response.data);
            }

        } catch (error) {
            console.error("Error al obtener el usuario:", error);
        }

    };

    useEffect(() => {
        // Función para obtener el usuario a editar
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
            await EditarUsuarioAp(usuario);            
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
         
            <div className="register-user-form-container" style={{ marginTop: '100px' }}>
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
                                value={usuario.rolId}
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
                        <button style={{ backgroundColor: '#48C9B0' }} type="submit">Guardar Cambios</button>
                        <button style={{ backgroundColor: '#A569BD' }} type="button" onClick={() => navigate('/main')}>Cancelar</button>
                    </div>
                </form>
            </div>
     
        </div>
    );
};

export default EditarUsuario;

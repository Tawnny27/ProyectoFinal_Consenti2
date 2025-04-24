
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


    const obtenerUsuario = async () => {
        try {
            const response = await BuscarUsuarios(id);
            if (response.status == 200) {
                const data = response.data;

                setUsuario({
                    ...data,
                    rolId: data.rol?.idRol || "", // asegurarse de tener rolId separado
                });

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

        setUsuario((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const manejarEnvio = async (e) => {
        e.preventDefault();

        try {
            const usuarioLimpio = {
                ...usuario,
                rolId: parseInt(usuario.rolId), // en caso de que venga como string
                rol: {
                    idRol: parseInt(usuario.rolId),
                    nombreRol: obtenerNombreRol(usuario.rolId),
                    usuarios: [] // opcional, pero evitar null
                }
            };

            await EditarUsuarioAp(usuarioLimpio);
            setMensajeExito('Los cambios se guardaron correctamente.');
            setTimeout(() => {
                navigate(`/pages/user-maintenance`);
            }, 2000);
        } catch (error) {
            console.error("Error al editar el usuario:", error);
        }
    };

    const obtenerNombreRol = (id) => {
        switch (parseInt(id)) {
            case 1:
                return "Admin";
            case 2:
                return "Maestro";
            case 3:
                return "Padre";
            default:
                return "Desconocido";
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
                            <FontAwesomeIcon icon={faUser} />
                            <select
                                name="rolId"
                                value={usuario.rolId}
                                onChange={manejarCambio}
                                required>
                                <option value="">Seleccione un rol</option>
                                <option value="1">Admin</option>
                                <option value="2">Maestro</option>
                                <option value="3">Padre</option>
                            </select>
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
                        <button style={{ backgroundColor: '#A569BD' }} type="button" onClick={() => navigate('/pages/user-maintenance')}>Cancelar</button>
                    </div>
                </form>
            </div>
     
        </div>
    );
};

export default EditarUsuario;

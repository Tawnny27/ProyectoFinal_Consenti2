import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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

    // Manejo de cambios en los campos
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setUsuario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Función para enviar el formulario
    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            console.log(usuario)
  
            await axios.put('https://localhost:44369/Usuarios/EditarUsuario', usuario);
            setMensajeExito('Los cambios se guardaron correctamente.'); //mensaje de éxito
            
            setTimeout(() => {
                navigate(`/editar-usuario/${usuario.idUsuario}`); // Redirigir a la página de edición del usuario
            }, 2000); 
        } catch (error) {
            console.error("Error al editar el usuario:", error);
        }
    };

    return (
        <div>
            <h1>Editar Usuario</h1>
            {mensajeExito && <div style={{ color: 'green' }}>{mensajeExito}</div>} {/*mensaje de éxito*/}
            <form onSubmit={manejarEnvio}>
                <div>
                    <label>ID Usuario</label>
                    <input
                        type="text"
                        name="idUsuario"
                        value={usuario.idUsuario}
                        onChange={manejarCambio}
                        disabled
                    />
                </div>
                <div>
                    <label>ID Rol</label>
                    <input
                        type="text"
                        name="rolId"
                        value={usuario.rolId}
                        onChange={manejarCambio}
                        disabled
                    />
                </div>
                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="nombreUsuario"
                        value={usuario.nombreUsuario}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div>
                    <label>Apellidos</label>
                    <input
                        type="text"
                        name="apellidosUsuario"
                        value={usuario.apellidosUsuario}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div>
                    <label>Cédula</label>
                    <input
                        type="text"
                        name="cedulaUsuario"
                        value={usuario.cedulaUsuario}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div>
                    <label>Teléfono</label>
                    <input
                        type="text"
                        name="telefonoUsuario"
                        value={usuario.telefonoUsuario}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div>
                    <label>Correo</label>
                    <input
                        type="email"
                        name="correoUsuario"
                        value={usuario.correoUsuario}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditarUsuario;

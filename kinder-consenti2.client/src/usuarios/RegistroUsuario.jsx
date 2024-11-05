// src/usuarios/RegistroUsuario.jsx
import React, { useState, useEffect } from 'react';
import axios from '../axios'; // Importar configuración de axios
import { useNavigate } from 'react-router-dom';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import './registro.css';

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
            // Enviar los datos al backend
            await axios.post('https://localhost:44369/Usuarios/CrearUsuario/', usuario);
            setMensajeExito('Usuario registrado exitosamente.');

            // Espera 2 segundos y luego redirige según el rol seleccionado
            setTimeout(() => {
                if (usuario.rolId === "3") {
                    // Redirigir a una página específica para usuarios con rol "Padre"
                    navigate('/alumno-maintenance'); 
                } else {
                    // Redirigir a la página por defecto
                    navigate('/user-maintenance');
                }
            }, 2000);
        } catch (error) {
            console.error("Error al registrar usuario:", error);
        }
    };

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <div className="form-container">
                <h1>Registrar Usuario</h1>
                {mensajeExito && <div className="success-message">{mensajeExito}</div>}
                <form onSubmit={manejarEnvio}>
                    <div>
                        <label>ID Rol</label>
                        <select
                            name="rolId"
                            value={usuario.rolId}
                            onChange={manejarCambio}
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

                    <div>
                        <label>Nombre</label>
                        <input className="input-form"
                            type="text"
                            name="nombreUsuario"
                            value={usuario.nombreUsuario}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label>Apellidos</label>
                        <input className="input-form"
                            type="text"
                            name="apellidosUsuario"
                            value={usuario.apellidosUsuario}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label>Cédula</label>
                        <input className="input-form"
                            type="text"
                            name="cedulaUsuario"
                            value={usuario.cedulaUsuario}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label>Teléfono</label>
                        <input className="input-form"
                            type="text"
                            name="telefonoUsuario"
                            value={usuario.telefonoUsuario}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label>Correo</label>
                        <input className="input-form"
                            type="email"
                            name="correoUsuario"
                            value={usuario.correoUsuario}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label>Contraseña</label>
                        <input className="input-form"
                            type="password"
                            name="contrasennaUsuario"
                            value={usuario.contrasennaUsuario}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <button type="submit">Registrar Usuario</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default RegistroUsuario;

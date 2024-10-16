// src/usuarios/RegistroUsuario.jsx
import React, { useState } from 'react';
import axios from '../axios'; // Importar configuración de axios
import { useNavigate } from 'react-router-dom';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import './registro.css';

const RegistroUsuario = () => {
    const navigate = useNavigate();
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

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            // Enviar los datos al backend
            await axios.post('https://localhost:44369/Usuarios/CrearUsuario/', usuario);
            setMensajeExito('Usuario registrado exitosamente.');
            setTimeout(() => {
                navigate('/user-maintenance'); // Redirigir a una página después del registro
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
                        <input
                            type="text"
                            name="rolId"
                            value={usuario.rolId}
                            onChange={manejarCambio}
                            required
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
                    <div>
                        <label>Contraseña</label>
                        <input
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

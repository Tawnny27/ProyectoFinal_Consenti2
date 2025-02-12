﻿import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { useUserContext } from '../UserContext';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // Estado para alternar visibilidad de la contraseña
    const navigate = useNavigate();
    const { setUser } = useUserContext();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://localhost:44369/Usuarios/AccesoUsuario2', {
                correo: email,
                contrasenna: password
            });

            if (response.status === 200) {
                const usuario = response.data;
                setUser(usuario);
                setErrorMessage('');
                navigate('/main');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error.response?.data || error.message);
            setErrorMessage(error.response?.data || 'Error en el inicio de sesión. Revisa tus credenciales.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="icon-container">
                    <div className="user-icon">
                        <img src={logo} alt="Logo" className="logo" />
                    </div>
                </div>
                <h2>Bienvenido a Consenti2</h2>
                <div className="form-group">
                    <div className="input-icon">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Ingresa tu correo"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-icon">
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            type={passwordVisible ? 'text' : 'password'} // Cambia el tipo de input según el estado
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ingresa tu contraseña"
                        />
                        <FontAwesomeIcon
                            icon={passwordVisible ? faEye : faEyeSlash}
                            className="toggle-password"
                            onClick={() => setPasswordVisible(!passwordVisible)} // Alterna visibilidad
                        />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="form-options">
                        <div className="forgot-password">
                            <Link to="/reset-password">Olvidé mi contraseña</Link>
                        </div>
                    </div>
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default LoginForm;

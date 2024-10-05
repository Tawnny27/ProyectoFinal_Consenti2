import React, { useState } from 'react';
import './LoginForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; // Importar Link
import logo from '../assets/logo.jpg'; // Asegúrate de que la ruta sea correcta


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Inicializar useNavigate

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        navigate('/main'); // Redirigir al formulario de registro
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="icon-container">
                    <div className="user-icon">
                        <img src={logo} alt="Logo" className="logo" /> {}
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
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>
                    <div className="form-options">
                        <div className="forgot-password">
                            <Link to="/reset-password">Olvidé mi contraseña</Link> {/* Aquí cambias la ruta */}
                        </div>
                    </div>
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default LoginForm;

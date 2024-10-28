import React, { useState } from 'react';
import './LoginForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [correo, setCorreo] = useState(''); // Cambiado a 'correo'
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Cambiado 'email' a 'correo'
            const response = await axios.put('https://localhost:44369/Usuarios/RecuperarContrasena', { correo });
            if (response.status === 200) {
                setMessage('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
            }
        } catch (error) {
            console.error('Error al enviar el correo de restablecimiento:', error);
            setMessage('Hubo un error al enviar el correo. Por favor, intenta nuevamente.');
        }
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Restablecer Contraseña</h2>
                <div className="form-group">
                    <div className="input-icon">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <input
                            type="email"
                            id="correo" // Cambiado a 'correo'
                            value={correo} // Cambiado a 'correo'
                            onChange={(e) => setCorreo(e.target.value)} // Cambiado a 'correo'
                            required
                            placeholder="Ingresa tu correo"
                        />
                    </div>
                </div>
                <button type="submit">Enviar Correo de Restablecimiento</button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;

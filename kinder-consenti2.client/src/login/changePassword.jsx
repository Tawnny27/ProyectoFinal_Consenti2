import React, { useState } from 'react';
import './LoginForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setSuccessMessage('Las contrase�as no coinciden.');
            return;
        }

        try {
            const response = await axios.put('https://localhost:44369/Usuarios/CambiarContrasena', {
                correo: email,
                contrasenna: newPassword,
                contrasennaValidacion: confirmPassword
            });

            if (response.status === 200) {
                setSuccessMessage(response.data);
                setTimeout(() => {
                    navigate('/'); // Redirige despu�s de 5
                }, 5000); 
            }
        } catch (error) {
            setSuccessMessage(error.response?.data || "Error al cambiar la contrase�a");
        }
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Restablecer Contrase�a</h2>
                {successMessage && (
                    <div className="success-message" style={{ color: 'green' }}>
                        {successMessage}
                    </div>
                )}
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
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Nueva contrase�a"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-icon">
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirma la nueva contrase�a"
                        />
                    </div>
                </div>
                <button type="submit">Actualizar Contrase�a</button>
            </form>
        </div>
    );
};

export default ChangePassword;

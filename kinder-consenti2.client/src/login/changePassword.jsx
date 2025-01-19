import React, { useState } from 'react';
import './LoginForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);   
    const [passwordconfVisible, setPasswordconfVisible] = useState(false);   

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const togglePasswordConfVisibility = () => {
        setPasswordconfVisible(!passwordconfVisible);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setSuccessMessage('Las contraseñas no coinciden.');
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
                    navigate('/'); // Redirige después de 5
                }, 2000); 
            }
        } catch (error) {
            setSuccessMessage(error.response?.data || "Error al cambiar la contraseña");
        }
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Restablecer Contraseña</h2>
                {successMessage && (
                    <div className="success-message" style={{ color: 'green' }}>
                        {successMessage}
                    </div>
                )}
                <div className="form-group">
                    <div className="input-icon">
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </div>                        
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
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faLock} />
                        </div>
                        <input                            
                            type={passwordVisible ? 'text' : 'password'}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Nueva contraseña"
                        />
                        <div className="icon-container" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon  icon={passwordVisible ? faEyeSlash : faEye} />
                        </div>
                    </div>
                   
                </div>

                <div className="form-group">
                    <div className="input-icon">
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faLock} />
                        </div>
                        
                        <input
                            type={passwordconfVisible ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirma la nueva contraseña"
                        />
                        <div className="icon-container" onClick={togglePasswordConfVisibility}>
                            <FontAwesomeIcon icon={passwordconfVisible ? faEyeSlash : faEye} />
                        </div>
                    </div>
                </div>
                <button type="submit">Actualizar Contraseña</button>
            </form>
        </div>
    );
};

export default ChangePassword;

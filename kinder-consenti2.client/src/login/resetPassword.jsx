import { useState } from 'react';
import './LoginForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { RecuperarContrasena } from '../apiClient';

const ResetPassword = () => {
    const [correo, setCorreo] = useState(''); 
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await RecuperarContrasena(correo);
            if (response.status === 200) {
                setMessage('Correo de restablecimiento enviado. Revisa tu bandeja de entrada. Y la proxima vez que ingrese podrá cambiar su contraseña');
                setTimeout(() => {
                    navigate('/'); // Redirige después de 10 segundos
                }, 5000);
            } else {
                setMessage(response);
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
                            id="correo" 
                            value={correo} 
                            onChange={(e) => setCorreo(e.target.value)} 
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

import React, { useState } from 'react';
import './comunicacionesMensajes.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

function ComunicacionMensajes() {
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('privado'); // 'privado' o 'grupo'
    const [mensajeEnviado, setMensajeEnviado] = useState(false);
    const [error, setError] = useState('');

    const enviarMensaje = () => {
        if (!mensaje.trim()) {
            setError('El mensaje no puede ir vacío');
            return;
        }
        setMensajeEnviado(true);
        setError('');
        setTimeout(() => {
            setMensajeEnviado(false);
        }, 2000);
    };

    const cancelarEnvio = () => {
        setMensaje('');
        setTipoMensaje('privado');
        setError('');
    };

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <div className="comunicacion_container mt-5">
                <h2 className="comunicacion_titulo">Sistema de Mensajería</h2>
                <div className="comunicacion_formulario">
                    <label className="comunicacion_label">
                        Tipo de mensaje:
                        <select
                            value={tipoMensaje}
                            onChange={(e) => setTipoMensaje(e.target.value)}
                            className="comunicacion_select"
                        >
                            <option value="privado">Mensaje Privado</option>
                            <option value="grupo">Mensaje de Grupo</option>
                        </select>
                    </label>
                    <textarea
                        placeholder="Escribe tu mensaje aquí..."
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        className="comunicacion_input"
                    />
                    {error && <p className="comunicacion_error">{error}</p>}
                    <div className="comunicacion_botones">
                        <button onClick={enviarMensaje} className="comunicacion_boton enviar">
                            Enviar
                        </button>
                        <button onClick={cancelarEnvio} className="comunicacion_boton cancelar">
                            Cancelar
                        </button>
                    </div>
                </div>
                {mensajeEnviado && (
                    <div className="comunicacion_modal">
                        <p>Mensaje enviado con éxito</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
        
    );
}

export default ComunicacionMensajes;

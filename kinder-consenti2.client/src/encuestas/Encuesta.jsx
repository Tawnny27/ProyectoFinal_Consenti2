import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './encuestas.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { CrearEvaluacionKinder } from '../apiClient';

const Encuesta = () => {
    const [formData, setFormData] = useState({
        instalaciones: '',
        personal: '',
        ensenanza: '',
        sugerencias: ''
    });

    const [message, setMessage] = useState('');
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const navigate = useNavigate(); // Inicializar el hook useNavigate

    // Verificar si la encuesta ya ha sido enviada en el último año
    useEffect(() => {
        const lastSurveyDate = localStorage.getItem('lastSurveyDate');
        if (lastSurveyDate) {
            const currentDate = new Date();
            const lastSurvey = new Date(lastSurveyDate);
            const timeDifference = currentDate - lastSurvey;
            const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000; // 1 año en milisegundos

            if (timeDifference < oneYearInMilliseconds) {
                setMessage('Ya has enviado la encuesta este año. Podrás enviar una nueva después de un año.');
                setIsFormDisabled(true);
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const PuntosIntalacion = parseInt(formData.instalaciones, 10);
        const PuntosPersonlAdm = parseInt(formData.personal, 10);
        const PuntosEnsenaza = parseInt(formData.ensenanza, 10);

        if (isNaN(PuntosIntalacion) || isNaN(PuntosPersonlAdm) || isNaN(PuntosEnsenaza)) {
            toast.error('Por favor selecciona una opción válida para cada pregunta.');
            return;
        }

        const dataToSend = {
            fecha: new Date().toISOString().split('T')[0],
            PuntosIntalacion,
            PuntosPersonlAdm,
            PuntosEnsenaza,
            sugerencias: formData.sugerencias
        };

        try {
            const response = await CrearEvaluacionKinder(dataToSend);
            if (response.status === 200) {
                setMessage('Ya has enviado la encuesta este año. Podrás enviar una nueva después de un año.');
                setIsFormDisabled(true);

                // Guardar la fecha del envío en localStorage
                localStorage.setItem('lastSurveyDate', new Date().toISOString());

                // Redirigir a /main después de un breve retraso
                setTimeout(() => {
                    navigate('/main');
                }, 2000); // Esperar 2 segundos antes de redirigir
            } else {
                toast.error('Hubo un error al enviar la encuesta. Intenta nuevamente. ', response );
            }
        } catch (error) {
            console.error('Error al enviar la encuesta:', error);
        }
    };

    return (
        <div className="teachers-feedback-container">
            <Navbar />
            <form onSubmit={handleSubmit} className="survey-form" style={{ display: isFormDisabled ? 'none' : 'block' }}>
                <h2>Encuesta del Centro Educativo</h2>
                <label>
                    ¿Cómo calificaría la calidad de las instalaciones?
                    <select name="instalaciones" value={formData.instalaciones} onChange={handleChange} required>
                        <option value=""></option>
                        <option value="10">Excelente</option>
                        <option value="5">Regular</option>
                        <option value="1">Mala</option>
                    </select>
                </label>
                <label>
                    ¿Cómo calificaría la atención del personal administrativo?
                    <select name="personal" value={formData.personal} onChange={handleChange} required>
                        <option value=""></option>
                        <option value="10">Excelente</option>
                        <option value="5">Regular</option>
                        <option value="1">Mala</option>
                    </select>
                </label>
                <label>
                    ¿Cómo calificaría la calidad de enseñanza?
                    <select name="ensenanza" value={formData.ensenanza} onChange={handleChange} required>
                        <option value=""></option>
                        <option value="10">Excelente</option>
                        <option value="5">Regular</option>
                        <option value="1">Mala</option>
                    </select>
                </label>
                <label>
                    Sugerencias:
                    <textarea name="sugerencias" value={formData.sugerencias} onChange={handleChange} required rows="4" placeholder="Escribe aquí tus comentarios"></textarea>
                </label>
                <button type="submit" className="submit-button" disabled={isFormDisabled}>Enviar Encuesta</button>
            </form>

            {message && (
                <div className="info-message">
                    <h3>Encuesta Enviada</h3>
                    <p>{message}</p>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Encuesta;

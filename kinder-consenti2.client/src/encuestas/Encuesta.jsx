import React, { useState } from 'react';
import axios from 'axios';
import './encuestas.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

const Encuesta = () => {
    // Estado para los datos del formulario
    const [formData, setFormData] = useState({
        instalaciones: '',
        personal: '',
        ensenanza: '',
        sugerencias: ''
    });

    // Estado para almacenar el mensaje de éxito o error
    const [message, setMessage] = useState('');

    // Función para manejar los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Convertir los valores a enteros explícitamente
        const PuntosInstalacion = parseInt(formData.instalaciones, 10) || 0;
        const PuntosPersonalAdm = parseInt(formData.personal, 10) || 0;
        const PuntosEnsenanza = parseInt(formData.ensenanza, 10) || 0;

        const dataToSend = {
            fecha: new Date().toISOString().split('T')[0], // Fecha actual
            PuntosInstalacion: PuntosInstalacion,
            PuntosPersonalAdm: PuntosPersonalAdm,
            PuntosEnsenanza: PuntosEnsenanza,
            sugerencias: formData.sugerencias
        };

        console.log("Datos a enviar: ", dataToSend); // Verificación de los datos a enviar

        try {
            // Enviar datos al servidor usando axios
            const response = await axios.post('https://localhost:44369/EvaluacionKinders/CrearEvaluacionKinder', dataToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setMessage('Encuesta enviada. ¡Gracias por tu participación!');
            } else {
                setMessage('Hubo un error al enviar la encuesta. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al enviar la encuesta:', error); // Para obtener más detalles sobre el error
            setMessage('Hubo un error al enviar la encuesta. Intenta nuevamente.');
        }
    };

    return (
        <div className="teachers-feedback-container">
            <Navbar />
            <form onSubmit={handleSubmit} className="survey-form">
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
                <button type="submit" className="submit-button">Enviar Encuesta</button>
                {message && <p>{message}</p>}
            </form>
            <Footer />
        </div>
    );
};

export default Encuesta;

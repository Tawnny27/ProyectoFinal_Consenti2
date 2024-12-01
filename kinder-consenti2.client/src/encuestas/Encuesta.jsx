import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './encuestas.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';


const Encuesta = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('Encuesta enviada. ¡Gracias por tu participación!');
    };

    return (
        <div className="teachers-feedback-container">
            <Navbar />
        <form onSubmit={handleSubmit} className="survey-form">
            <h2>Encuesta del Centro Educativo</h2>
            <label>
                ¿Cómo calificaría la calidad de las instalaciones?
                    <select name="instalaciones" required>
                     <option value=""></option>
                    <option value="excelente">Excelente</option>
                    <option value="buena">Buena</option>
                    <option value="regular">Regular</option>
                    <option value="mala">Mala</option>
                </select>
            </label>
            <label>
                    ¿Cómo calificaría la atención del personal administrativo?
                    <select name="personal" required>
                    <option value=""></option>
                    <option value="excelente">Excelente</option>
                    <option value="buena">Buena</option>
                    <option value="regular">Regular</option>
                    <option value="mala">Mala</option>
                </select>
                </label>
                <label>
                    ¿Cómo calificaría la calidad de enseñanza?
                    <select name="enseñanza" required>
                        <option value=""></option>
                        <option value="excelente">Excelente</option>
                        <option value="buena">Buena</option>
                        <option value="regular">Regular</option>
                        <option value="mala">Mala</option>
                    </select>
                </label>
            <label>
                Sugerencias:
                    <textarea required name="sugerencias" rows="4" placeholder="Escribe aquí tus comentarios"></textarea>
            </label>
            <button type="submit" className="submit-button">Enviar Encuesta</button>
            </form>
            <Footer />
        </div>

    );
};

export default Encuesta;

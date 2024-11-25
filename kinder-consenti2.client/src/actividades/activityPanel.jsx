import React, { useState } from 'react';
import './ActivityPanel.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

function ActivityPanel() {
    const [selectedActivity, setSelectedActivity] = useState("");
    const [comments, setComments] = useState("");
    const [status, setStatus] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [bathroomVisits, setBathroomVisits] = useState(0);

    const handleActivityChange = (e) => {
        setSelectedActivity(e.target.value);
        setComments("");
        setStatus("");
        setStartTime("");
        setEndTime("");
        setBathroomVisits(0);
    };

    const handleStatusChange = (e) => setStatus(e.target.value);
    const handleCommentsChange = (e) => setComments(e.target.value);
    const handleStartTimeChange = (e) => setStartTime(e.target.value);
    const handleEndTimeChange = (e) => setEndTime(e.target.value);
    const handleBathroomVisitsChange = (e) => setBathroomVisits(e.target.value);

    const handleSubmit = () => {
        console.log({
            selectedActivity,
            status,
            comments,
            startTime,
            endTime,
            bathroomVisits,
        });
    };

    const handleCancel = () => {
       
        window.history.back();
    };

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <div className="activity-container" style={{ marginTop: '220px' }}>
                <div className="activity-panel">
                    <h1 className="activity-title">Panel de Actividades</h1>

                    {/* Selector de actividad */}
                    <div className="activity-section">
                        <label className="activity-label">Selecciona una Actividad:</label>
                        <select
                            className="activity-select"
                            value={selectedActivity}
                            onChange={handleActivityChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="Comida">Comida</option>
                            <option value="Dormir">Dormir</option>
                            <option value="Ir al Baño">Ir al Baño</option>
                            <option value="Huerta">Huerta</option>
                        </select>
                    </div>

                   
                    {selectedActivity === "Comida" && (
                        <div>
                            <label className="activity-label">Estatus de Comida:</label>
                            <select
                                className="activity-select"
                                value={status}
                                onChange={handleStatusChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="Bueno">Bueno</option>
                                <option value="Regular">Regular</option>
                                <option value="Malo">Malo</option>
                            </select>
                            <label className="activity-label">Comentarios:</label>
                            <textarea
                                className="activity-textarea"
                                value={comments}
                                onChange={handleCommentsChange}
                                placeholder="Escribe un comentario"
                            ></textarea>
                        </div>
                    )}

                    {selectedActivity === "Dormir" && (
                        <div>
                            <label className="activity-label">Hora de Inicio de Siesta:</label>
                            <input
                                type="time"
                                className="activity-input"
                                value={startTime}
                                onChange={handleStartTimeChange}
                            />
                            <label className="activity-label">Hora de Fin de Siesta:</label>
                            <input
                                type="time"
                                className="activity-input"
                                value={endTime}
                                onChange={handleEndTimeChange}
                            />
                            <label className="activity-label">Comentarios:</label>
                            <textarea
                                className="activity-textarea"
                                value={comments}
                                onChange={handleCommentsChange}
                                placeholder="Escribe un comentario"
                            ></textarea>
                        </div>
                    )}

                    {selectedActivity === "Ir al Baño" && (
                        <div>
                            <label className="activity-label">Veces que fue al Baño:</label>
                            <input
                                type="number"
                                className="activity-input"
                                value={bathroomVisits}
                                onChange={handleBathroomVisitsChange}
                                min="0"
                            />
                            <label className="activity-label">Comentarios:</label>
                            <textarea
                                className="activity-textarea"
                                value={comments}
                                onChange={handleCommentsChange}
                                placeholder="Escribe un comentario"
                            ></textarea>
                        </div>
                    )}

                    {selectedActivity === "Huerta" && (
                        <div>
                            <label className="activity-label">Participación en la Huerta:</label>
                            <select
                                className="activity-select"
                                value={status}
                                onChange={handleStatusChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="Muy participativo">Muy participativo</option>
                                <option value="Participativo">Participativo</option>
                                <option value="Poco participativo">Poco participativo</option>
                            </select>
                            <label className="activity-label">Comentarios:</label>
                            <textarea
                                className="activity-textarea"
                                value={comments}
                                onChange={handleCommentsChange}
                                placeholder="Escribe un comentario"
                            ></textarea>
                        </div>
                    )}

                    {/* Botones de guardar y cancelar */}
                    <div className="activity-buttons">
                        <button className="activity-submit-button" onClick={handleSubmit}>
                            Guardar Actividad
                        </button>
                        <button className="activity-cancel-button" onClick={handleCancel}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ActivityPanel;

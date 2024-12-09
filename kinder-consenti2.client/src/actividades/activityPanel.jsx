import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivityPanel.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ActivityPanel() {
    const [selectedActivity, setSelectedActivity] = useState("");
    const [childrenData, setChildrenData] = useState([
        { name: "Juan Pérez", status: "Bueno", comments: "Comió todo" },
        { name: "María López", status: "Regular", comments: "No quiso la sopa" },
        { name: "Carlos Sánchez", status: "Malo", comments: "No comió nada" }
    ]);

    const navigate = useNavigate();

    const handleActivitySelect = (activity) => {
        setSelectedActivity(activity);
    };

    const handleCancel = () => {
        window.history.back();
    };

    const goToActivityForm = () => {
        navigate('/activity-form');
    };

    const handleInputChange = (index, field, value) => {
        const updatedData = [...childrenData];
        updatedData[index][field] = value;
        setChildrenData(updatedData);
    };

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <div className="activity-container" style={{ marginTop: '200px' }}>
                <div className="activity-panel">
                    <h1 className="activity-title">Panel de Actividades</h1>

                    {/* Botones para seleccionar la actividad */}
                    <div className="activity-buttons">
                        <button
                            className={`activity-button fa-light fa-carrot ${selectedActivity === 'Comida' ? 'active' : ''}`} 
                            onClick={() => handleActivitySelect('Comida')} 
                        >
                            Comida  <FontAwesomeIcon icon={faCarrot} />
                        </button>
                        <button
                            className={`activity-button ${selectedActivity === 'Dormir' ? 'active' : ''}`}
                            onClick={() => handleActivitySelect('Dormir')}
                        >
                            Dormir
                        </button>
                        <button
                            className={`activity-button ${selectedActivity === 'Ir al Baño' ? 'active' : ''}`}
                            onClick={() => handleActivitySelect('Ir al Baño')}
                        >
                            Ir al Baño
                        </button>
                        <button
                            className={`activity-button ${selectedActivity === 'Huerta' ? 'active' : ''}`}
                            onClick={() => handleActivitySelect('Huerta')}
                        >
                            Huerta
                        </button>
                    </div>

                    {/* Tabla de datos para "Comida" */}
                    {selectedActivity === "Comida" && (
                        <div>
                            <h2 className="activity-subtitle">Estado de Comida</h2>
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Nombre del Niño</th>
                                        <th>Estatus de Comida</th>
                                        <th>Comentarios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {childrenData.map((child, index) => (
                                        <tr key={index}>
                                            <td>{child.name}</td>
                                            <td>
                                                <select
                                                    value={child.status}
                                                    onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                                                    className="activity-select"
                                                >
                                                    <option value="Bueno">Bueno</option>
                                                    <option value="Regular">Regular</option>
                                                    <option value="Malo">Malo</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={child.comments}
                                                    onChange={(e) => handleInputChange(index, 'comments', e.target.value)}
                                                    className="activity-input"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tabla de datos para "Dormir" */}
                    {selectedActivity === "Dormir" && (
                        <div>
                            <h2 className="activity-subtitle">Estado de Dormir</h2>
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Nombre del Niño</th>
                                        <th>Hora de Inicio</th>
                                        <th>Hora de Fin</th>
                                        <th>Comentarios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {childrenData.map((child, index) => (
                                        <tr key={index}>
                                            <td>{child.name}</td>
                                            <td>
                                                <input
                                                    type="time"
                                                    className="activity-input"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="time"
                                                    className="activity-input"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={child.comments}
                                                    onChange={(e) => handleInputChange(index, 'comments', e.target.value)}
                                                    className="activity-input"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tabla de datos para "Ir al Baño" */}
                    {selectedActivity === "Ir al Baño" && (
                        <div>
                            <h2 className="activity-subtitle">Estado de Baño</h2>
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Nombre del Niño</th>
                                        <th>Veces que fue al baño</th>
                                        <th>Comentarios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {childrenData.map((child, index) => (
                                        <tr key={index}>
                                            <td>{child.name}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="activity-input"
                                                    min="0"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={child.comments}
                                                    onChange={(e) => handleInputChange(index, 'comments', e.target.value)}
                                                    className="activity-input"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tabla de datos para "Huerta" */}
                    {selectedActivity === "Huerta" && (
                        <div>
                            <h2 className="activity-subtitle">Estado de Huerta</h2>
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Nombre del Niño</th>
                                        <th>Participación</th>
                                        <th>Comentarios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {childrenData.map((child, index) => (
                                        <tr key={index}>
                                            <td>{child.name}</td>
                                            <td>
                                                <select
                                                    className="activity-select"
                                                >
                                                    <option value="Muy participativo">Muy participativo</option>
                                                    <option value="Participativo">Participativo</option>
                                                    <option value="Poco participativo">Poco participativo</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={child.comments}
                                                    onChange={(e) => handleInputChange(index, 'comments', e.target.value)}
                                                    className="activity-input"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Botones de cancelar y nuevo formulario */}
                    <div className="activity-buttons mt-5">
                        <button className="activity-cancel-button" onClick={handleCancel}>
                            Cancelar
                        </button>
                        <button className="activity-form-button" onClick={goToActivityForm}>
                            Crear Actividad
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ActivityPanel;

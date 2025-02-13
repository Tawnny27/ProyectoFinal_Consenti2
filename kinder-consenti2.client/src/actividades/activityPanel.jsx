import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivityPanel.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserContext } from '../UserContext';
import axios from 'axios';
import Select from 'react-select';

function ActivityPanel() {
    const [selectedActivity, setSelectedActivity] = useState("");
    const [childrenData, setChildrenData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { user } = useUserContext();

    // Función para obtener grupos
    const obtenerGrupos = async () => {
        try {
            const response = await axios.get("https://localhost:44369/Grupos/ObtenerGrupos");
            setGroups(response.data.map(group => ({ value: group.idGrupo || group.id || group.idGrupos || group.id_grupo, label: group.nombreGrupo || "Sin nombre" })));
        } catch (error) {
            setErrorMessage("Error al obtener los grupos.");
        }
    };

    // Función para obtener alumnos por grupo seleccionado
    const obtenerAlumnosPorGrupoSeleccionado = async (groupId) => {
        try {
            if (!groupId) return; 

            const response = await axios.get(`https://localhost:44369/GruposAlumnos/ObtenerGrupoAlumnos/${groupId}`);           
            if (response.data) {
                const formattedData = response.data.map(child => ({
                    name: child.alumno.nombreAlumno + ' ' + child.alumno.apellidosAlumno || "Sin nombre",
                    status: "Bueno",
                    comments: ""
                }));

                setChildrenData(formattedData);
            }
        } catch (error) {
            setErrorMessage("Error al obtener los alumnos del grupo.");
        }
    };

    // Manejador de cambio en el select
    const handleSelectChange = async (optionSelected) => {
        setSelectedGroup(optionSelected.value);

        if (optionSelected.value !== null && optionSelected.value !== undefined) {
            await obtenerAlumnosPorGrupoSeleccionado(optionSelected.value);
        }

        if (!optionSelected.value) {
            // Limpiar datos cuando se deselecciona todo.
            setChildrenData([]);
        }

    };

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

    const handleApiCall = async (activity) => {
        switch (activity) {
            case 'Comida':
                try {
                    const response = await axios.put(`https://localhost:44369/ActividadComidas/CrearActividadComidas`);
                    if (response == 200) {
                        console.log('Success');
                    }

                } catch (error) {
                    console.error("Error :", error);

                }

                break;
            case 'Huerta':
                try {
                    const response = await axios.put(`https://localhost:44369/ActividadHuerta/CrearActividadHuerta`);
                    if (response == 200) {
                        console.log('Success');
                    }

                } catch (error) {
                    console.error("Error :", error);

                }
                break;
            case 'Dormir':
                try {
                    const response = await axios.put(`https://localhost:44369/ActividadDormir/CrearActividadDormir`);
                    if (response == 200) {
                        console.log('Success');
                    }

                } catch (error) {
                    console.error("Error :", error);

                }
                break;
            case 'Ir al Baño':
                try {
                    const response = await axios.put(`https://localhost:44369/ActividadBanno/CrearActividadBanno`);
                    if (response == 200) {
                        console.log('Success');
                    }

                } catch (error) {
                    console.error("Error :", error);

                }
                break;
            default:
                console.log("No hay actividad seleccionada");
        }
    };

    useEffect(() => {
        obtenerGrupos();
    }, []);

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <div className="activity-container" style={{ marginTop: '200px' }}>
                <div className="activity-panel">
                    <h1 className="activity-title">Panel de Actividades</h1>

                    {/* Selector de Grupo */}
                    <div className="group-selector">
                        <label>Selecciona un grupo: </label>
                        <Select
                            options={groups}
                            value={selectedGroup ? { value: selectedGroup, label: groups.find(g => g.value === selectedGroup)?.label } : null}
                            onChange={handleSelectChange}
                            placeholder="Selecciona un grupo"
                        />
                    </div>

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
                        
                        {/* Mostrar los botones según la actividad seleccionada */}
                        {selectedActivity === 'Comida' && (
                            <button className="activity-form-button" onClick={() => handleApiCall('Comida')}>Enviar actividad Comida</button>
                        )}
                        {selectedActivity === 'Huerta' && (
                            <button className="activity-form-button" onClick={() => handleApiCall('Huerta')}>Enviar actividad Huerta</button>
                        )}
                        {selectedActivity === 'Ir al Baño' && (
                            <button className="activity-form-button" onClick={() => handleApiCall('Ir al Baño')}>Enviar actividad Baño</button>
                        )}
                        {selectedActivity === 'Dormir' && (
                            <button className="activity-form-button" onClick={() => handleApiCall('Dormir')}>Enviar actividad Dormir</button>
                        )}
                        
                    </div>
                    <div>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ActivityPanel;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivityPanel.css';
import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserContext } from '../UserContext';

import Select from 'react-select';
import { ObtenerGrupos, ObtenerGrupoAlumnos, CrearActividadComidas, CrearActividadBanno, CrearActividadDormir, CrearActividadHuerta } from '../apiClient'; // Importar las funciones desde apiClient.js


function ActivityPanel() {
    const [selectedActivity, setSelectedActivity] = useState("");
    const [childrenData, setChildrenData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { user } = useUserContext();
    const currentDate = new Date().toISOString().slice(0, 10);

    // Función para obtener grupos
    const obtenerGrupos = async () => {
        try {
            const response = await ObtenerGrupos();
            setGroups(response.data.map(group => ({ value: group.idGrupo || group.id || group.idGrupos || group.id_grupo, label: group.nombreGrupo || "Sin nombre" })));
        } catch (error) {
            setErrorMessage("Error al obtener los grupos.");
        }
    };

    // Función para obtener alumnos por grupo seleccionado
    const obtenerAlumnosPorGrupoSeleccionado = async (groupId) => {
        try {
            if (!groupId) return;

            const response = await ObtenerGrupoAlumnos(groupId);
            if (response.data) {
                const formattedData = response.data.map(child => ({
                    alumnoId: child.alumno.idAlumno,
                    gruposId: groupId,
                    fecha: currentDate,
                    descripcion: "", // Valor por defecto
                    statusParticipacion: 1, // Valor por defecto
                    statusComida: 1,
                    tipoComida: "Normal",
                    comentario: "", // Valor por defecto
                    catidad: 0,
                    name: child.alumno.nombreAlumno + ' ' + child.alumno.apellidosAlumno || "Sin nombre"
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
                    console.log(childrenData)
                    const response = await CrearActividadComidas(childrenData);

                    if (response.status === 200) {
                        console.log('Success:', response.data);
                        alert('Actividad de Comida guardada con éxito!');
                    } else {
                        console.error('Error:', response.status, response.data);
                        alert('Hubo un error al guardar la actividad de Comida.');
                    }
                } catch (error) {
                    console.error("Error :", error);
                    alert('Error al guardar la actividad de Comida: ' + error.message);
                }
                break;
            case 'Huerta':
                try {
                    console.log(childrenData)

                    const response = await CrearActividadHuerta(childrenData);
                    
                    if (response.status === 200) {
                        console.log('Success:', response.data);
                        alert('Actividad de Huerta guardada con éxito!');
                    } else {
                        console.error('Error:', response.status, response.data);
                        alert('Hubo un error al guardar la actividad de Huerta.');
                    }
                } catch (error) {
                    console.error("Error :", error);
                    alert('Error al guardar la actividad de Huerta: ' + error.message);
                }
                break;
            case 'Dormir':
                try {
                    console.log(childrenData)
                    const response = await CrearActividadDormir(childrenData);
                    if (response.status === 200) {
                        console.log('Success:', response.data);
                        alert('Actividad de Dormir guardada con éxito!');
                    } else {
                        console.error('Error:', response.status, response.data);
                        alert('Hubo un error al guardar la actividad de Dormir.');
                    }
                } catch (error) {
                    console.error("Error :", error);
                    alert('Error al guardar la actividad de Dormir: ' + error.message);
                }
                break;
            case 'Ir al Baño':
                try {
                    console.log(childrenData)
                    const response = await CrearActividadBanno(childrenData);
                    if (response.status === 200) {
                        console.log('Success:', response.data);
                        alert('Actividad de Baño guardada con éxito!');
                    } else {
                        console.error('Error:', response.status, response.data);
                        alert('Hubo un error al guardar la actividad de Baño.');
                    }
                } catch (error) {
                    console.error("Error :", error);
                    alert('Error al guardar la actividad de Baño: ' + error.message);
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
           {/* <Navbar /> */}
            <div className="activity-container" style={{ marginTop: '200px' }}>
                <div className="activity-panel">
                    <h1 className="activity-title">Panel de Actividades</h1>
                    <div className="group-selector">
                        <label>Selecciona un grupo: </label>
                        <Select
                            options={groups}
                            value={selectedGroup ? { value: selectedGroup, label: groups.find(g => g.value === selectedGroup)?.label } : null}
                            onChange={handleSelectChange}
                            placeholder="Selecciona un grupo"
                        />
                    </div>
                    <div className="activity-buttons">
                        <button
                            className={`activity-button fa-light fa-carrot ${selectedActivity === 'Comida' ? 'active' : ''}`}
                            onClick={() => handleActivitySelect('Comida')}
                        >
                            Comida  <FontAwesomeIcon icon={faCarrot} />
                        </button>
                        <button
                            className={`activity-button ${selectedActivity === 'Huerta' ? 'active' : ''}`}
                            onClick={() => handleActivitySelect('Huerta')}
                        >
                            Huerta
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
                    </div>
                    {selectedActivity === "Comida" && (
                        <div>
                            <h2 className="activity-subtitle">Estado de Comida</h2>
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Nombre del Niño</th>
                                        <th>Tipo de Comida</th>
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
                                                    value={child.tipoComida}
                                                    onChange={(e) => handleInputChange(index, 'tipoComida', e.target.value)}
                                                    className="activity-select"
                                                >
                                                    <option value="Normal">Normal</option>
                                                    <option value="Vegetariana">Vegetariana</option>
                                                    <option value="Vegana">Vegana</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    value={child.statusComida}
                                                    onChange={(e) => handleInputChange(index, 'statusComida', parseInt(e.target.value))}
                                                    className="activity-select"
                                                >
                                                    <option value="1">Bueno</option>
                                                    <option value="2">Regular</option>
                                                    <option value="3">Malo</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={child.comentario}
                                                    onChange={(e) => handleInputChange(index, 'comentario', e.target.value)}
                                                    className="activity-input"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {selectedActivity === "Huerta" && (
                        <div>
                            <h2 className="activity-subtitle">Estado de Huerta</h2>
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Nombre del Niño</th>
                                        <th>Descripción</th>
                                        <th>Participación</th>
                                        <th>Comentarios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {childrenData.map((child, index) => (
                                        <tr key={index}>
                                            <td>{child.name}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={child.descripcion}
                                                    onChange={(e) => handleInputChange(index, 'descripcion', e.target.value)}
                                                    className="activity-input"
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    value={child.statusParticipacion}
                                                    onChange={(e) => handleInputChange(index, 'statusParticipacion', parseInt(e.target.value))}
                                                    className="activity-select"
                                                >
                                                    <option value="1">Muy participativo</option>
                                                    <option value="2">Participativo</option>
                                                    <option value="3">Poco participativo</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={child.comentario}
                                                    onChange={(e) => handleInputChange(index, 'comentario', e.target.value)}
                                                    className="activity-input"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
                                                    value={child.comentario}
                                                    onChange={(e) => handleInputChange(index, 'comentario', e.target.value)}
                                                    className="activity-input"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
                                                    value={child.catidad}
                                                    onChange={(e) => handleInputChange(index, 'catidad', e.target.value)}
                                                    min="0"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={child.comentario}
                                                    onChange={(e) => handleInputChange(index, 'comentario', e.target.value)}
                                                    className="activity-input"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
           {/* <Footer /> */}
        </div>
    );
}

export default ActivityPanel;

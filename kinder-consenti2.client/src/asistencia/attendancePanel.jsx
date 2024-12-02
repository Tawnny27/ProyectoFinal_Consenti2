import React, { useState } from "react";
import "./AttendancePanel.css";
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
function AttendancePanel({ navigateToActivities }) {
    const defaultChildrenList = ["Juan", "María", "Carlos", "Ana"];
    const [attendance, setAttendance] = useState(
        defaultChildrenList.map((name) => ({ name, status: "", justification: "" }))
    );

    const handleStatusChange = (index, status) => {
        const updatedAttendance = [...attendance];
        updatedAttendance[index].status = status;

        if (status !== "Ausente Justificado") {
            updatedAttendance[index].justification = "";
        }
        setAttendance(updatedAttendance);
    };

    const handleJustificationChange = (index, justification) => {
        const updatedAttendance = [...attendance];
        updatedAttendance[index].justification = justification;
        setAttendance(updatedAttendance);
    };

    const handleSubmit = () => {
        const unmarkedChildren = attendance.filter((child) => !child.status);
        if (unmarkedChildren.length > 0) {
            alert(
                `Los siguientes niños no tienen un estado asignado: ${unmarkedChildren
                    .map((child) => child.name)
                    .join(", ")}`
            );
            return;
        }

        console.log("Asistencia guardada:", attendance);
        alert("¡Asistencia guardada exitosamente!");
        navigateToActivities();
    };

    const handleCancel = () => {

        window.history.back();
    };

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <div className="attendance-container">
                <h1 className="attendance-title">Lista de Asistencia</h1>
                <div className="attendance-list">
                    {attendance.map((child, index) => (
                        <div key={index} className="attendance-item">
                            <span className="attendance-child-name">{child.name}</span>
                            <select
                                className="attendance-select"
                                value={child.status}
                                onChange={(e) => handleStatusChange(index, e.target.value)}
                            >
                                <option value="">Seleccionar</option>
                                <option value="Presente">Presente</option>
                                <option value="Ausente">Ausente</option>
                                <option value="Ausente Justificado">Ausente Justificado</option>
                            </select>
                            {child.status === "Ausente Justificado" && (
                                <textarea
                                    className="attendance-justification-input"
                                    placeholder="Ingrese justificación"
                                    value={child.justification}
                                    onChange={(e) => handleJustificationChange(index, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="attendance-buttons">
                    <button className="attendance-save-button" onClick={handleSubmit}>
                        Guardar Asistencia
                    </button>
                    <button
                        className="attendance-cancel-button"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
        
    );
}

export default AttendancePanel;

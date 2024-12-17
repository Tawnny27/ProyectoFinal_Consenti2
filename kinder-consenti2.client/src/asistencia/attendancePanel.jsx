import React, { useState, useEffect } from "react";
import "./AttendancePanel.css";
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { useUserContext } from '../UserContext'; // Importar el hook del contexto

function AttendancePanel() {
    const { user, setUser } = useUserContext(); // Obtener el usuario del contexto
    const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
    
    useEffect(() => {
        if (user?.rolId !== 2) {
            setErrorMessage("No tienes permisos para acceder a esta página.");
        } else {
            setErrorMessage(""); 
        }
    }, [user]);

    const defaultChildrenList = ["Juan", "María", "Carlos", "Ana"];
    const [attendance, setAttendance] = useState(
        defaultChildrenList.map((name) => ({ name, status: false })) // status es un booleano
    );

    const handleStatusChange = (index, status) => {
        const updatedAttendance = [...attendance];
        updatedAttendance[index].status = status;
        setAttendance(updatedAttendance);
    };

    const handleSubmit = () => {
        const unmarkedChildren = attendance.filter((child) => child.status === null);
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

    // Solo renderizar el contenido si el rol es 2, de lo contrario solo mostrar el mensaje de error
    if (user?.rolId !== 2) {
        console.log(user)
        return (
            <div className="user-maintenance-container">
                <Navbar />
                <div className="attendance-container">
                    <div className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>
                        {errorMessage}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <div className="attendance-container">
                <h1 className="attendance-title">Lista de Asistencia</h1>
                <div className="user-info">
                    {user ? (
                        <span>
                            Hola, {user.nombreUsuario} {user.apellidosUsuario}, {'Rol '}({user.rolId})
                        </span>
                    ) : (
                        <span>Cargando...</span>
                    )}
                </div>

                {/* Tabla de asistencia */}
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Nombre del Niño</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((child, index) => (
                            <tr key={index}>
                                <td>{child.name}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={child.status}
                                        onChange={(e) => handleStatusChange(index, e.target.checked)}
                                    />
                                    {child.status ? "Presente" : "Ausente"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

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
            <Footer />
        </div>
    );
}

export default AttendancePanel;

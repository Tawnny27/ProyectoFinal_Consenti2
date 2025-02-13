import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AttendancePanel.css";
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { useUserContext } from '../UserContext';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';

function AttendancePanel() {
    const { user } = useUserContext();
    const [errorMessage, setErrorMessage] = useState("");
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [attendance, setAttendance] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const currentDate = new Date().toLocaleDateString();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get("https://localhost:44369/Grupos/ObtenerGrupos");
                setGroups(response.data);
            } catch (error) {
                setErrorMessage("Error al obtener los grupos.");
            }
        };
        fetchGroups();
    }, []);

    useEffect(() => {
        if (!selectedGroup) return;

        const fetchStudents = async () => {
            try {
                const idGrupos = Number(selectedGroup);
                const response = await axios.get(`https://localhost:44369/GruposAlumnos/ObtenerGrupoAlumnos/${idGrupos}`);
                const alumnos = response.data.map(item => ({
                    id: item.alumno.idAlumno,
                    name: `${item.alumno.nombreAlumno} ${item.alumno.apellidosAlumno}`,
                    status: false,
                    comment: ""
                }));
                setAttendance(alumnos);
            } catch (error) {
                setErrorMessage("Error al obtener los alumnos del grupo.");
            }
        };

        fetchStudents();
    }, [selectedGroup]);

    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value);
    };

    const handleStatusChange = (id, status) => {
        const updatedAttendance = attendance.map((student) =>
            student.id === id ? { ...student, status } : student
        );
        setAttendance(updatedAttendance);
    };

    const handleCommentChange = (id, comment) => {
        const updatedAttendance = attendance.map((student) =>
            student.id === id ? { ...student, comment } : student
        );
        setAttendance(updatedAttendance);
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        const updatedAttendance = attendance.map((child) => ({
            ...child,
            status: newSelectAll
        }));
        setAttendance(updatedAttendance);
    };

    const handleSubmit = async () => {
        try {
            const fechaISO = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

            const payload = attendance.map((child) => ({
                alumnoId: child.id,
                gruposId: Number(selectedGroup),
                fecha: fechaISO,
                comentario: child.comment || "",
                statusAsistencia: child.status ? 1 : 0
            }));

            console.log("Datos enviados:", JSON.stringify(payload, null, 2)); // Muestra los datos en consola

            const response = await axios.post("https://localhost:44369/ListaAsistencias/CrearListaAsistencia", payload);
            
            toast.success("¡Asistencia guardada exitosamente!");
        } catch (error) {
            console.error("Error al guardar la asistencia:", error);

            toast.error("Hubo un error al guardar la asistencia.");
        }
    };




    const handleCancel = () => {
        window.history.back();
    };

    const handleExportToExcel = () => {
        const fechaISO = currentDate; 
        const fileName = `Lista_de_Asistencia_${fechaISO}.xlsx`; 

        const ws = XLSX.utils.json_to_sheet(attendance.map((item) => ({
            Nombre: item.name,
            Estado: item.status ? "Presente" : "Ausente",
            Comentario: item.comment,
            Fecha: fechaISO
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
        XLSX.writeFile(wb, fileName);
    };

    const columns = [
        {
            name: 'Nombre del Niño',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Estado',
            cell: row => (
                <div>
                    <input
                        type="checkbox"
                        checked={row.status}
                        onChange={(e) => handleStatusChange(row.id, e.target.checked)}
                    />
                    {row.status ? " Presente" : " Ausente"}
                </div>
            ),
            sortable: false
        },
        {
            name: 'Comentario',
            cell: row => (
                <input
                    type="text"
                    value={row.comment || ''}
                    onChange={(e) => handleCommentChange(row.id, e.target.value)}
                    placeholder="Escribe un comentario"
                />
            ),
            sortable: false
        }
       
    ];

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <div className="attendance-container">
                <h1 className="attendance-title">Lista de Asistencia</h1>
                {/*<div className="user-info">*/}
                {/*    {user ? (*/}
                {/*        <span>*/}
                {/*            Hola, {user.nombreUsuario} {user.apellidosUsuario}*/}
                {/*        </span>*/}
                {/*    ) : (*/}
                {/*        <span>Cargando...</span>*/}
                {/*    )}*/}
                {/*</div>*/}
                <div className="attendance-date">
                    <label>Fecha de Asistencia: </label>
                    <span>{currentDate}</span>
                </div>

                <div className="group-selector">
                    <label>Selecciona un grupo: </label>
                    <select value={selectedGroup} onChange={handleGroupChange}>
                        <option value="">-- Selecciona un grupo --</option>
                        {groups.map((group) => (
                            <option key={group.idGrupos} value={group.idGrupos}>
                                {group.nombreGrupo}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedGroup && (
                    <div className="attendance-actions">
                        <button onClick={handleSelectAll}>
                            {selectAll ? "Deseleccionar todos" : "Seleccionar todos"}
                        </button>
                        <div style={{ flex: 1 }}></div> {/* Espaciador */}
                        <button className="attendance-export-button" onClick={handleExportToExcel}>
                            Exportar a Excel
                        </button>
                    </div>
                )}


                <DataTable
                    columns={columns}
                    data={attendance}
                    pagination
                    highlightOnHover
                    responsive
                    customStyles={{
                        headCells: {
                            style: {
                                backgroundColor: '#A569BD',
                                color: '#fff',
                            }
                        }
                    }}
                />
                <div className="attendance-buttons">
                    <button className="attendance-save-button" onClick={handleSubmit}>
                        Guardar Asistencia
                    </button>
                    <button className="attendance-cancel-button" onClick={handleCancel}>
                        Cancelar
                    </button>
                    
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AttendancePanel;

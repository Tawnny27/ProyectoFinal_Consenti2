import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AttendancePanel.css";
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { useUserContext } from '../UserContext';
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
            const payload = {
                IdListaAsistencia: 1,
                Detalles: attendance.map((child) => ({
                    AlumnoId: child.id,
                    Estado: child.status ? "Presente" : "Ausente",
                    Comentario: child.comment
                })),
            };

            const response = await axios.put("https://localhost:44369/ListaAsistencias/ActualizarAsistencia", payload);
            alert("¡Asistencia guardada exitosamente!");
        } catch (error) {
            alert("Hubo un error al guardar la asistencia.");
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    const handleExportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(attendance.map((item) => ({
            Nombre: item.name,
            Estado: item.status ? "Presente" : "Ausente",
            Comentario: item.comment
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
        XLSX.writeFile(wb, "Lista_de_Asistencia.xlsx");
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
                    {row.status ? "Presente" : "Ausente"}
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
                <div className="user-info">
                    {user ? (
                        <span>
                            Hola, {user.nombreUsuario} {user.apellidosUsuario}
                        </span>
                    ) : (
                        <span>Cargando...</span>
                    )}
                </div>
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

                <div className="select-all">
                    <button onClick={handleSelectAll}>
                        {selectAll ? "Deseleccionar todos" : "Seleccionar todos"}
                    </button>
                </div>

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
                    <button className="attendance-export-button" onClick={handleExportToExcel}>
                        Exportar a Excel
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AttendancePanel;

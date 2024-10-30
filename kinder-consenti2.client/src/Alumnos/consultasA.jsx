import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import 'primeicons/primeicons.css';
import { faFileExcel, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos
import './AlumnoMaintenance.css'; // Importing main styles
import './CustomModal.css'; // Importing custom modal styles


function AlumnoMaintenance() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [alumnos, setAlumnos] = useState([]);
    const [padres, setPadres] = useState([]);
    const [formData, setFormData] = useState({
        nombreAlumno: '',
        apellidosAlumno: '',
        fechaNacimiento: '',
        cedulaAlumno: '',
        generoAlumno: '',
        direccionAlumno: '',
        informacionAdicional: '',
        fotoAlumno: '',
        padreId: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:44369/Alumnos/ObtenerAlumnos')
            .then(response => setAlumnos(response.data))
            .catch(error => console.error('Error fetching alumnos:', error));

        axios.get('https://localhost:44369/Usuarios/ObtenerUsuarios')
            .then(response => {
                const padresFiltrados = response.data.filter(user => user.rolId === 3);
                setPadres(padresFiltrados);
            })
            .catch(error => console.error('Error fetching padres:', error));
    }, []);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            idAlumno: 0,
            padreId: parseInt(formData.padreId),
            nombreAlumno: formData.nombreAlumno,
            apellidosAlumno: formData.apellidosAlumno,
            fechaNacimiento: new Date(formData.fechaNacimiento).toISOString(),
            cedulaAlumno: formData.cedulaAlumno,
            generoAlumno: formData.generoAlumno,
            direccionAlumno: formData.direccionAlumno,
            informacionAdicional: formData.informacionAdicional,
            fotoAlumno: formData.fotoAlumno,
            // Removemos el objeto usuario ya que parece que el backend lo maneja internamente
            nombreCompAutorizado: formData.nombreCompAutorizado,
            cedulaAutorizado: formData.cedulaAutorizado,
            telefonoAutorizado: parseInt(formData.telefonoAutorizado) || 0,
            relacionAutorizado: formData.relacionAutorizado,
            nombreCompContacto: formData.nombreCompContacto,
            cedulaContacto: formData.cedulaContacto,
            telefonoContacto: parseInt(formData.telefonoContacto) || 0,
            relacionContacto: formData.relacionContacto
        };

        try {
            console.log('Sending payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post('https://localhost:44369/Alumnos/CrearAlumno', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.data) {
                console.log('Alumno creado exitosamente:', response.data);
                setAlumnos([...alumnos, response.data]);
                closeModal();
            }
        } catch (error) {
            console.error("Error saving alumno:", error);
            if (error.response) {
                console.error("Error details:", {
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers
                });

                // Si hay errores de validación específicos, mostrarlos
                if (error.response.data && error.response.data.errors) {
                    console.error("Validation errors:", error.response.data.errors);
                }
            }
        }
    };

    const handleDelete = (alumnoId) => {
        confirmDialog({
            message: '¿Estás seguro de que deseas eliminar este alumno?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                axios.delete(`https://localhost:44369/Alumnos/EliminarAlumno/${alumnoId}`)
                    .then(() => {
                        setAlumnos(alumnos.filter(alumno => alumno.idAlumno !== alumnoId));
                    })
                    .catch(error => console.error('Error deleting alumno:', error));
            },
            reject: () => { },
        });
    };

    const columns = [
        {
            name: 'Nombre',
            selector: row => row.nombreAlumno,
            sortable: true
        },
        {
            name: 'Apellidos',
            selector: row => row.apellidosAlumno,
            sortable: true
        },
        {
            name: 'Fecha de Nacimiento',
            selector: row => row.fechaNacimiento,
            sortable: true,
            cell: row => new Date(row.fechaNacimiento).toLocaleDateString()
        },
        {
            name: 'Cédula',
            selector: row => row.cedulaAlumno,
            sortable: true
        },
        {
            name: 'Género',
            selector: row => row.generoAlumno,
            sortable: true
        },
        {
            name: 'Dirección',
            selector: row => row.direccionAlumno,
            sortable: true
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {/* Logic for editing */ }}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.idAlumno)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ),
        },
    ];

    console.log(alumnos);
    return (
        <div className="maintenance-container">
            <Navbar />
            <div className="content-wrapper">
                <h2>Registro de Alumnos</h2>

                <div className="controls-section">
                    <div className="filters">
                        <div className="filter-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                placeholder="Buscar por nombre"
                                className="filter-input"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Cédula</label>
                            <input
                                type="text"
                                placeholder="Buscar por cédula"
                                className="filter-input"
                            />
                        </div>
                        <div className="filter-group">
                            <button className="export-button">
                                <FontAwesomeIcon icon={faFileExcel} /> Exportar
                            </button>
                            <button className="add-button" onClick={openModal}>
                                <FontAwesomeIcon icon={faPlus} /> Agregar Alumno
                            </button>
                        </div>
                    </div>
                </div>

                <div className="data-table-wrapper">
                    <DataTable
                        columns={columns}
                        data={alumnos}
                        pagination
                        paginationComponentOptions={{
                            rowsPerPageText: 'Filas por página:',
                            rangeSeparatorText: 'de',
                            noRowsPerPage: false,
                            selectAllRowsItem: true,
                            selectAllRowsItemText: 'Todos'
                        }}
                        highlightOnHover
                        fixedHeader
                        responsive
                    />
                </div>

                {modalIsOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Agregar Nuevo Alumno</h2>
                                <button className="modal-close" onClick={closeModal}>
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="student-form">
                                <div className="form-section">
                                    <h3>Información Personal</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nombre</label>
                                            <input
                                                type="text"
                                                name="nombreAlumno"
                                                value={formData.nombreAlumno}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellidos</label>
                                            <input
                                                type="text"
                                                name="apellidosAlumno"
                                                value={formData.apellidosAlumno}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Fecha de Nacimiento</label>
                                            <input
                                                type="date"
                                                name="fechaNacimiento"
                                                value={formData.fechaNacimiento}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Cédula</label>
                                            <input
                                                type="text"
                                                name="cedulaAlumno"
                                                value={formData.cedulaAlumno}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Género</label>
                                            <input
                                                type="text"
                                                name="generoAlumno"
                                                value={formData.generoAlumno}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Dirección</label>
                                            <input
                                                type="text"
                                                name="direccionAlumno"
                                                value={formData.direccionAlumno}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>Información de Contacto y Autorización</h3>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nombre del Autorizado</label>
                                            <input
                                                type="text"
                                                name="nombreCompAutorizado"
                                                value={formData.nombreCompAutorizado}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Cédula del Autorizado</label>
                                            <input
                                                type="text"
                                                name="cedulaAutorizado"
                                                value={formData.cedulaAutorizado}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Teléfono del Autorizado</label>
                                            <input
                                                type="text"
                                                name="telefonoAutorizado"
                                                value={formData.telefonoAutorizado}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Relación con el Alumno</label>
                                            <input
                                                type="text"
                                                name="relacionAutorizado"
                                                value={formData.relacionAutorizado}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>Padre de Familia</h3>
                                    <div className="form-group">
                                        <label>Seleccionar Padre</label>
                                        <select
                                            name="padreId"
                                            value={formData.padreId}
                                            onChange={handleInputChange}
                                            required
                                            className="select-input"
                                        >
                                            <option value="">Selecciona un padre</option>
                                            {padres.map((padre) => (
                                                <option key={padre.idUsuario} value={padre.idUsuario}>
                                                    {padre.nombreUsuario} {padre.apellidosUsuario}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="save-button">
                                        Guardar
                                    </button>
                                    <button type="button" onClick={closeModal} className="cancel-button">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
            <ConfirmDialog />
        </div>
    );
}

export default AlumnoMaintenance;

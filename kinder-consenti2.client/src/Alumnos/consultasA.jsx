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
/*import { faFileExcel, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos*/
import './AlumnoMaintenance.css'; // Importing main styles



function AlumnoMaintenance() {
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [showContactInfo2, setShowContactInfo2] = useState(false);
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
            padreId: parseInt(formData.padreId) || 0,
            nombreAlumno: formData.nombreAlumno || 'Sin nombre', // Valor por defecto para campos de texto
            apellidosAlumno: formData.apellidosAlumno || 'Sin apellidos',
            fechaNacimiento: formData.fechaNacimiento ?
                new Date(formData.fechaNacimiento).toISOString() :
                new Date().toISOString(), // Fecha actual como valor por defecto
            cedulaAlumno: formData.cedulaAlumno || 'Sin c�dula',
            generoAlumno: formData.generoAlumno || 'NA',
            direccionAlumno: formData.direccionAlumno || 'Sin direcci�n',
            informacionAdicional: formData.informacionAdicional || 'Sin informaci�n',
            fotoAlumno: formData.fotoAlumno || 'default.jpg', // Nombre de una imagen por defecto
            nombreCompAutorizado: formData.nombreCompAutorizado || 'Sin autorizado',
            cedulaAutorizado: formData.cedulaAutorizado || 'Sin c�dula',
            telefonoAutorizado: parseInt(formData.telefonoAutorizado) || 0,
            relacionAutorizado: formData.relacionAutorizado || 'No especificada',
            nombreCompContacto: formData.nombreCompContacto || 'Sin contacto',
            cedulaContacto: formData.cedulaContacto || 'Sin c�dula',
            telefonoContacto: parseInt(formData.telefonoContacto) || 0,
            relacionContacto: formData.relacionContacto || 'No especificada'
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

                // Si hay errores de validaci�n espec�ficos, mostrarlos
                if (error.response.data && error.response.data.errors) {
                    console.error("Validation errors:", error.response.data.errors);
                }
            }
        }
    };

    const handleDelete = (alumnoId) => {
        confirmDialog({
            message: '�Est�s seguro de que deseas eliminar este alumno?',
            header: 'Confirmar Eliminaci�n',
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
            name: 'Foto',
            selector: row => row.fotoAlumno,
            cell: row => (
                <img
                    src={row.fotoAlumno}
                    alt="Foto del Alumno"
                    className="alumno-registry-foto-alumno"
                />
            ),
        },
        {
            name: 'Nombre',
            selector: row => row.nombreAlumno,
            sortable: true
        },
        {
            name: 'Cedula',
            selector: row => row.cedulaAlumno,
            sortable: true
        },
        {
            name: 'Genero',
            selector: row => row.generoAlumno,
            sortable: true
        },
        {
            name: 'Direccion',
            selector: row => row.direccionAlumno,
            sortable: true
        },
        {
            name: 'Informaci�n Adicional',
            selector: row => row.informacionAdicional,
            sortable: true
        },
        {
            name: 'Nombre Autorizado',
            selector: row => row.nombreCompAutorizado,
            sortable: true
        },
        {
            name: 'Tel Contacto',
            selector: row => row.telefonoContacto,
            sortable: true
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="action-buttons">
                    <button className="alumno-registry-edit-button" onClick={() => handleEdit(row)}>
                        Editar
                    </button>
                    <button className="alumno-registry-delete-button" onClick={() => handleDelete(row.idAlumno)}>
                        Eliminar
                    </button>
                </div>
            ),
        },
    ];


    const handleEdit = (alumno) => {
        navigate(`/editar-alumno/${alumno.idAlumno}`); // Corregido para usar comillas inversas
    };

    const toggleContactInfo = () => {
        setShowContactInfo(!showContactInfo);
    };

    const toggleContactInfo2 = () => {
        setShowContactInfo2(!showContactInfo2);
    };

    const handleOverlayClick = () => {
        closeModal();
    };

 
    return (
        <div className="alumno-registry-container">
           {/* <Navbar />*/}
            <div className="content-wrapper">
              

                {/* Contenido principal */}
                <div className="alumno-registry-content">
                    <h1 className="alumno-registry-title">Registro de Ni�os</h1>

                    {/* Botones principales */}
                    <div className="alumno-registry-main-buttons">
                        <button className="alumno-registry-add-child-btn" onClick={openModal}>
                            Agregar Ni�o
                        </button>
                        <button className="alumno-registry-cancel-btn">
                            Cancelar
                        </button>
                    </div>

                    {/* Tabla de datos */}
                    <div className="alumno-registry-data-table-wrapper">
                                <DataTable
                                    columns={columns}
                                    data={alumnos}
                                    pagination
                                    paginationComponentOptions={{
                                        rowsPerPageText: 'Filas por p�gina:',
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
                </div>

                {modalIsOpen && (
                    <div className="alumno-registry-modal-overlay" onClick={handleOverlayClick}>
                        <div className="alumno-registry-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Agregar Nuevo Alumno</h2>
                               {/* <button className="modal-close" onClick={closeModal}>&times;</button>*/}
                            </div>

                            <form onSubmit={handleSubmit} className="student-form">
                                <div className="form-section">
                                    <h3>Informaci�n Personal</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nombre</label>
                                            <input type="text" name="nombreAlumno" value={formData.nombreAlumno} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellidos</label>
                                            <input type="text" name="apellidosAlumno" value={formData.apellidosAlumno} onChange={handleInputChange} required />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Fecha de Nacimiento</label>
                                            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>C�dula</label>
                                            <input type="text" name="cedulaAlumno" value={formData.cedulaAlumno} onChange={handleInputChange} required />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>G�nero</label>
                                            <select className="inputPadre" name="generoAlumno" value={formData.generoAlumno} onChange={handleInputChange} required>
                                                <option value="masc">Masculino</option>
                                                <option value="feme">Femenino</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Direcci�n</label>
                                            <input type="text" name="direccionAlumno" value={formData.direccionAlumno} onChange={handleInputChange} required />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Informaci�n Adicional</label>
                                            <textarea name="informacionAdicional" value={formData.informacionAdicional} onChange={handleInputChange}></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Foto del Alumno (de momento con URL)</label>
                                            <input type="text" name="fotoAlumno" value={formData.fotoAlumno} onChange={handleInputChange}/>
                                        </div>
                                    </div>
                                </div>

                                <div>

                                    <h3>Autorizado a recoger al ni�o</h3>
                                    <button onClick={toggleContactInfo} className="a-agregarInfo">
                                        {showContactInfo ? 'Ocultar' : 'Agregar'}
                                    </button>

                                   
                                    {showContactInfo && (
                                        <div className="form-section">
 
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Nombre del Autorizado</label>
                                                    <input type="text" name="nombreCompAutorizado" value={formData.nombreCompAutorizado} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>C�dula del Autorizado</label>
                                                    <input type="text" name="cedulaAutorizado" value={formData.cedulaAutorizado} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Tel�fono del Autorizado</label>
                                                    <input type="text" name="telefonoAutorizado" value={formData.telefonoAutorizado} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Relaci�n con el Alumno</label>
                                                    <input type="text" name="relacionAutorizado" value={formData.relacionAutorizado} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>

                                    <h3>Contacto de emergencia</h3>
                                    <button onClick={toggleContactInfo2} className="a-agregarInfo">
                                        {showContactInfo2 ? 'Ocultar' : 'Agregar'}
                                    </button>


                                    {showContactInfo2 && (
                                        <div className="form-section">
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Nombre del Contacto</label>
                                                    <input type="text" name="nombreCompContacto" value={formData.nombreCompContacto} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>C�dula del Contacto</label>
                                                    <input type="text" name="cedulaContacto" value={formData.cedulaContacto} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Tel�fono del Contacto</label>
                                                    <input type="text" name="telefonoContacto" value={formData.telefonoContacto} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Relaci�n con el Contacto</label>
                                                    <input type="text" name="relacionContacto" value={formData.relacionContacto} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>




                                <div className="form-section">
                                    <h3>Padre de Familia</h3>
                                    <div className="alumno-registry-form-group">
                                        {/*<label>Seleccionar Padre</label>*/}
                                        <select name="padreId" value={formData.padreId} onChange={handleInputChange} required className="inputPadre">
                                            {/*<option value="">Selecciona un padre</option>*/}
                                            {padres.map((padre) => (
                                                <option key={padre.idUsuario} value={padre.idUsuario}>
                                                    {padre.nombreUsuario} {padre.apellidosUsuario}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="a-save-button">Guardar</button>
                                    <button type="button" onClick={closeModal} className="a-cancel-button">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>

                )}
            </div>
           {/* <Footer />*/}
            <ConfirmDialog />
        </div>
    );
}

export default AlumnoMaintenance;

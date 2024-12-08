import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faIdCard, faVenusMars, faHome, faInfoCircle, faCamera, faUserShield, faPhone } from '@fortawesome/free-solid-svg-icons';
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

    /** BORRAR ESTO EN CASO DE QUE NO FUNCUIONE*/
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageError, setImageError] = useState('');
    const fileInputRef = useState(null);

    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const IMAGE_PATH = '/FotosPerfAlumno/';


    const validateImage = (file) => {
        if (!file) {
            throw new Error('Por favor seleccione una imagen');
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            throw new Error('Formato no permitido. Use JPG, PNG');
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error('La imagen excede el tama�o m�ximo de 5MB');
        }

        return true;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageError('');

        try {
            if (validateImage(file)) {
                setSelectedFile(file);
                // Crear URL temporal para vista previa
                const previewURL = URL.createObjectURL(file);
                setPreviewUrl(previewURL);
            }
        } catch (error) {
            setImageError(error.message);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    /** */
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
        let imagePath = 'default.jpg';
        let uniqueFileName = '';

        if (selectedFile) {
            // Generar nombre �nico para la imagen
            const fileExtension = selectedFile.name.split('.').pop();
            uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
            imagePath = `${IMAGE_PATH}${uniqueFileName}`;
        }

        const payload = {
            idAlumno: 0,
            padreId: parseInt(formData.padreId) || 4, //aca definir un id padre por defecto para que no se caiga, asegurarse de no borrarlo
            nombreAlumno: formData.nombreAlumno || 'Sin nombre',
            apellidosAlumno: formData.apellidosAlumno || 'Sin apellidos',
            fechaNacimiento: formData.fechaNacimiento ?
                new Date(formData.fechaNacimiento).toISOString() :
                new Date().toISOString(),
            cedulaAlumno: formData.cedulaAlumno || 'Sin c�dula',
            generoAlumno: formData.generoAlumno || 'NA',
            direccionAlumno: formData.direccionAlumno || 'Sin direcci�n',
            informacionAdicional: formData.informacionAdicional || 'Sin informaci�n',
            fotoAlumno: imagePath || 'default.jpg',
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

            if (response.data && selectedFile) {
                // Creamos FormData para enviar la imagen
                const imageFormData = new FormData();
                imageFormData.append('file', selectedFile);
                imageFormData.append('fileName', uniqueFileName); // Enviamos el nombre generado

                // Enviamos la imagen al servidor
                const imageResponse = await axios.post('https://localhost:44369/Imagenes/GuardarImagenPerfilAluno', imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

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
           <Navbar />
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
                    <div className="alumno-modal-overlay" onClick={handleOverlayClick}>
                        <div className="alumno-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="alumno-modal-header">
                                <h2 className="alumno-title">Agregar Nuevo Alumno</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="alumno-form">
                                <div className="alumno-form-section">

                                    <div className="alumno-form-group">
                                        <label className="alumno-label">Nombre</label>
                                        <div className="alumno-input-container">
                                            <FontAwesomeIcon icon={faUser} className="alumno-input-icon" />
                                            <input
                                                type="text"
                                                name="nombreAlumno"
                                                value={formData.nombreAlumno}
                                                onChange={handleInputChange}
                                                required
                                                className="alumno-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="alumno-form-group">
                                        <label className="alumno-label">Apellidos</label>
                                        <div className="alumno-input-container">
                                            <FontAwesomeIcon icon={faUser} className="alumno-input-icon" />
                                            <input
                                                type="text"
                                                name="apellidosAlumno"
                                                value={formData.apellidosAlumno}
                                                onChange={handleInputChange}
                                                required
                                                className="alumno-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="alumno-form-group">
                                        <label className="alumno-label">Fecha de Nacimiento</label>
                                        <div className="alumno-input-container">
                                            <FontAwesomeIcon icon={faCalendar} className="alumno-input-icon" />
                                            <input
                                                type="date"
                                                name="fechaNacimiento"
                                                value={formData.fechaNacimiento}
                                                onChange={handleInputChange}
                                                required
                                                className="alumno-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="alumno-form-group">
                                        <label className="alumno-label">Cedula</label>
                                        <div className="alumno-input-container">
                                            <FontAwesomeIcon icon={faIdCard} className="alumno-input-icon" />
                                            <input
                                                type="text"
                                                name="cedulaAlumno"
                                                value={formData.cedulaAlumno}
                                                onChange={handleInputChange}
                                                required
                                                className="alumno-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="alumno-form-group">
                                        <label className="alumno-label">Genero</label>
                                        <div className="alumno-input-container">
                                            <FontAwesomeIcon icon={faVenusMars} className="alumno-input-icon" />
                                            <select
                                                name="generoAlumno"
                                                value={formData.generoAlumno}
                                                onChange={handleInputChange}
                                                required
                                                className="alumno-select"
                                            >
                                                <option value="">-- Seleccione el genero --</option>
                                                <option value="masc">Masculino</option>
                                                <option value="feme">Femenino</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="alumno-form-group">
                                        <label className="alumno-label">Direccion</label>
                                        <div className="alumno-input-container">
                                            <FontAwesomeIcon icon={faHome} className="alumno-input-icon" />
                                            <input
                                                type="text"
                                                name="direccionAlumno"
                                                value={formData.direccionAlumno}
                                                onChange={handleInputChange}
                                                required
                                                className="alumno-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="alumno-form-group">
                                        <label className="alumno-label">Informacion Adicional</label>
                                        <div className="alumno-input-container">
                                            <FontAwesomeIcon icon={faInfoCircle} className="alumno-input-icon" />
                                            <textarea
                                                name="informacionAdicional"
                                                value={formData.informacionAdicional}
                                                onChange={handleInputChange}
                                                className="alumno-textarea"
                                            ></textarea>
                                        </div>
                                    </div>


                                    <div className="alumno-form-group">
                                        <label className="alumno-label">Foto del Alumno</label>
                                        <div className="alumno-input-container">
                                            <FontAwesomeIcon icon={faCamera} className="alumno-input-icon" />
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                accept=".jpg,.jpeg,.png"
                                                className="alumno-input"
                                            />
                                        </div>
                                        {previewUrl && (
                                            <div className="image-preview-container">
                                                <img
                                                    src={previewUrl}
                                                    alt="Vista previa"
                                                    className="image-preview"
                                                    style={{ maxWidth: '200px', marginTop: '10px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedFile(null);
                                                        setPreviewUrl('');
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = '';
                                                        }
                                                    }}
                                                    className="remove-image-btn"
                                                >
                                                    Eliminar imagen
                                                </button>
                                            </div>
                                        )}
                                        {imageError && (
                                            <div className="error-message" style={{ color: 'red', marginTop: '5px' }}>
                                                {imageError}
                                            </div>
                                        )}
                                        <div className="image-info" style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                            Formatos permitidos: JPG, PNG. Tamano maximo: 5MB
                                        </div>
                                    </div>
                                  
                                    {/*<div className="alumno-form-group">*/}
                                    {/*    <label className="alumno-label">Foto del Alumno (de momento con URL)</label>*/}
                                    {/*    <div className="alumno-input-container">*/}
                                    {/*        <FontAwesomeIcon icon={faCamera} className="alumno-input-icon" />*/}
                                    {/*        <input*/}
                                    {/*            type="text"*/}
                                    {/*            name="fotoAlumno"*/}
                                    {/*            value={formData.fotoAlumno}*/}
                                    {/*            onChange={handleInputChange}*/}
                                    {/*            className="alumno-input"*/}
                                    {/*        />*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>

                                <div className="alumno-collapsible-section">
                                    <h3 className="alumno-section-title">Autorizado a recoger al nino</h3>
                                    <button
                                        onClick={toggleContactInfo}
                                        className="alumno-toggle-button"
                                        type="button"
                                    >
                                        {showContactInfo ? 'Ocultar' : 'Agregar'}
                                    </button>

                                    {showContactInfo && (
                                        <div className="alumno-form-section">
                                            <div className="alumno-form-group">
                                                <label className="alumno-label">Nombre del Autorizado</label>
                                                <div className="alumno-input-container">
                                                    <FontAwesomeIcon icon={faUserShield} className="alumno-input-icon" />
                                                    <input
                                                        type="text"
                                                        name="nombreCompAutorizado"
                                                        value={formData.nombreCompAutorizado}
                                                        onChange={handleInputChange}
                                                        className="alumno-input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="alumno-form-group">
                                                <label className="alumno-label">Cedula del Autorizado</label>
                                                <div className="alumno-input-container">
                                                    <FontAwesomeIcon icon={faIdCard} className="alumno-input-icon" />
                                                    <input
                                                        type="text"
                                                        name="cedulaAutorizado"
                                                        value={formData.cedulaAutorizado}
                                                        onChange={handleInputChange}
                                                        className="alumno-input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="alumno-form-group">
                                                <label className="alumno-label">Telefono del Autorizado</label>
                                                <div className="alumno-input-container">
                                                    <FontAwesomeIcon icon={faPhone} className="alumno-input-icon" />
                                                    <input
                                                        type="text"
                                                        name="telefonoAutorizado"
                                                        value={formData.telefonoAutorizado}
                                                        onChange={handleInputChange}
                                                        className="alumno-input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="alumno-form-group">
                                                <label className="alumno-label">Relacion con el Alumno</label>
                                                <div className="alumno-input-container">
                                                    <FontAwesomeIcon icon={faUser} className="alumno-input-icon" />
                                                    <input
                                                        type="text"
                                                        name="relacionAutorizado"
                                                        value={formData.relacionAutorizado}
                                                        onChange={handleInputChange}
                                                        className="alumno-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="alumno-collapsible-section">
                                    <h3 className="alumno-section-title">Contacto de emergencia</h3>
                                    <button
                                        onClick={toggleContactInfo2}
                                        className="alumno-toggle-button"
                                        type="button"
                                    >
                                        {showContactInfo2 ? 'Ocultar' : 'Agregar'}
                                    </button>

                                    {showContactInfo2 && (
                                        <div className="alumno-form-section">
                                            <div className="alumno-form-group">
                                                <label className="alumno-label">Nombre del Contacto</label>
                                                <div className="alumno-input-container">
                                                    <FontAwesomeIcon icon={faUser} className="alumno-input-icon" />
                                                    <input
                                                        type="text"
                                                        name="nombreCompContacto"
                                                        value={formData.nombreCompContacto}
                                                        onChange={handleInputChange}
                                                        className="alumno-input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="alumno-form-group">
                                                <label className="alumno-label">Cedula del Contacto</label>
                                                <div className="alumno-input-container">
                                                    <FontAwesomeIcon icon={faIdCard} className="alumno-input-icon" />
                                                    <input
                                                        type="text"
                                                        name="cedulaContacto"
                                                        value={formData.cedulaContacto}
                                                        onChange={handleInputChange}
                                                        className="alumno-input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="alumno-form-group">
                                                <label className="alumno-label">Telefono del Contacto</label>
                                                <div className="alumno-input-container">
                                                    <FontAwesomeIcon icon={faPhone} className="alumno-input-icon" />
                                                    <input
                                                        type="text"
                                                        name="telefonoContacto"
                                                        value={formData.telefonoContacto}
                                                        onChange={handleInputChange}
                                                        className="alumno-input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="alumno-form-group">
                                                <label className="alumno-label">Relacion con el Contacto</label>
                                                <div className="alumno-input-container">
                                                    <FontAwesomeIcon icon={faUser} className="alumno-input-icon" />
                                                    <input
                                                        type="text"
                                                        name="relacionContacto"
                                                        value={formData.relacionContacto}
                                                        onChange={handleInputChange}
                                                        className="alumno-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="alumno-form-section">
                                    <h3 className="alumno-section-title">Padre de Familia</h3>
                                    <div className="alumno-form-group">
                                        <div className="alumno-input-container">
                                            <FontAwesomeIcon icon={faUser} className="alumno-input-icon" />
                                            <select
                                                name="padreId"
                                                value={formData.padreId}
                                                onChange={handleInputChange}
                                                required
                                                className="alumno-select"
                                            >
                                                <option value="">-- Seleccione un padre --</option>
                                                {padres.map((padre) => (
                                                    <option key={padre.idUsuario} value={padre.idUsuario}>
                                                        {padre.nombreUsuario} {padre.apellidosUsuario}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="alumno-action-buttons">
                                    <button type="submit" className="alumno-button-save">Guardar</button>
                                    <button type="button" onClick={closeModal} className="alumno-button-cancel">Cancelar</button>
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

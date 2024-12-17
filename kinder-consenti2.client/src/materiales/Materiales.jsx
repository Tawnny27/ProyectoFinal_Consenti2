import React, { useEffect, useState, useRef } from "react";
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import "./materiales.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../UserContext';

const MaterialesDidacticos = () => {
    const { user } = useUserContext();
    const [materiales, setMateriales] = useState([]);
    const [idGrupoSeleccionado, setIdGrupoSeleccionado] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [nuevoMaterial, setNuevoMaterial] = useState({
        nombreArchivo: "",  // Corresponde a 'NombreArchivo' en el modelo C#
        descripcion: "",     // Corresponde a 'Descripcion' en el modelo C#
        documento: null,
        grupoId: "",         // Corresponde a 'GruposId' en el modelo C#
        statusAct: true,     // Corresponde a 'StatusAct' en el modelo C#
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [aulas, setAulas] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageError, setImageError] = useState('');
    const fileInputRef = useRef(null);

    const ALLOWED_FILE_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png'
    ];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const IMAGE_PATH = '/FotosMaterial/';

    const validateImage = (file) => {
        console.log("Validando archivo:", file);
        if (!file) {
            throw new Error('Por favor seleccione un archivo');
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            throw new Error('Formato no permitido. Use JPG, PNG, PDF, DOCX, PPTX');
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error('El archivo excede el tamaño máximo de 5MB');
        }

        return true;
    };

    useEffect(() => {
        const cargarMateriales = async () => {
            try {
                const response = await axios.get("https://localhost:44369/MaterialDidacticoes/ObtenerMaterialesDidacticos");
                console.log("Materiales cargados:", response.data);
                setMateriales(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al cargar los materiales:", error);
                setMensaje("No se pudieron cargar los materiales.");
                setIsLoading(false);
            }
        };

        const cargarAulas = async () => {
            try {
                const response = await axios.get("https://localhost:44369/Grupos/ObtenerGrupos");
                setAulas(response.data);
                console.log("Aulas cargadas:", response.data);
            } catch (error) {
                console.error("Error al cargar las aulas:", error);
                setMensaje("No se pudieron cargar las aulas.");
            }
        };

        cargarMateriales();
        cargarAulas();
    }, []);

    // Guardar material en el localStorage
    const guardarMaterialEnStorage = (material) => {
        if (material && material.documento && material.nombreArchivo) {
            // Usar URL.createObjectURL para generar una URL temporal del archivo
            const archivoURL = URL.createObjectURL(material.documento);
            // Guardar en localStorage como un objeto JSON
            const materialConArchivo = {
                ...material,
                documentoURL: archivoURL // Agregar la URL del archivo
            };
            localStorage.setItem('material', JSON.stringify(materialConArchivo)); // Guardar en localStorage
        } else {
            console.error('El material es inválido');
        }
    };


    const handleDownload = () => {
        const materialGuardado = JSON.parse(localStorage.getItem('material'));

        if (materialGuardado && materialGuardado.documentoURL) {
            const enlace = document.createElement('a');
            enlace.href = materialGuardado.documentoURL; // Usar la URL almacenada en localStorage
            enlace.download = materialGuardado.nombreArchivo; // Nombre del archivo para la descarga
            document.body.appendChild(enlace);
            enlace.click();
            document.body.removeChild(enlace);
        } else {
            toast.error("No se pudo recuperar el material para descargar.");
        }
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoMaterial((prevState) => ({
            ...prevState,
            [name === "nombre" ? "nombreArchivo" : name]: value, // Mapeo personalizado
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageError('');
        console.log("Archivo seleccionado:", file);

        try {
            if (validateImage(file)) {
                setSelectedFile(file);
                setNuevoMaterial((prevState) => ({
                    ...prevState,
                    documento: file, // Asignar el archivo a nuevoMaterial
                }));
                const previewURL = URL.createObjectURL(file);
                setPreviewUrl(previewURL);
                console.log("Vista previa de la imagen:", previewURL);

                // Guardar el material en localStorage
                guardarMaterialEnStorage({
                    ...nuevoMaterial,
                    documento: file,
                    nombreArchivo: nuevoMaterial.nombreArchivo, // Asegúrate de tener el nombre del archivo
                });
            }
        } catch (error) {
            setImageError(error.message);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            console.error("Error de validación de imagen:", error);
        }
    };
    const handleDelete = async (materialId) => {
        try {
            // Llamar a la API para eliminar el material usando el idMaterialDidactico
            const response = await axios.delete(`https://localhost:44369/MaterialDidacticoes/EliminarMaterialDidactico/${materialId}`);

            if (response.status === 200) {
                toast.success("Material eliminado con éxito");
                // Eliminar el material de la lista de materiales
                setMateriales(materiales.filter(material => material.idMaterialDidactico !== materialId)); // Filtrar por idMaterialDidactico
            } else {
                toast.error("No se pudo eliminar el material.");
            }
        } catch (error) {
            console.error("Error al eliminar el material:", error);
            toast.error("Error al eliminar material");
        }
    };


    const agregarMaterial = async (e) => {
        e.preventDefault();
       
        console.log("grupo selecionado",idGrupoSeleccionado); // Esto te muestra el ID del grupo/aula seleccionado.

        let imagePath = 'default.jpg';
        let uniqueFileName = '';

        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop();
            uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
            imagePath = `${IMAGE_PATH}${uniqueFileName}`;
        }

        if (!idGrupoSeleccionado) {
            toast.error("Debe seleccionar un aula.");
            return;
        }

        if (!selectedFile) {
            toast.error("Debe seleccionar al menos un archivo para cargar.");
            return;
        }

        try {
            const grupoSeleccionado = aulas.find(
                (aula) => aula.idGrupos === parseInt(idGrupoSeleccionado)
                
            );

            console.log("Grupo seleccionado:", grupoSeleccionado);

            const envioDatos = {
                NombreArchivo: nuevoMaterial.nombreArchivo,
                fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato ISO
                RutaFoto: imagePath,
                GruposId: grupoSeleccionado.idGrupos,
                Grupos: grupoSeleccionado,
            };

            console.log("Datos enviados al primer endpoint:", envioDatos);

            const createResponse = await axios.post(
                "https://localhost:44369/MaterialDidacticoes/CrearMaterialDidactico",
                envioDatos,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            if (createResponse.data) {
                const imageFormData = new FormData();
                imageFormData.append('file', selectedFile);
                imageFormData.append('fileName', uniqueFileName);

                const imageResponse = await axios.post(
                    "https://localhost:44369/Imagenes/GuardarMaterialDidacticoPdf",
                    imageFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                toast.success("Archivo guardado con éxito");
                console.log("Respuesta de la imagen:", imageResponse);

                // Agregar el nuevo material a la lista de materiales
                const nuevoMaterialAgregado = {
                    ...nuevoMaterial,
                    id: createResponse.data.id, // Suponiendo que la API devuelve un ID
                    aula: grupoSeleccionado.nombreGrupo, // El nombre del aula
                    documento: imagePath, // Ruta del archivo
                };
                // Cerrar el modal
                setModalVisible(false);
                setMateriales((prevMaterials) => [...prevMaterials, nuevoMaterialAgregado]); // Agregar el nuevo material a la lista
                setNuevoMaterial({
                    nombreArchivo: "",
                    descripcion: "",
                    documento: null,
                    grupoId: "",
                    statusAct: true,
                }); // Limpiar el formulario

            }
        } catch (error) {
            console.error("Error al agregar material:", error);
            toast.error("Error al agregar material");
        }
    };


    const volverAPrincipal = () => {
        window.location.href = "/main";
    };

    return (
        <>
            <Navbar />
            <div className="materiales-container">
                <h2 className="materiales-header">Material Didáctico</h2>
                {isLoading ? (
                    <p className="materiales-loading">Cargando materiales...</p>
                ) : (
                        <div className="cards-container">
                            <button onClick={() => setModalVisible(true)} className="button-agregar">
                                Agregar Nuevo Material
                            </button>
                        {materiales.map((material) => (
                            <div key={material.idMaterialDidactico} className="material-card">
                                <h4>{material.nombreArchivo}</h4>
                                
                                <p>Aula: {aulas.find(aula => aula.idGrupos === material.gruposId)?.nombreGrupo || 'Aula no encontrada'}</p>
                                <button
                                    onClick={handleDownload}
                                    className="materiales-button"
                                >
                                    Descargar
                                </button>
                                {/* Botón de eliminar */}
                                <button
                                    onClick={() => handleDelete(material.idMaterialDidactico)}
                                    className="materiales-button eliminar"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                        
                    </div>
                )}

                {/* Modal para agregar nuevo material */}
                {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
                            <h3>Agregar Nuevo Material</h3>
                            <select
                                name="grupoId"  // Cambié "aula" por "grupoId" para enlazar correctamente el estado
                                value={idGrupoSeleccionado}
                                onChange={(e) => setIdGrupoSeleccionado(e.target.value)}
                                style={{
                                    color: "#000",
                                    backgroundColor: "#fff",
                                    border: '1px solid #ccc', /* Borde gris claro */
                                    padding: '8px',
                                    fontSize: '14px',
                                    width: '100%', /* Ajusta el tamaño según lo necesites */
                                }}
                            >
                                <option value="">Seleccionar Aula</option>
                                {aulas.map((aula) => (
                                    <option key={aula.idGrupos} value={aula.idGrupos}> {/* Cambié el valor al id del aula */}
                                        {aula.nombreGrupo}
                                    </option>
                                ))}
                            </select>
                            
                            <input
                                type="text"
                                placeholder="Título"
                                value={nuevoMaterial.nombreArchivo}
                                onChange={handleChange}
                                name="nombre"
                            />
                            <textarea
                                placeholder="Descripción"
                                value={nuevoMaterial.descripcion}
                                onChange={handleChange}
                                name="descripcion"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpeg,.jpg,.png"
                            />
                            <button onClick={agregarMaterial} className="button-adjuntar">
                                Agregar Material
                            </button>
                        </div>
                    </div>
                )}

                
            </div>
            <Footer />
        </>
    );
};

export default MaterialesDidacticos;

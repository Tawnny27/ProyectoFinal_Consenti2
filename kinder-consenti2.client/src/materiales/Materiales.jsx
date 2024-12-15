import React, { useEffect, useState, useRef } from "react";
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import "./materiales.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../UserContext';

const MaterialesDidacticos = () => {
    const { user } = useUser();
    const [materiales, setMateriales] = useState([]);
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
                const response = await axios.get("https://localhost:44369/MaterialDidacticoes/ObtenerMateriales");
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

    const descargarMaterial = (id, nombre) => {
        alert(`Se ha descargado el material: ${nombre}`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoMaterial((prevState) => ({
            ...prevState,
            [name]: value,
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
            }
        } catch (error) {
            setImageError(error.message);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            console.error("Error de validación de imagen:", error);
        }
    };

    const agregarMaterial = async (e) => {
        e.preventDefault();
        let imagePath = 'default.jpg';
        let uniqueFileName = '';

        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop();
            uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
            imagePath = `${IMAGE_PATH}${uniqueFileName}`;
            console.log("Nombre único de la imagen:", uniqueFileName);
        }

        if (!nuevoMaterial.grupoId) {
            toast.error("Debe seleccionar un aula.");
            console.log("Aula no seleccionada");
            return;
        }

        if (!selectedFile) {
            toast.error("Debe seleccionar al menos una foto para cargar.");
            console.log("No hay fotos seleccionadas");
            return;
        }

        console.log("Nuevo Material:", nuevoMaterial);
        if (!nuevoMaterial.nombreArchivo || !nuevoMaterial.descripcion || !imagePath || !nuevoMaterial.grupoId) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const envioDatos = {
            NombreArchivo: nuevoMaterial.nombreArchivo,
            fecha: new Date().toISOString().split('T')[0], // Fecha actual
            descripcion: nuevoMaterial.descripcion,
            RutaFoto: imagePath || 'default.jpg',
            GruposId: nuevoMaterial.grupoId,
        };
        console.log("Envio de datos al primer endpoint:", envioDatos);

        try {
            const createResponse = await axios.post("https://localhost:44369/MaterialDidacticoes/CrearMaterialDidactico", envioDatos,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            // Si la respuesta es exitosa y hay una foto para cargar
            if (createResponse.data) {
                // Crear FormData para enviar la imagen
                const imageFormData = new FormData();
                imageFormData.append('file', selectedFile);
                imageFormData.append('fileName', uniqueFileName); // Enviar el nombre único
                console.log("Envio de imagen:", imageFormData);

                // Enviar la foto al segundo endpoint
                const imageResponse = await axios.post(
                    'https://localhost:44369/Imagenes/GuardarMaterialDidacticoPdf',
                    imageFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                toast.success("Archivo guardado con exito");
                console.log("Respuesta de la imagen:", imageResponse);
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
                        {materiales.map((material) => (
                            <div key={material.id} className="material-card">
                                <h4>{material.nombre}</h4>
                                <p className="material-description">{material.descripcion}</p>
                                <p>Aula: {material.aula}</p>
                                <p>Documento: {material.documento}</p>
                                <button
                                    onClick={() => descargarMaterial(material.id, material.nombre)}
                                    className="materiales-button"
                                >
                                    Descargar
                                </button>
                            </div>
                        ))}
                        <button onClick={() => setModalVisible(true)} className="button-agregar">
                            Agregar Nuevo Material
                        </button>
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
                                value={nuevoMaterial.grupoId}
                                onChange={handleChange}
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
                                    <option key={aula.id} value={aula.id}> {/* Cambié el valor al id del aula */}
                                        {aula.nombreGrupo}
                                    </option>
                                ))}
                            </select>
                            
                            <input
                                type="text"
                                placeholder="Título"
                                value={nuevoMaterial.nombre}
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

                {mensaje && (
                    <div className="materiales-empty">
                        <p>{mensaje}</p>
                        <button onClick={volverAPrincipal} className="button">
                            Volver a la página principal
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default MaterialesDidacticos;

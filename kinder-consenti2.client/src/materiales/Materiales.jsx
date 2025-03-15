import { useEffect, useState, useRef } from "react";
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import Sidebar from "../componentes/Sidebar";
import "./materiales.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../UserContext';
import {
    ObtenerMaterialesDidacticosPadre, ObtenerMaterialesDidacticosAct, ObtenerGrupos,
    InactivarMaterialDidactico, CrearMaterialDidactico,
} from '../apiClient'; // Importar las funciones desde apiClient.js

const MaterialesDidacticos = () => {
    const { user } = useUserContext();
    const [materiales, setMateriales] = useState([]);
    const [idGrupoSeleccionado, setIdGrupoSeleccionado] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [imagePath, setImagePath] = useState('');
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

    const cargarMateriales = async () => {
        if (user.rolId === 3) {
            try {
                const response1 = await ObtenerMaterialesDidacticosPadre(user.idUsuario);
                if (response1.status === 200) {
                    setMateriales(response1.data);
                    setIsLoading(false);
                } else {
                    setMensaje(response1);
                }
            } catch (error) {
                console.error("Error al cargar los materiales:", error);
                setMensaje("No se pudieron cargar los materiales.");
                setIsLoading(false);
            }
        } else {
            try {
                const response = await ObtenerMaterialesDidacticosAct();
                if (response.status == 200) {
                    setMateriales(response.data);
                    setIsLoading(false);
                } else {
                    setMensaje(response);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error al cargar los materiales:", error);
                setMensaje("No se pudieron cargar los materiales.");
                setIsLoading(false);
            }
        }
    };

    const cargarAulas = async () => {
        try {
            const response = await ObtenerGrupos();
            if (response.status == 200) {
                setAulas(response.data);
            } else {
                setMensaje(response);
            }
        } catch (error) {
            console.error("Error al cargar las aulas:", error);
            setMensaje("No se pudieron cargar las aulas.");
        }
    };

    useEffect(() => {
        cargarMateriales();

        cargarAulas();
    }, []);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const base64Image = async (file) => {
        const base64 = await convertToBase64(file);
        return base64;
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setImageError('');
        try {
            if (validateImage(file)) {
                setSelectedFile(file);
                const base64 = await base64Image(file);
                // Crear URL temporal para vista previa
                const previewURL = URL.createObjectURL(file);
                setPreviewUrl(previewURL);
                setImagePath(base64);
            }
        } catch (error) {
            setImageError(error.message);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setImagePath('');
            console.error("Error de validación de imagen:", error);
        }
    };
    const handleDelete = async (materialId) => {
        try {
            const response = await InactivarMaterialDidactico(materialId);
            if (response.status === 200) {
                cargarMateriales();
                cargarAulas();
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
        console.log("grupo selecionado", idGrupoSeleccionado); // Esto te muestra el ID del grupo/aula seleccionado.  

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

            const envioDatos = {
                NombreArchivo: nuevoMaterial.nombreArchivo,
                fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato ISO
                RutaFoto: imagePath,
                GruposId: grupoSeleccionado.idGrupos,
            };

            const createResponse = await CrearMaterialDidactico(envioDatos);
            if (createResponse.status == 200) {
                cargarMateriales();
                cargarAulas();
                // Cerrar el modal
                setModalVisible(false);

                setNuevoMaterial({
                    nombreArchivo: "",
                    descripcion: "",
                    documento: null,
                    grupoId: "",
                    statusAct: true,
                }); // Limpiar el formulario
                setImagePath('');
            }
        } catch (error) {
            console.error("Error al agregar material:", error);
            toast.error("Error al agregar material");
        }
    };

    const cerrarModal = (visible) => {
        setModalVisible(visible);
        setNuevoMaterial({
            nombreArchivo: "",
            descripcion: "",
            documento: null,
            grupoId: "",
            statusAct: true,
        });
        setImagePath('');
        setIdGrupoSeleccionado('');
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoMaterial((prevState) => ({
            ...prevState,
            [name === "nombre" ? "nombreArchivo" : name]: value, // Mapeo personalizado
        }));
    }


    const descargarFoto = (rutaFoto) => {
        const link = document.createElement('a');
        link.href = rutaFoto; // Ruta de la foto
        link.download = rutaFoto.split('/').pop(); // Descargar con el nombre del archivo original
        link.download = 'Material.pdf'; // Nombre del archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div>
            <Navbar />
            <div className="content-container">
                <Sidebar />

                <main className="main-content">
                    {!modalVisible && (

                    <div className="materiales-container">                      
                           
                                <h2 className="materiales-header">Material Didáctico</h2>
                                <div className="add-container">
                                    {user.rolId != 3 && (
                                        <button onClick={() => setModalVisible(true)} className="button-agregar">
                                            Agregar Nuevo Material
                                        </button>
                                    )}
                                </div>
                                {isLoading ? (
                                    <p className="materiales-loading">Cargando materiales...</p>
                                ) : (
                                    <div className="contenedor">

                                        <div className="cards-container">
                                            {materiales.map((material) => (
                                                <div key={material.idMaterialDidactico} className="material-card">
                                                    <h6 className="titulo">{material.nombreArchivo}</h6>
                                                    <p>Aula: {aulas.find(aula => aula.idGrupos === material.gruposId)?.nombreGrupo || 'Aula no encontrada'}</p>
                                                    <div>
                                                        <img src="\Fotos\Pdf_icon.png" alt="PDF Icon" style={{ width: '30px', height: '40px' }} />
                                                        <p>{material.descripcion}</p>
                                                    </div>
                                                    <div className="botones-div">

                                                        <button className="materiales-button"
                                                            onClick={() => descargarFoto(material.rutaFoto)}
                                                        >
                                                            Descargar
                                                        </button>

                                                        {/* Botón de eliminar */}
                                                        {user.rolId != 3 && (
                                                            <button
                                                                onClick={() => handleDelete(material.idMaterialDidactico)}
                                                                className="materiales-button eliminar"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        )}
                                                    </div>

                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                )}
                        </div>
                        )}

                        {/* Modal para agregar nuevo material */}
                        {modalVisible && (
                            <div className="modal">
                                <span className="close" onClick={() => cerrarModal(false)}>&times;</span>
                                <h3>Agregar Nuevo Material</h3>
                                <select
                                    name="grupoId"  // Cambié "aula" por "grupoId" para enlazar correctamente el estado
                                    value={idGrupoSeleccionado}
                                    onChange={(e) => setIdGrupoSeleccionado(e.target.value)}
                                    style={{
                                        color: "#000",
                                        backgroundColor: "#fff",
                                        border: '1px solid #ccc', /* Borde gris claro */
                                       
                                        fontSize: '14px',                                       
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
                                    maxLength={30}
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
                        )}

                   
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default MaterialesDidacticos;

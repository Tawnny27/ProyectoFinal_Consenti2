import React, { useEffect, useState, useRef } from "react";
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../UserContext';

const AgregarFotosAlumno = () => {
    const { user } = useUserContext();
    const [alumnos, setAlumnos] = useState([]);
    const [idAlumnoSeleccionado, setIdAlumnoSeleccionado] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [fotos, setFotos] = useState([]); // Estado para almacenar las fotos agregadas

    useEffect(() => {
        // Cargar alumnos desde el backend
        const cargarAlumnos = async () => {
            try {
                const response = await fetch("https://localhost:44369/api/Alumnos/ObtenerAlumnos");
                if (response.ok) {
                    const data = await response.json();
                    setAlumnos(data);
                    console.log("Alumnos cargados:", data);
                } else {
                    setMensaje("Error al cargar los alumnos.");
                    console.error("Error al cargar los alumnos", response);
                }
            } catch (error) {
                setMensaje("Hubo un error al obtener los alumnos.");
                console.error("Error en la carga de alumnos:", error);
            }
        };

        cargarAlumnos();

        // Cargar las fotos desde localStorage si están disponibles
        const fotosGuardadas = JSON.parse(localStorage.getItem('fotos')) || [];
        setFotos(fotosGuardadas);

    }, []);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageError, setImageError] = useState('');
    const fileInputRef = useRef(null);

    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const IMAGE_PATH = '/FotosAlumnos/';

    const validateImage = (file) => {
        console.log("Validando archivo:", file);
        if (!file) {
            throw new Error('Por favor seleccione una imagen');
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            throw new Error('Formato no permitido. Use JPG, PNG');
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error('La imagen excede el tamaño máximo de 5MB');
        }

        return true;
    };

    const manejarCambioDeArchivo = (e) => {
        const file = e.target.files[0];
        setImageError('');
        console.log("Archivo seleccionado:", file);

        try {
            if (validateImage(file)) {
                setSelectedFile(file);
                // Crear URL temporal para vista previa
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

    const descargarFoto = (rutaFoto) => {
        const link = document.createElement('a');
        link.href = rutaFoto; // Ruta de la foto
        link.download = rutaFoto.split('/').pop(); // Descargar con el nombre del archivo original
        link.click();
    };


    // Función para agregar fotos
    const agregarFotos = async (e) => {
        e.preventDefault();
        let imagePath = 'default.jpg';
        let uniqueFileName = '';

        if (selectedFile) {
            // Generar nombre único para la imagen
            const fileExtension = selectedFile.name.split('.').pop();
            uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
            imagePath = `${IMAGE_PATH}${uniqueFileName}`;
            console.log("Nombre único de la imagen:", uniqueFileName);
        }

        if (!idAlumnoSeleccionado) {
            toast.error("Debe seleccionar un alumno antes de agregar fotos.");
            console.log("Alumno no seleccionado");
            return;
        }

        if (!selectedFile) {
            toast.error("Debe seleccionar al menos una foto para cargar.");
            console.log("No hay fotos seleccionadas");
            return;
        }

        try {
            const alumnoSeleccionado = alumnos.find(
                (alumno) => alumno.idAlumno === parseInt(idAlumnoSeleccionado)
            );
            console.log("Alumno seleccionado:", alumnoSeleccionado);

            // Crear el objeto de datos a enviar
            const envioDatos = {
                alumnoId: alumnoSeleccionado.idAlumno,
                fecha: new Date().toISOString().split('T')[0], // Fecha actual
                rutaFoto: imagePath || 'default.jpg',
                alumno: alumnoSeleccionado
            };

            console.log("Envio de datos al primer endpoint:", envioDatos);

            // Enviar los datos al primer endpoint
          
            const response = await axios.post(
                'https://localhost:44369/api/FotoAlumnoes/CrearFotosAlumno',
                envioDatos,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            // Si la respuesta es exitosa y hay una foto para cargar
            if (response.data) {
                // Crear FormData para enviar la imagen
                const imageFormData = new FormData();
                imageFormData.append('file', selectedFile);
                imageFormData.append('fileName', uniqueFileName); // Enviar el nombre único
                console.log("Envio de imagen:", imageFormData);

                // Enviar la foto al segundo endpoint
                const imageResponse = await axios.post(
                    'https://localhost:44369/api/Imagenes/GuardarFotosNino',
                    imageFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                toast.success("Imagen enviada con exito");
                console.log("Respuesta de la imagen:", imageResponse);

                // Agregar la foto al estado para mostrarla
                const nuevaFoto = {
                    rutaFoto: imagePath,
                    fecha: new Date().toISOString().split('T')[0],
                    alumno: alumnoSeleccionado.nombreAlumno
                };

                setFotos((prevFotos) => {
                    const fotosActualizadas = [...prevFotos, nuevaFoto];
                    // Guardar las fotos en localStorage
                    localStorage.setItem('fotos', JSON.stringify(fotosActualizadas));
                    return fotosActualizadas;
                });
            }
        } catch (data) {
            console.error("Error:", data);
            toast.error("Hubo un error al agregar las fotos.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Roboto, sans-serif" }}>
            <Navbar />
            
            <h2 style={{ color: "#A569BD", marginTop: "90px" }}>Fotos de Alumnos</h2>
            {user.rolId === 1 && (
            <div style={{ marginBottom: "20px" }}>
                <h4>Seleccione un alumno</h4>
                <select
                    value={idAlumnoSeleccionado}
                    onChange={(e) => setIdAlumnoSeleccionado(e.target.value)}
                    style={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        marginRight: "10px",
                        color: "#000",
                        backgroundColor: "#fff"
                    }}
                >
                    <option value="">Seleccionar alumno</option>
                    {alumnos.map((alumno) => (
                        <option key={alumno.idAlumno} value={alumno.idAlumno}>
                            {alumno.nombreAlumno} {alumno.apellidosAlumno}
                        </option>
                    ))}
                </select>

                    <input
                    type="file"
                    ref={fileInputRef}  // Usando ref correctamente
                    onChange={manejarCambioDeArchivo}
                    accept=".jpg,.jpeg,.png"
                    style={{ margin: "10px 0" }}
                />

                <button
                    onClick={agregarFotos}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#3498DB",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Agregar Fotos
                </button>
            </div>
            )}
            {/* Mostrar las fotos agregadas */}
            <div style={{ marginTop: "20px", marginBottom: "50px" }}>
                <h4>Álbum de Fotos</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                    {fotos
                        .filter(foto => {
                            // Si el rol es 1 (Administrador), mostramos todas las fotos
                            if (user.rolId === 1) {
                                return true;
                            }
                            // Si el rol es 3 (Padre), solo mostramos las fotos del alumno cuyo padreId coincide con el idUsuario
                            return alumnos.some(alumno => alumno.nombreAlumno === foto.alumno && alumno.padreId === user.idUsuario);
                        })
                        .map((foto, index) => (
                            <div key={index} style={{ textAlign: "center", width: "150px" }}>
                                <img
                                    src={foto.rutaFoto}
                                    alt="Foto alumno"
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => descargarFoto(foto.rutaFoto)}  // Llamar a la función de descarga al hacer clic
                                />
                                <p style={{ fontSize: "12px", marginTop: "5px" }}>
                                    {foto.alumno} - {foto.fecha}
                                </p>
                            </div>
                        ))}
                </div>
            </div>



            <Footer />
        </div>
    );
};

export default AgregarFotosAlumno;

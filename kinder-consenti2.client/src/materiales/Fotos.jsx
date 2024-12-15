import React, { useEffect, useState, useRef } from "react";
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AgregarFotosAlumno = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [idAlumnoSeleccionado, setIdAlumnoSeleccionado] = useState("");
    const [mensaje, setMensaje] = useState("");

    // Obtener alumnos
    useEffect(() => {
        const cargarAlumnos = async () => {
            try {
                const response = await fetch("https://localhost:44369/Alumnos/ObtenerAlumnos");
                if (response.ok) {
                    const data = await response.json();
                    setAlumnos(data);
                    console.log("Alumnos cargados:", data);  // Agregado para ver los alumnos cargados
                } else {
                    setMensaje("Error al cargar los alumnos.");
                    console.error("Error al cargar los alumnos", response); // Agregado para ver el error
                }
            } catch (error) {
                setMensaje("Hubo un error al obtener los alumnos.");
                console.error("Error en la carga de alumnos:", error); // Agregado para ver el error
            }
        };

        cargarAlumnos();
    }, []);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageError, setImageError] = useState('');
    const fileInputRef = useRef(null);

    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const IMAGE_PATH = '/FotosAlumnos/';

    const validateImage = (file) => {
        console.log("Validando archivo:", file); // Agregado para ver el archivo
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

    // Manejar la selección de archivos
    const manejarCambioDeArchivo = (e) => {
        const file = e.target.files[0];
        setImageError('');
        console.log("Archivo seleccionado:", file);  // Agregado para ver el archivo seleccionado

        try {
            if (validateImage(file)) {
                setSelectedFile(file);
                // Crear URL temporal para vista previa
                const previewURL = URL.createObjectURL(file);
                setPreviewUrl(previewURL);
                console.log("Vista previa de la imagen:", previewURL);  // Agregado para ver la URL de la imagen
            }
        } catch (error) {
            setImageError(error.message);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            console.error("Error de validación de imagen:", error);  // Agregado para ver el error de validación
        }
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
            console.log("Nombre único de la imagen:", uniqueFileName);  // Agregado para ver el nombre único de la imagen
        }

        if (!idAlumnoSeleccionado) {
            toast.error("Debe seleccionar un alumno antes de agregar fotos.");
            console.log("Alumno no seleccionado");  // Agregado para ver si el alumno no está seleccionado
            return;
        }

        if (!selectedFile) {
            toast.error("Debe seleccionar al menos una foto para cargar.");
            console.log("No hay fotos seleccionadas");  // Agregado para ver si no hay fotos seleccionadas
            return;
        }

        try {
            const alumnoSeleccionado = alumnos.find(
                (alumno) => alumno.idAlumno === parseInt(idAlumnoSeleccionado)
            );
            console.log("Alumno seleccionado:", alumnoSeleccionado);  // Agregado para ver el alumno seleccionado

            // Crear el objeto de datos a enviar
            const envioDatos = {
                
                alumnoId: alumnoSeleccionado.idAlumno,
                fecha: new Date().toISOString().split('T')[0], // Fecha actual
                rutaFoto: imagePath || 'default.jpg',
                alumno: alumnoSeleccionado
            };

            console.log("Envio de datos al primer endpoint:", envioDatos);  // Agregado para ver los datos a enviar

            // Enviar los datos al primer endpoint
            const response = await axios.post(
                'https://localhost:44369/FotoAlumnoes/CrearFotosAlumno',
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
                console.log("Envio de imagen:", imageFormData);  // Agregado para ver FormData

                // Enviar la foto al segundo endpoint
                const imageResponse = await axios.post(
                    'https://localhost:44369/Imagenes/GuardarFotosNino',
                    imageFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                toast.success("Imagen enviada con exito");
                console.log("Respuesta de la imagen:", imageResponse);  // Agregado para ver la respuesta del segundo endpoint

            }
        } catch (data) {
            console.error("Error:", data);
            toast.error("Hubo un error al agregar las fotos.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Roboto, sans-serif" }}>
            <Navbar />
            <h2 style={{ color: "#A569BD", marginTop: "90px" }}>Agregar Fotos de Alumnos</h2>

            <div style={{ marginBottom: "20px" }}>
                <h3>Seleccione un alumno</h3>
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

            
            <Footer />
        </div>
    );
};

export default AgregarFotosAlumno;

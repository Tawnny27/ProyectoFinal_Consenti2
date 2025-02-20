import { useEffect, useState, useRef } from "react";
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { ObtenerAlumnos, CrearFotosAlumno,  ObtenerFotosAlumnos, BuscarUsuarios, ObtenerFotosAlumno } from '../apiClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../UserContext';

const AgregarFotosAlumno = () => {
    const { user } = useUserContext();
    const [alumnos, setAlumnos] = useState([]);
    const [idAlumnoSeleccionado, setIdAlumnoSeleccionado] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [fotos, setFotos] = useState([]); // Estado para almacenar las fotos agregadas
    const [fotosAlumno, setFotosAlumno] = useState([]);
    const [imagePath, setImagePath] = useState('');

    useEffect(() => {
        // Cargar alumnos desde el backend
        const cargarAlumnos = async () => {
            try {
                const response = await ObtenerAlumnos();
                console.log(response);
                if (response.status == 200) {
                    setAlumnos(response.data);
                    console.log("Alumnos cargados:", response.data);
                } else {
                    setMensaje("Error al cargar los alumnos: ", response);
                }

            } catch (error) {
                setMensaje("Hubo un error al obtener los alumnos.");
                console.error("Error en la carga de alumnos:", error);
            }
        };
        cargarAlumnos();

    }, []);


    const cargarFotos = async () => {
        if (user.rolId === 3) {
            const PadreResponse = await BuscarUsuarios(user.idUsuario);
            if (PadreResponse.status == 200) {
                const padre = PadreResponse.data;
                console.log(padre);
                padre.alumnos.map(async (hijo) => {
                    const listaFotos = await ObtenerFotosAlumno(hijo.idAlumno);
                    //setFotosAlumno(listaFotos.data);
                    console.log(listaFotos.data);
                    setFotosAlumno(listaFotos.data);
                    setFotos(prevFotos => [...prevFotos, ...listaFotos.data]);
                });
            } else {
                setFotos('');
            }

        } else if (user.rolId === 1) {
            const FotosResponse = await ObtenerFotosAlumnos();
            setFotos(FotosResponse.data);
        }


    }
    useEffect(() => {
        cargarFotos();   
    }, []);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageError, setImageError] = useState('');
    const fileInputRef = useRef(null);

    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/JPEG', 'image/PNG', 'image/JPG'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    //const IMAGE_PATH = '/FotosAlumnos/';

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

    //*************************************************************************** */

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

    const manejarCambioDeArchivo = async (e) => {
        const file = e.target.files[0];
        setImageError('');
        console.log("Archivo seleccionado:", file);

        try {
            if (validateImage(file)) {
                setSelectedFile(file);
                const base64 = await base64Image(file);
                // Crear URL temporal para vista previa
                const previewURL = URL.createObjectURL(file);
                setPreviewUrl(previewURL);
                setImagePath(base64);
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
                rutaFoto: imagePath || '',
                alumno: alumnoSeleccionado
            };

            console.log("Envio de datos al primer endpoint:", envioDatos);

            // Enviar los datos al primer endpoint

            const response = await CrearFotosAlumno(envioDatos);
            // Si la respuesta es exitosa y hay una foto para cargar
            if (response.status == 200) {
                setIdAlumnoSeleccionado('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setImagePath('');
                cargarFotos();
                setPreviewUrl('');
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
                    {previewUrl && (
                        <div className="image-preview-container">
                            <img
                                src={previewUrl}
                                alt="Vista previa"
                                className="image-preview"
                                style={{ maxWidth: '200px', marginTop: '10px' }}
                            />
                        </div>
                    )}
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
                    {fotos && (
                        fotos.map((foto) => (
                            <div key={foto.IdFotoAlumno} style={{ textAlign: "center", width: "150px" }}>
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
                        ))
                    )}

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AgregarFotosAlumno;

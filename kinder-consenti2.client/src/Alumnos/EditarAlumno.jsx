import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

const EditarAlumno = () => {
    const { id } = useParams(); // Obtener el id del alumno desde la URL
    const navigate = useNavigate(); // Hook para la navegación
    const [alumno, setAlumno] = useState({
        idAlumno: '',
        padreId: 0,
        nombreAlumno: '',
        apellidosAlumno: '',
        fechaNacimiento: '',
        cedulaAlumno: '',
        generoAlumno: '',
        direccionAlumno: '',
        informacionAdicional: '',
        fotoAlumno: 'default.jpg', // Imagen por defecto
        nombreCompAutorizado: '',
        cedulaAutorizado: '',
        telefonoAutorizado: 0,
        relacionAutorizado: '',
        nombreCompContacto: '',
        cedulaContacto: '',
        telefonoContacto: 0,
        relacionContacto: ''
    });
    const [mensajeExito, setMensajeExito] = useState(''); // Estado para el mensaje de éxito

    useEffect(() => {
        // Función para obtener el alumno a editar
        const obtenerAlumno = async () => {
            try {
                const response = await axios.get(`https://localhost:44369/Alumnos/BuscarAlumno/${id}`);
                setAlumno(response.data);
            } catch (error) {
                console.error("Error al obtener el alumno:", error);
            }
        };

        obtenerAlumno();
    }, [id]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setAlumno((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            await axios.put('https://localhost:44369/Alumnos/EditarAlumno', alumno);
            setMensajeExito('Los cambios se guardaron correctamente.');
            setTimeout(() => {
                navigate(`/alumno-maintenance`);
            }, 2000);
        } catch (error) {
            console.error("Error al editar el alumno:", error);
        }
    };

    return (
        <div className="student-maintenance-container">
            <Navbar />
            <div className="form-container">
                <h1>Editar Alumno</h1>
                {mensajeExito && <div className="success-message">{mensajeExito}</div>}
                <form onSubmit={manejarEnvio}>
                    <div>
                        {/*<label>ID Alumno</label>*/}
                        <input
                            type="text"
                            name="idAlumno"
                            value={alumno.idAlumno}
                            onChange={manejarCambio}
                            disabled
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div>
                        <label>ID Padre</label>
                        <input
                            type="text"
                            name="padreId"
                            value={alumno.padreId}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="nombreAlumno"
                            value={alumno.nombreAlumno}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label>Apellidos</label>
                        <input
                            type="text"
                            name="apellidosAlumno"
                            value={alumno.apellidosAlumno}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label>Fecha de Nacimiento</label>
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={alumno.fechaNacimiento ? alumno.fechaNacimiento.split('T')[0] : ''}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label>Cédula</label>
                        <input
                            type="text"
                            name="cedulaAlumno"
                            value={alumno.cedulaAlumno}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label>Género</label>
                        <input
                            type="text"
                            name="generoAlumno"
                            value={alumno.generoAlumno}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Dirección</label>
                        <input
                            type="text"
                            name="direccionAlumno"
                            value={alumno.direccionAlumno}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Información Adicional</label>
                        <input
                            type="text"
                            name="informacionAdicional"
                            value={alumno.informacionAdicional}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Foto</label>
                        <input
                            type="text"
                            name="fotoAlumno"
                            value={alumno.fotoAlumno}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Nombre Autorizado</label>
                        <input
                            type="text"
                            name="nombreCompAutorizado"
                            value={alumno.nombreCompAutorizado}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Cédula Autorizado</label>
                        <input
                            type="text"
                            name="cedulaAutorizado"
                            value={alumno.cedulaAutorizado}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Teléfono Autorizado</label>
                        <input
                            type="text"
                            name="telefonoAutorizado"
                            value={alumno.telefonoAutorizado}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Relación Autorizado</label>
                        <input
                            type="text"
                            name="relacionAutorizado"
                            value={alumno.relacionAutorizado}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Nombre Contacto</label>
                        <input
                            type="text"
                            name="nombreCompContacto"
                            value={alumno.nombreCompContacto}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Cédula Contacto</label>
                        <input
                            type="text"
                            name="cedulaContacto"
                            value={alumno.cedulaContacto}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Teléfono Contacto</label>
                        <input
                            type="text"
                            name="telefonoContacto"
                            value={alumno.telefonoContacto}
                            onChange={manejarCambio}
                        />
                    </div>
                    <div>
                        <label>Relación Contacto</label>
                        <input
                            type="text"
                            name="relacionContacto"
                            value={alumno.relacionContacto}
                            onChange={manejarCambio}
                        />
                    </div>
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EditarAlumno;

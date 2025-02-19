import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import './EditarAlumno.css';
import { EditarAlumnoo, ObtenerAlumnos } from '../apiClient';

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
        const fetchAlumno = async () => {
            try {
                const data = await ObtenerAlumnos(); // Usamos la función para obtener todos los alumnos
                const alumnoSeleccionado = data.find(a => a.id === id); // Buscamos el alumno por id
                setAlumno(alumnoSeleccionado);
            } catch (error) {
                console.error("Error al obtener los alumnos:", error);
            }
        };

        fetchAlumno();
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
            const response = await EditarAlumnoo(alumno); // Usamos la función de editar
            setMensajeExito('Los cambios se guardaron correctamente.');
            setTimeout(() => {
                navigate(`/alumno-maintenance`); // Navegar después de guardar
            }, 2000);
        } catch (error) {
            console.error("Error al editar el alumno:", error);
        }
    };

    return (
        <div className="unique-student-maintenance-container">
            <Navbar />
            <div className="unique-form-container">
                <h1>Editar Alumno</h1>
                {mensajeExito && <div className="unique-success-message">{mensajeExito}</div>}
                <form onSubmit={manejarEnvio}>
                    <input
                        type="text"
                        name="idAlumno"
                        value={alumno.idAlumno}
                        onChange={manejarCambio}
                        disabled
                        style={{ display: 'none' }}
                    />

                    <input
                        type="text"
                        name="padreId"
                        value={alumno.padreId}
                        disabled
                        onChange={manejarCambio}
                        style={{ display: 'none' }}
                    />

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
                            onChange={(e) => {
                                const { value } = e.target;
                                if (/^\d*$/.test(value) && value.length <= 9) {
                                    manejarCambio(e);
                                }
                            }}
                            required
                        />

                        {alumno.cedulaAlumno.length > 0 && alumno.cedulaAlumno.length < 9 && (
                            <span style={{ color: 'red' }}>La cédula debe tener al menos 9 dígitos.</span>
                        )}
                    </div>

                    <div>
                        <label>Teléfono Contacto</label>
                        <input
                            type="text"
                            name="telefonoContacto"
                            value={alumno.telefonoContacto}
                            onChange={(e) => {
                                const { value } = e.target;
                                if (/^\d*$/.test(value) && value.length <= 8) {
                                    manejarCambio(e);
                                }
                            }}
                            required
                        />
                        {alumno.telefonoContacto.length > 0 && alumno.telefonoContacto.length < 8 && (
                            <span style={{ color: 'red'}}>El teléfono debe tener exactamente 8 dígitos.</span>
                        )}
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

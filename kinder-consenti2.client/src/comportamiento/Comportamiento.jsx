import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { useUserContext } from '../UserContext';
import * as XLSX from 'xlsx';
import '../monitoreo/monitoreo.css';
import './comportamiento.css';

const ComportamientoAlumno = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [comentariosBanno, setComentariosBanno] = useState([]);
    const [comentariosComidas, setComentariosComidas] = useState([]);
    const [comentariosDormir, setComentariosDormir] = useState([]);
    const [comentariosHuerta, setComentariosHuerta] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState({ nombre: '', cedula: '' });
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const { user } = useUserContext();


    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                const response = await axios.get('https://localhost:44369/Alumnos/ObtenerAlumnos');
                setAlumnos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los alumnos:', error);
                setLoading(false);
            }
        };

        fetchAlumnos();
    }, []);

    // Filtrar alumnos seg�n el rol
    const alumnosFiltrados = alumnos.filter((alumno) => {
        const pertenecePadre = user.rolId === 3 ? alumno.padreId === user.idUsuario : true; // Filtra por rol
        const coincideNombre = alumno.nombreAlumno?.toLowerCase().includes(filtro.nombre.toLowerCase());
        const coincideCedula = alumno.cedulaAlumno?.includes(filtro.cedula);

        return pertenecePadre && coincideNombre && coincideCedula;
    });


    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltro((prevFiltro) => ({
            ...prevFiltro,
            [name]: value
        }));
    };

    const fetchComentarios = async (idAlumno) => {
        try {
            const responseBanno = await axios.get(`https://localhost:44369/api/ActividadBanno/BuscarActividadBannos/${idAlumno}`);
            const responseComidas = await axios.get(`https://localhost:44369/ActividadComidas/BuscarActividadComidas/${idAlumno}`);
            const responseDormir = await axios.get(`https://localhost:44369/ActividadDormir/BuscarActividadDormirs/${idAlumno}`);
            const responseHuerta = await axios.get(`https://localhost:44369/api/ActividadHuerta/BuscarActividadHuertas/${idAlumno}`);

            setComentariosBanno(responseBanno.data);
            setComentariosComidas(responseComidas.data);
            setComentariosDormir(responseDormir.data);
            setComentariosHuerta(responseHuerta.data);
        } catch (error) {
            console.error('Error al obtener comentarios:', error);
        }
    };

    useEffect(() => {
        if (alumnoSeleccionado) {
            fetchComentarios(alumnoSeleccionado.idAlumno);
        }
    }, [alumnoSeleccionado]);

    const handleAlumnoSeleccionado = (alumno) => {
        setAlumnoSeleccionado(alumno);
        setModalVisible(true);
    };

    const filtrarComentariosPorFecha = (comentarios) => {
        if (!fechaInicio || !fechaFin) {
            return comentarios;
        }
        return comentarios.filter(comentario => {
            const fechaComentario = new Date(comentario.fecha);
            return fechaComentario >= new Date(fechaInicio) && fechaComentario <= new Date(fechaFin);
        });
    };

    const exportarExcel = () => {
        const datos = [
            ['Fecha', 'Comentario', 'Actividad'],
            ...comentariosBanno.map(item => [item.fecha, item.comentario, 'Ba�o']),
            ...comentariosComidas.map(item => [item.fecha, item.comentario, 'Comidas']),
            ...comentariosDormir.map(item => [item.fecha, item.comentario, 'Dormir']),
            ...comentariosHuerta.map(item => [item.fecha, item.comentario, 'Huerta']),
        ];
        const ws = XLSX.utils.aoa_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Comentarios');
        XLSX.writeFile(wb, 'comentarios.xlsx');
    };

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <h2>Comportamiento de los Ni�os</h2>
            <div className="form-group">
                <input
                    type="text"
                    name="nombre"
                    placeholder="Buscar por nombre"
                    value={filtro.nombre}
                    onChange={handleFiltroChange}
                    className="form-control"
                />
                <input
                    type="text"
                    name="cedula"
                    placeholder="Buscar por c�dula"
                    value={filtro.cedula}
                    onChange={handleFiltroChange}
                    className="form-control"
                />
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>C�dula</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnosFiltrados.map((alumno) => (
                            <tr key={alumno.idAlumno}>
                                <td>{alumno.nombreAlumno}</td>
                                <td>{alumno.apellidosAlumno}</td>
                                <td>{alumno.cedulaAlumno}</td>
                                <td>
                                    <button className="submit-m-button" onClick={() => handleAlumnoSeleccionado(alumno)}>
                                        Comportamiento
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {modalVisible && alumnoSeleccionado && (
                <div className="comportamiento-modal">
                    <div className="comportamiento-content">
                        <h2>Comportamiento de {alumnoSeleccionado.nombreAlumno}</h2>

                        <div className="fecha-filtro">
                            <label>Fecha Inicio:</label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                            <label>Fecha Fin:</label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                min={fechaInicio}
                            />
                        </div>

                        <h4>Comentarios de Actividad Ba�o</h4>
                        <ul>
                            {filtrarComentariosPorFecha(comentariosBanno).map((item, index) => (
                                <li key={index}>
                                    <strong>{item.fecha}:</strong> {item.comentario}
                                </li>
                            ))}
                        </ul>

                        <h4>Comentarios de Actividad Comidas</h4>
                        <ul>
                            {filtrarComentariosPorFecha(comentariosComidas).map((item, index) => (
                                <li key={index}>
                                    <strong>{item.fecha}:</strong> {item.comentario}
                                </li>
                            ))}
                        </ul>

                        <h4>Comentarios de Actividad Dormir</h4>
                        <ul>
                            {filtrarComentariosPorFecha(comentariosDormir).map((item, index) => (
                                <li key={index}>
                                    <strong>{item.fecha}:</strong> {item.comentario}
                                </li>
                            ))}
                        </ul>

                        <h4>Comentarios de Actividad Huerta</h4>
                        <ul>
                            {filtrarComentariosPorFecha(comentariosHuerta).map((item, index) => (
                                <li key={index}>
                                    <strong>{item.fecha}:</strong> {item.comentario}
                                </li>
                            ))}
                        </ul>

                        <button onClick={exportarExcel} className="btn-primary">
                            Descargar en Excel
                        </button>

                        <button onClick={() => setModalVisible(false)} className="btn-secondary">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ComportamientoAlumno;

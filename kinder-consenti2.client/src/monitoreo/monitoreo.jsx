import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../expedientes/expedientes';
import './Monitoreo.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonitoreoAlumno = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [actividadBanno, setActividadBanno] = useState([]);
    const [actividadComidas, setActividadComidas] = useState([]);
    const [actividadDormir, setActividadDormir] = useState([]);
    const [actividadHuerta, setActividadHuerta] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState({
        nombre: '',
        cedula: ''
    });

    // Obtener alumnos desde el endpoint
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

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltro((prevFiltro) => ({
            ...prevFiltro,
            [name]: value
        }));
    };

    const fetchActividades = async (idAlumno) => {
        try {
            const responseBanno = await axios.get(`https://localhost:44369/api/ActividadBanno/BuscarActividadBannos/${idAlumno}`);
            const responseComidas = await axios.get(`https://localhost:44369/ActividadComidas/BuscarActividadComidas/${idAlumno}`);
            const responseDormir = await axios.get(`https://localhost:44369/ActividadDormir/BuscarActividadDormirs/${idAlumno}`);
            const responseHuerta = await axios.get(`https://localhost:44369/api/ActividadHuerta/BuscarActividadHuertas/${idAlumno}`);

            // Verificación de que los datos sean arreglos antes de asignarlos
            setActividadBanno(Array.isArray(responseBanno.data) ? responseBanno.data : []);
            setActividadComidas(Array.isArray(responseComidas.data) ? responseComidas.data : []);
            setActividadDormir(Array.isArray(responseDormir.data) ? responseDormir.data : []);
            setActividadHuerta(Array.isArray(responseHuerta.data) ? responseHuerta.data : []);
        } catch (error) {
            console.error('Error al obtener actividades:', error);
            setActividadBanno([]);
            setActividadComidas([]);
            setActividadDormir([]);
            setActividadHuerta([]);
        }
    };

    useEffect(() => {
        if (alumnoSeleccionado) {
            fetchActividades(alumnoSeleccionado.idAlumno);
        }
    }, [alumnoSeleccionado]); // Cuando el alumno seleccionado cambia

    const handleAlumnoSeleccionado = (alumno) => {
        setAlumnoSeleccionado(alumno);
        setModalVisible(true);
    };

    const dataBanno = {
        labels: actividadBanno.map((item, index) => `Actividad ${index + 1}`),
        datasets: [
            {
                label: 'Actividad Baño',
                data: actividadBanno.map(item => item.length),  // Asegúrate de que 'length' sea válido
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1
            }
        ]
    };

    const dataComidas = {
        labels: actividadComidas.map(item => item.fecha),
        datasets: [
            {
                label: 'Actividad Comidas',
                data: actividadComidas.map(item => item.statusComida),
                fill: false,
                borderColor: 'rgba(255,99,132,1)',
                tension: 0.1
            }
        ]
    };

    const dataDormir = {
        labels: actividadDormir.map(item => item.fecha),
        datasets: [
            {
                label: 'Actividad Dormir',
                data: actividadDormir.map(item => parseInt(item.tiempo) || 0),
                fill: false,
                borderColor: 'rgba(54,162,235,1)',
                tension: 0.1
            }
        ]
    };

    const dataHuerta = {
        labels: actividadHuerta.map(item => item.fecha),
        datasets: [
            {
                label: 'Actividad Huerta',
                data: actividadHuerta.map(item => item.statusParticipacion),
                fill: false,
                borderColor: 'rgba(153,102,255,1)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className="user-maintenance-container">
            {<Navbar />}
            <h2>Monitoreo de Alumno</h2>
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
                    placeholder="Buscar por cédula"
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
                            <th>Cédula</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnos.map((alumno) => (
                            <tr key={alumno.idAlumno}>
                                <td>{alumno.nombreAlumno}</td>
                                <td>{alumno.apellidosAlumno}</td>
                                <td>{alumno.cedulaAlumno}</td>
                                <td>
                                    <button
                                        className="btn-monitoreo"
                                        onClick={() => handleAlumnoSeleccionado(alumno)}
                                    >
                                        Monitoreo
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {modalVisible && alumnoSeleccionado && (
                <div className="monitoreo-modal">
                    <div className="monitoreo-content">
                        <h3>Monitoreo de {alumnoSeleccionado.nombreAlumno}</h3>
                        <h4>Actividad Baño</h4>
                        <Line data={dataBanno} />
                        <h4>Actividad Comidas</h4>
                        <Line data={dataComidas} />
                        <h4>Actividad Dormir</h4>
                        <Line data={dataDormir} />
                        <h4>Actividad Huerta</h4>
                        <Line data={dataHuerta} />
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

export default MonitoreoAlumno;

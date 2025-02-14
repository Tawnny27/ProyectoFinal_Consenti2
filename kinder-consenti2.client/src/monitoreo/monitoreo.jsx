import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../expedientes/expedientes';
import './Monitoreo.css';
import { useUserContext } from '../UserContext';

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

    const [filtro, setFiltro] = useState({ nombre: '', cedula: '' });   

    const { user } = useUserContext(); // Suponiendo que 'useUser' te da acceso al usuario actual



    // Obtener alumnos desde el endpoint
    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                const response = await axios.get('https://localhost:44369/api/Alumnos/ObtenerAlumnos');
                setAlumnos(response.data);
                setLoading(false);
                console.error('alumno:', response.data);
            } catch (error) {
                console.error('Error al obtener los alumnos:', error);
                setLoading(false);
            }
        };

        fetchAlumnos();
    }, []);

    // Filtrar alumnos según el rol
    const alumnosFiltrados = alumnos.filter((alumno) => {
        const pertenecePadre = user.rolId === 3 ? alumno.padreId === user.idUsuario : true; // Filtra por rol
        const coincideNombre = alumno.nombreAlumno?.toLowerCase().includes(filtro.nombre.toLowerCase());
        const coincideCedula = alumno.cedulaAlumno?.includes(filtro.cedula);

        return pertenecePadre && coincideNombre && coincideCedula;
    });



    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltro((prev) => ({ ...prev, [name]: value }));
    };

    const fetchActividades = async (idAlumno) => {
        try {
            const responseBanno = await axios.get(`https://localhost:44369/api/ActividadBanno/BuscarActividadBannos/${idAlumno}`);
            const responseComidas = await axios.get(`https://localhost:44369/api/ActividadComidas/BuscarActividadComidas/${idAlumno}`);
            const responseDormir = await axios.get(`https://localhost:44369/api/ActividadDormir/BuscarActividadDormirs/${idAlumno}`);
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

    // Crear los datos para el gráfico
    const dataBanno = {
        labels: actividadBanno.map(item => item.fecha),
        datasets: [
            {
                label: 'Actividad Comidas por día',
                data: actividadBanno.map(item => item.catidad),
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
                label: 'Actividad Comidas por día',
                data: actividadComidas.map(item => item.statusComida),
                fill: false,
                borderColor: 'rgba(255,99,132,1)',
                tension: 0.1
            }
        ]
    };

    //Dormir
    const convertirTiempoAMinutos = (tiempo) => {
        const [horas, minutos] = tiempo.split(':').map(Number); // Separar horas y minutos
        return horas * 60 + minutos; // Convertir a minutos totales
    };

    const convertirMinutosATiempo = (minutos) => {
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;
        return `${horas.toString().padStart(2, '0')}:${minutosRestantes.toString().padStart(2, '0')}`;
    };

    const dataDormir = {
        labels: actividadDormir.map(item => item.fecha), // Fechas en el eje X
        datasets: [
            {
                label: 'Minutos de sueño por día',
                data: actividadDormir.map(item => convertirTiempoAMinutos(item.tiempo)), // Convertir tiempos a minutos
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
                label: 'Actividad en la Huerta',
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
            <h2>Monitoreo de los Niños</h2>
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
                            {alumnosFiltrados.map((alumno) => (
                            <tr key={alumno.idAlumno}>
                                <td>{alumno.nombreAlumno}</td>
                                <td>{alumno.apellidosAlumno}</td>
                                <td>{alumno.cedulaAlumno}</td>
                                <td>
                                    <button
                                        className="submit-m-button"
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

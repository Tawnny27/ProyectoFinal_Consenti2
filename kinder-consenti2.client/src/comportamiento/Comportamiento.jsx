import  { useState, useEffect } from 'react';

import DataTable from 'react-data-table-component';
import { useUserContext } from '../UserContext';
import * as XLSX from 'xlsx';
import '../monitoreo/monitoreo.css';
import './comportamiento.css';
import { ObtenerAlumnos, BuscarActividadBannos, BuscarActividadComidas, BuscarActividadHuertas, BuscarActividadDormirs } from '../apiClient';

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
                const response = await ObtenerAlumnos();
                setAlumnos(response.data);
                setLoading(false);
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
        setFiltro((prevFiltro) => ({
            ...prevFiltro,
            [name]: value
        }));
    };

    const fetchComentarios = async (idAlumno) => {
        setComentariosBanno([]);
        setComentariosComidas([]);
        setComentariosDormir([]);
        setComentariosHuerta([])

        try {
            const responseBanno = await BuscarActividadBannos(idAlumno);
            if (responseBanno.status == 200) {
                setComentariosBanno(responseBanno.data);
            } 

            const responseComidas = await BuscarActividadComidas(idAlumno);
            if (responseComidas.status == 200) {
                setComentariosComidas(responseComidas.data);
            }

            const responseDormir = await BuscarActividadDormirs(idAlumno);
            if (responseDormir.status == 200) {
                setComentariosDormir(responseDormir.data);
            } 

            const responseHuerta = await BuscarActividadHuertas(idAlumno);
            if (responseHuerta.status == 200) {
                setComentariosHuerta(responseHuerta.data);
            }     

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
        let comentRetorno = [];
        comentRetorno =comentarios.filter(comentario => {
            //const fechaComentario = new Date(comentario.fecha);
            //return fechaComentario >= new Date(fechaInicio) && fechaComentario <= new Date(fechaFin);
            comentario.fecha>= new Date(fechaInicio) && comentario.fecha<=new Date(fechaFin)
        });

        console.log(comentRetorno);
        return comentRetorno;
    };

    const exportarExcel = () => {
        const datos = [
            ['Fecha', 'Comentario', 'Actividad'],
            ...comentariosBanno.map(item => [item.fecha, item.comentario, 'Baño']),
            ...comentariosComidas.map(item => [item.fecha, item.comentario, 'Comidas']),
            ...comentariosDormir.map(item => [item.fecha, item.comentario, 'Dormir']),
            ...comentariosHuerta.map(item => [item.fecha, item.comentario, 'Huerta']),
        ];
        const ws = XLSX.utils.aoa_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Comentarios');
        XLSX.writeFile(wb, 'comentarios.xlsx');
    };


    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#41b89a', // Color de fondo
                color: 'white',             // Color de la letra
                padding: '15px',            // Espacio interno
                textAlign: 'center',        // Alineación del texto
                fontSize: '16px',           // Tamaño de la letra
                fontWeight: 'bold',         // Negrita
            },
        },
    };


    const columns = [
        {
            name: "Nombre",
            selector: row => row.nombreAlumno,
            with: '30px',
            sortable: true
        },
        {
            name: "Apellidos",
            selector: row => row.apellidosAlumno,
            with: '30px',
            sortable: true
        },
        {
            name: "Cédula",
            selector: row => row.cedulaAlumno,
            with: '30px',
            sortable: true
        },
        {
            name: "Acciones",
            with: '5px',
            cell: (row) => (
                <div className="acciones">

                    <button className="submit-m-button" onClick={() => handleAlumnoSeleccionado(row)}>
                        Comportamiento
                    </button>
                </div>
            ),
        }
    ];



    return (
        <div>
            <div className="content-container">       
                <main className="main-content">
                <div className="content">

                    <h2>Comportamiento de los Niños</h2>
                    <div className="group">

                        <div className="seccion">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Buscar por nombre"
                                value={filtro.nombre}
                                onChange={handleFiltroChange}
                                className="form-control"
                            />
                        </div>
                        <div className="seccion">
                            <input
                                type="text"
                                name="cedula"
                                placeholder="Buscar por cédula"
                                value={filtro.cedula}
                                onChange={handleFiltroChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                            

                    {loading ? (
                        <p>Cargando...</p>
                    ) : (

                        <DataTable
                            columns={columns}
                            data={alumnosFiltrados}
                            customStyles={customStyles}
                            pagination
                            paginationComponentOptions={{
                                rowsPerPageText: 'Filas por página:',
                                rangeSeparatorText: 'de',
                                noRowsPerPage: false, // Muestra el selector de filas por página
                                selectAllRowsItem: true,
                                selectAllRowsItemText: 'Todos'
                            }}
                            highlightOnHover
                            fixedHeader
                            fixedHeaderScrollHeight="500px"
                            responsive
                        />

                        )}

                    </div>

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

                                <h4>Comentarios de Actividad Baño</h4>
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

                </main>
            </div >
     
        </div >
    );
};

export default ComportamientoAlumno;

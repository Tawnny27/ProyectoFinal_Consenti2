
import { useState, useEffect } from 'react';
import './Grupos.css';
import { ObtenerGrupos, ObtenerMaestros, CrearGrupo, ObtenerGrupoAlumnos } from '../apiClient';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const Grupos = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('todos');
    const [userFilter, setUserFilter] = useState('');
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalAlumnos, setShowModalAlumnos] = useState(false);
    const [alumnosGroup, setAlumnosGroup] = useState([]);
    const [grupoEnvio, setGrupoEnvio] = useState({});
    const [group, setGroup] = useState([]);
    const [maestros, setMaestros] = useState([]);


    const cargarGrupos = async () => {
        const groups = await ObtenerGrupos();
        setGroup(groups.data);
        console.log(groups.data);
        setFilteredData(groups.data);
        console.log(group);
    }

    const handleFilterChange = (e) => {
        if (e.target.name === 'status') setStatusFilter(e.target.value);
        if (e.target.name === 'user') setUserFilter(e.target.value);
    };


    const handleNewRecordChange = (e) => {
        setGrupoEnvio({ ...grupoEnvio, [e.target.name]: e.target.value });
    };

    const cargaStatus = (status) => {
        if (status == true)
            return "Activo";
        else
            return "inactivo";
    }

    // agregar nuevo grupo

    //--------------------------------------------------
    // logica para inactivar
    const handleStatusChange = (status) => {
        alert(status);
    };
    //----------------------------------------------------

    const cargarMaestros = async () => {
        const usuarioResponse = await ObtenerMaestros();
        setMaestros(usuarioResponse.data);
    };

    const agregarGrupo = async () => {
        const response = await CrearGrupo(grupoEnvio);
        if (response.status == 200) {
            setGrupoEnvio({});
            cargarGrupos();
            setShowModalAdd(false);
        } else {
            console.log(response);
            alert(response.data);
            setGrupoEnvio({});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        agregarGrupo();
    }

    const handleCancel = () => {
        setShowModalAdd(false);
        setGrupoEnvio({});
    }

    const handleKeyPress = (event) => {
        const charCode = event.charCode;

        // Permitir solo números (0-9)
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    };

    const verAlumnos = async (idGrupo) => {
        const response = await ObtenerGrupoAlumnos(idGrupo);
        setAlumnosGroup(response.data);
        setShowModalAlumnos(true);
    }

    const ocultarAlumnos = () => {
        setAlumnosGroup([]);
        setShowModalAlumnos(false);
    }


    useEffect(() => {
        cargarGrupos();
        cargarMaestros();
        console.log(group);
    }, []);

    useEffect(() => {
        let filtered = group.filter(item =>
            (statusFilter === 'todos' || (item.status ? 'activo' : 'inactivo') === statusFilter) &&
            item.usuario.nombreUsuario.toLowerCase().includes(userFilter.toLowerCase())
        );
        setFilteredData(filtered);
    }, [statusFilter, userFilter, group]);


    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#41b89a', // Color de fondo
                color: 'white',             // Color de la letra
                padding: '15px',           // Espacio interno                       
                fontSize: '16px',
                justifyContent: 'center',
                textAlign: 'center',                // Tamaño de la letra
                fontWeight: 'bold',         // Negrita
            }
        },
        cells: {
            style: {
                justifyContent: 'center',
                textAlign: 'center',
            },
        },
    };


    const calcularEdad = (fecha) => {
        let fechaActual = new Date();
        let fechaInicial = new Date(fecha);
        console.log(fechaInicial);
        console.log(fechaActual);
        let milisegundosEnUnAnio = 1000 * 60 * 60 * 24 * 365.25; // Incluye el .25 para 
        let diferenciaEnMilisegundos = fechaActual.getTime() - fechaInicial.getTime();
        let anios = diferenciaEnMilisegundos / milisegundosEnUnAnio;
        console.log(anios);
        return Math.floor(anios); // Redondea hacia abajo para obtener años completos

    }

    const colGroup = [
        {
            name: "Alumno",
            selector: row => row.alumno.nombreAlumno + " " + row.alumno.apellidosAlumno,
            with: '30px',
            sortable: true
        },
        {
            name: "Edad",
            selector: row => calcularEdad(row.alumno.fechaNacimiento),
            with: '10px',
            sortable: true
        }
    ];

    const columns = [
        {
            name: "Grupo",
            selector: row => row.nombreGrupo,
            with: '10px',
            sortable: true
        },
        {
            name: "Usuario",
            selector: row => row.usuario.nombreUsuario + " " + row.usuario.apellidosUsuario,
            with: '30px',
            sortable: true
        },
        {
            name: "Status",
            selector: row => cargaStatus(row.status),
            with: '30px',
            sortable: true
        },
        {
            name: "Acciones",
            with: '5px',
            cell: (row) => (
                <div className="acciones">
                    <button className="acciones-button" onClick={() => verAlumnos(row.idGrupos)}>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="acciones-button" onClick={() => alert('Ver y Editar')}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="acciones-button" onClick={() => handleStatusChange(row.status)}>X</button>
                </div>
            ),
        }
    ];

    return (
        <div >

           {/* <div className="content-container"> */}

                <main className="main-content">
                    {!showModalAdd & !showModalAlumnos && (

                        <div className="content">

                            <h1>Gestión de Grupos</h1>

                            <button className="new" onClick={() => setShowModalAdd(true)}>Agregar nuevo registro</button>

                            <div className="group">
                                <div className="seccion">
                                    <label>
                                        Filtro por estado:
                                    </label>
                                    <select name="status" onChange={handleFilterChange} value={statusFilter}>
                                        <option value="todos">Todos</option>
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>

                                </div>
                                <div className="seccion">
                                    <label>
                                        Filtro por usuario:
                                    </label>
                                    <input className="filter" name="user" onChange={handleFilterChange} value={userFilter} />
                                </div>
                            </div>

                            <div className="table-container">
                                <DataTable
                                    columns={columns}
                                    data={filteredData}
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
                                    fixedHeaderScrollHeight="300px"
                                    responsive
                                />

                            </div>
                        </div>
                    )}
                    {showModalAdd && (
                        <div className="modal">
                            <form onSubmit={handleSubmit}>
                                <h2>Nuevo Registro</h2>
                                <div>
                                    <label>Maestro:</label>
                                    <select
                                        name="usuarioId"
                                        value={grupoEnvio.UsuarioId}
                                        onChange={handleNewRecordChange}
                                        required
                                    >
                                        <option>Selecione un maestro</option>
                                        {
                                            maestros.map((ma) => (
                                                <option key={ma.idUsuario} value={ma.idUsuario}>
                                                    {ma.nombreUsuario} {ma.apellidosUsuario}
                                                </option>
                                            ))
                                        }
                                    </select>

                                    <label>Nombre del grupo:</label>
                                    <input name="nombreGrupo"
                                        onChange={handleNewRecordChange}
                                        value={grupoEnvio.nombreGrupo}
                                        required
                                    />

                                    <label>Edad Inicial:</label>
                                    <input name="edadInicial"
                                        onChange={handleNewRecordChange}
                                        value={grupoEnvio.edadInicial}
                                        onKeyPress={handleKeyPress}
                                        required
                                    />

                                    <label>Cupo:</label>
                                    <input name="cupo"
                                        onChange={handleNewRecordChange}
                                        value={grupoEnvio.cupo}
                                        onKeyPress={handleKeyPress}
                                        required
                                    />

                                </div>
                                <div className="btn-group">
                                    <button type="submit">Agregar</button>
                                    <button type="reset" onClick={handleCancel}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {showModalAlumnos && (

                        <div className="modal">
                            <div className="table-container">
                                <DataTable
                                    columns={colGroup}
                                    data={alumnosGroup}
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
                                    fixedHeaderScrollHeight="300px"
                                    responsive
                                />
                            </div>

                            <div className="button-cont-close">
                                <button type="reset" onClick={ocultarAlumnos}>Cerrar</button>
                            </div>
                            
                        </div>
                    )}

                </main>

            { /* </div> */}


        </div> 
    );
};

export default Grupos;

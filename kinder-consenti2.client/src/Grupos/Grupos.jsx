
import { useState, useEffect } from 'react';
import './Grupos.css';
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import Sidebar from "../componentes/Sidebar";
import { ObtenerGrupos, ObtenerMaestros, CrearGrupo } from '../apiClient';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Grupos = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('todos');
    const [userFilter, setUserFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [grupoEnvio, setGrupoEnvio] = useState({});
    const [group, setGroup] = useState([]);
    const [maestros, setMaestros] = useState([]);


    const cargarGrupos = async () => {
        const groups = await ObtenerGrupos();
        setGroup(groups.data);
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
    const handleStatusChange = (index) => {

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
            setShowModal(false);
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
        setShowModal(false);
        setGrupoEnvio({});
    }

    const handleKeyPress = (event) => {
        const charCode = event.charCode;

        // Permitir solo números (0-9)
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    };


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
                padding: '15px',            // Espacio interno
                textAlign: 'center',        // Alineación del texto
                fontSize: '16px',           // Tamaño de la letra
                fontWeight: 'bold',         // Negrita
            },
        },
    };



    const columns = [
        {
            name: "Grupo",
            selector: row => row.nombreGrupo,
            with: '30px',
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
            <Navbar />
            <div className="content-container">
                <Sidebar />

                <main className="main-content">
                    {!showModal && (

                        <div className="content">

                            <h1>Gestión de Grupos</h1>

                            <button className="new" onClick={() => setShowModal(true)}>Agregar nuevo registro</button>

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
                    {showModal && (
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


                </main>

            </div>
            <Footer />

        </div>
    );
};

export default Grupos;

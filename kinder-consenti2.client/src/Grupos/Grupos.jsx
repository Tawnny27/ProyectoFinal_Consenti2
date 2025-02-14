
import { useState, useEffect } from 'react';
import './Grupos.css';
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import Sidebar from "../componentes/Sidebar";
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Grupos = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('todos');
    const [userFilter, setUserFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newRecord, setNewRecord] = useState({ usuario: '', grupo: '' });
    const [group, setGroup] = useState([]);


    const cargarGrupos = async () => {
        const groups = await axios.get('https://localhost:44369/api/Grupos/ObtenerGrupos');
        setGroup(groups.data);
        console.log(group);
    }

    useEffect(() => {
        cargarGrupos();
        console.log(group);
    },[]);

    const handleFilterChange = (e) => {
        if (e.target.name === 'status') setStatusFilter(e.target.value);
        if (e.target.name === 'user') setUserFilter(e.target.value);

        let filtered = data.filter(item =>
            (statusFilter === 'todos' || item.status === statusFilter) &&
            item.usuario.includes(userFilter)
        );

        setFilteredData(filtered);
    };

    const handleNewRecordChange = (e) => {
        setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
    };

    const handleAddRecord = () => {
        setData([...data, newRecord]);
        setFilteredData([...data, newRecord]);
        setNewRecord({ usuario: '', grupo: '' });
        setShowModal(false);
    };

    const handleStatusChange = (index) => {
        let updatedData = data.map((item, i) => {
            if (i === index) item.status = item.status === 'activo' ? 'inactivo' : 'activo';
            return item;
        });
        setData(updatedData);
        setFilteredData(updatedData);
    };

    const cargaStatus = (status) => {
        if (status == true)
            return "Activo";
        else
            return "inactivo";
    }



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
            selector: row => row.usuario.nombreUsuario,
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
            with:'5px',            
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
                                data={group}
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
                        {showModal && (
                            <div className="modal">
                                <h2>Nuevo Registro</h2>
                                <label>
                                    Usuario:
                                    <input name="usuario" onChange={handleNewRecordChange} value={newRecord.usuario} />
                                </label>
                                <label>
                                    Nombre del grupo:
                                    <input name="grupo" onChange={handleNewRecordChange} value={newRecord.grupo} />
                                </label>
                                <button onClick={handleAddRecord}>Agregar</button>
                                <button onClick={() => setShowModal(false)}>Cancelar</button>
                            </div>
                        )}

                    </div>
                </main>

            </div>
            <Footer />

        </div>
    );
};

export default Grupos;

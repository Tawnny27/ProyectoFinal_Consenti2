
import { useState } from 'react';
import './Grupos.css';
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import Sidebar from "../componentes/Sidebar";

const Grupos = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('todos');
    const [userFilter, setUserFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newRecord, setNewRecord] = useState({ usuario: '', grupo: '' });

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

    return (
        <div className="App">

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
                                <input name="user" onChange={handleFilterChange} value={userFilter} />   
                            </div>
                                                    
                        </div>                     

                        <table>
                            <thead>
                                <tr>
                                    <th>Grupo</th>
                                    <th>Usuario</th>
                                    <th>Status</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.grupo}</td>
                                        <td>{item.usuario}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button onClick={() => alert('Ver y Editar')}>Ver/Editar</button>
                                            <button onClick={() => handleStatusChange(index)}>Cambiar Status</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

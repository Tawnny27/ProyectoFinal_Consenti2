import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Navbar from '../componentes/navbar'; // Aseg�rate de que la ruta sea correcta
import Footer from '../componentes/footer'; // Importa el Footer
import './UserMaintenance.css';

const UserMaintenance = () => {
    const [filters, setFilters] = useState({
        inactivityDate: '',
        name: '',
        idCard: '',
        status: '',
        entryDate: '',
        role: ''
    });
    const [userList, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const navigate = useNavigate();

    // Funci�n para obtener los datos de los usuarios desde la API
    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:44369/Padres/ObtenerPadres', { params: filters });
            if (response.status === 200) {
                const padresData = response.data;
                const formattedUsers = padresData.map(padre => ({
                    id: padre.idPadre,
                    name: `${padre.nombrePadre} ${padre.apellidosPadre}`,
                    idCard: padre.cedulaPadre,
                    entryDate: padre.fechaIngreso || '2023-01-01',
                    role: 'Padre',
                    status: padre.estado || 'Activo'
                }));
                setUserList(formattedUsers);
                setFilteredUsers(formattedUsers); // Inicializar lista filtrada
            }
        } catch (error) {
            console.error('Error al obtener los padres:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            const filtered = userList.filter(user => {
                return (
                    user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
                    user.idCard.includes(filters.idCard) &&
                    (filters.entryDate ? user.entryDate === filters.entryDate : true) &&
                    (filters.role ? user.role === filters.role : true) &&
                    (filters.status ? user.status.toLowerCase() === filters.status.toLowerCase() : true)
                );
            });
            setFilteredUsers(filtered);
        };

        applyFilters(); // Aplicar filtros al cambiar
    }, [filters, userList]);

    const handleSearch = () => {
        fetchUsers();
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleEdit = (user) => {
        navigate(`/editar-usuario/${user.id}`); // Corregido para usar comillas inversas
    };

    const handleInactivate = async (userId, isChecked) => {
        if (isChecked) {
            const confirmed = window.confirm('�Est� seguro que desea inactivar este usuario?');
            if (confirmed) {
                try {
                    await axios.put(`https://localhost:44369/Padres/InactivarPadre/${userId}`);
                    alert('Usuario inactivado exitosamente');
                    fetchUsers(); // Actualizar la lista de usuarios
                } catch (error) {
                    console.error('Error al inactivar el usuario:', error);
                    alert('Error al inactivar el usuario');
                }
            }
        }
    };

    const handleDelete = (userId) => {
        // Aqu� ir�a la l�gica para eliminar al usuario
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleCancel = () => {
        navigate('/main');
    };

    const handleCalendarClick = () => {
        setShowModal(true); // Abre el modal del calendario
    };

    const handleLogout = () => {
        // Aqu� ir�a la l�gica para cerrar sesi�n, como redirigir al login
        alert('Cerrando sesi�n...');
        navigate('/login'); // Redirigir a la p�gina de login
    };

    // Configuraci�n de las columnas para el DataTable
    const columns = [
        {
            name: 'Nombre',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'C�dula',
            selector: row => row.idCard,
            sortable: true
        },
        {
            name: 'Fecha de Ingreso',
            selector: row => row.entryDate,
            sortable: true
        },
        {
            name: 'Rol',
            selector: row => row.role,
            sortable: true
        },
        {
            name: 'Estado',
            selector: row => row.status,
            sortable: true
        },
        {
            name: 'Inactivar',
            cell: (row) => (
                <div>
                    <input
                        type="checkbox"
                        onChange={(e) => handleInactivate(row.id, e.target.checked)}
                        title="Inactivar"
                    />
                </div>
            )
        },
        {
            name: 'Acciones',
            cell: (row) => (
                <div>
                    <button className="edit-button" onClick={() => handleEdit(row)}>Editar</button>
                    <button className="delete-button" onClick={() => handleDelete(row.id)}>Eliminar</button>
                </div>
            )
        }
    ];

    return (
        <div className="user-maintenance-container">
            <Navbar
                handleCalendarClick={handleCalendarClick}
                handleLogout={handleLogout}
            /> {/* Aqu� se pasa el Navbar con las funciones */}
            <h2>Mantenimiento de Usuarios</h2>
            <div className="filters">
                <div className="filter-group">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        className="name-input"
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="idCard">C�dula</label>
                    <input
                        type="text"
                        id="idCard"
                        name="idCard"
                        value={filters.idCard}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="entryDate">Fecha de Ingreso</label>
                    <input
                        type="date"
                        id="entryDate"
                        name="entryDate"
                        value={filters.entryDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="filter-group role-filter">
                    <label htmlFor="role">Rol</label>
                    <select
                        id="role"
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                    >
                        <option value="">Seleccione Rol</option>
                        <option value="director/a">Director</option>
                        <option value="maestra">Maestra</option>
                        <option value="padre">Padre de Familia</option>
                        <option value="ni�o">Ni�o</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="status">Estado</label>
                    <select
                        id="status"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">Seleccione Estado</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
                <div className="button-container">
                    <button className="search-button" onClick={handleSearch}>Consultar</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredUsers} // Cambia a la lista filtrada
                pagination
                highlightOnHover
                customStyles={{
                    headCells: {
                        style: {
                            backgroundColor: '#f4f4f4',
                            fontWeight: 'bold',
                            color: '#333'
                        }
                    },
                    cells: {
                        style: {
                            padding: '14px',
                            borderBottom: '1px solid #ddd',
                        }
                    },
                    rows: {
                        style: {
                            '&:hover': {
                                backgroundColor: '#f1f1f1',
                            }
                        }
                    }
                }}
            />
            <Footer /> {/* Agrega el Footer aqu� */}
        </div>
    );
};

export default UserMaintenance;

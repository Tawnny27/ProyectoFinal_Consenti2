import React, { useState, useEffect } from 'react';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx
import './UserMaintenance.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; // Componente de ConfirmDialog




const UserMaintenance = () => {
    const [filters, setFilters] = useState({
        inactivityDate: '',
        name: '',
        idCard: '',
        status: '',
        entryDate: '',
        role: '',
        estado: Boolean,
    });
    const [userList, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const navigate = useNavigate();

    // Función para obtener el nombre del rol desde la API utilizando el rolId
    const fetchRoleName = async (rolId) => {
        try {
            const response = await axios.get(`https://localhost:44369/Roles/BuscarRol/${rolId}`);
            if (response.status === 200) {
                return response.data.nombreRol; // Devuelve el nombre del rol
            }
            return 'Desconocido'; // En caso de que el rol no exista o no se pueda obtener
        } catch (error) {
            console.error('Error al obtener el rol:', error);
            return 'Desconocido'; // En caso de error
        }
    };

    // Función para obtener los datos de los usuarios desde la API
    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:44369/Usuarios/ObtenerUsuarios', { params: filters });
            if (response.status === 200) {
                const usuariosData = response.data;

                // Obtener el nombre del rol para cada usuario
                const formattedUsers = await Promise.all(
                    usuariosData.map(async (usuario) => {
                        const roleName = await fetchRoleName(usuario.rolId); // Llamar a la API para obtener el nombre del rol
                        return {
                            id: usuario.idUsuario,
                            name: `${usuario.nombreUsuario} ${usuario.apellidosUsuario}`,
                            idCard: usuario.cedulaUsuario,
                            entryDate: usuario.fechaIngreso ? usuario.fechaIngreso.split('T')[0] : '2023-01-01', // Ajuste de formato de fecha
                            role: roleName || 'Desconocido', // Asignar el nombre del rol obtenido o "Desconocido"
                            status: usuario.estado ? 'Activo' : 'Inactivo' // Mapeo del estado booleano
                        };
                    })
                );

                setUserList(formattedUsers);
                setFilteredUsers(formattedUsers); // Inicializar lista filtrada
            }
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
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

   
    const handleDelete = (userId) => {
        // Encuentra el usuario que coincida con el userId
        const userToDelete = userList.find((user) => user.id === userId);

        // Verifica si el usuario está inactivo y tiene más de 2 años de inactividad
        const canDeleteUser = (user) => {
            if (user && user.status.toLowerCase() === 'inactivo') {
                const currentDate = new Date();
                const inactiveDate = new Date(user.entryDate); // Suponiendo que entryDate es la fecha de inactividad
                const twoYearsAgo = new Date(currentDate.setFullYear(currentDate.getFullYear() - 2));
                return inactiveDate <= twoYearsAgo;
            }
            return false;
        };

        // Si el usuario es encontrado, procede con la confirmación
        if (userToDelete && canDeleteUser(userToDelete)) {
            confirmDialog({
                message: (
                    <>
                        ¿Está seguro de que desea eliminar al usuario <strong>{userToDelete.name}</strong>?
                        <br />
                        Esta acción no se puede deshacer.
                    </>
                ),
                header: 'Confirmación',
                icon: 'pi-exclamation-triangle', // Icono de advertencia
                className: 'custom-confirm-dialog', // Clase personalizada para el diálogo
                acceptClassName: 'custom-accept-button', // Clase para el botón de aceptar
                rejectClassName: 'custom-reject-button', // Clase para el botón de rechazar
                accept: async () => {
                    try {
                        await axios.delete(`https://localhost:44369/Usuarios/EliminarUsuario/${userId}`);
                        setUserList(userList.filter((user) => user.id !== userId));
                        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
                    } catch (error) {
                        console.error('Error al eliminar el usuario:', error);
                    }
                },
                reject: () => {
                    console.log('Eliminación cancelada');
                },
            });
        } else {
            confirmDialog({
                message: (
                    <>
                        No se puede eliminar al usuario <strong>{userToDelete.name}</strong>
                        <br />
                        Asegúrate de que está inactivo y tiene más de 2 años de inactividad.
                    </>
                ),
            })
        }
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
        alert('Cerrando sesión...');
        navigate('/login'); // Redirigir a la página de login
    };

    // Nueva función para exportar a Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredUsers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

        // Guardar el archivo
        XLSX.writeFile(wb, 'usuarios.xlsx');
    };

    // Configuración de las columnas para el DataTable
    const columns = [
        {
            name: 'Nombre',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Cédula',
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
            name: 'Acciones',
            cell: (row) => (
                <div className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(row)}>
                        <FontAwesomeIcon icon={faEdit} /> {/* Icono de editar */}
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(row.id)}>
                        <FontAwesomeIcon icon={faTrash} /> {/* Icono de eliminar */}
                    </button>
                </div>
            ),
        }
    ];

    return (
        <div className="user-maintenance-container">
            <Navbar
                handleCalendarClick={handleCalendarClick}
                handleLogout={handleLogout}
            />
          
            <h2>Mantenimiento de Usuarios</h2>
            <ConfirmDialog />
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
                    <label htmlFor="idCard">Cédula</label>
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
                        <option value="Admin">Administrador</option>
                        <option value="Directora">Directora</option>
                        <option value="Maestro">Maestra</option>
                        <option value="Padre">Padre de Familia</option>
                        
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
                <div className="filter-buttons">
                    <button onClick={exportToExcel} className="export-button">
                        <FontAwesomeIcon icon={faFileExcel} /> Exportar
                    </button>
                </div>
            </div>
            <div className="data-table-wrapper">
                <DataTable
                    columns={columns}
                    data={filteredUsers}
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
                    responsive // Hace la tabla adaptable a diferentes tamaños de pantalla
                />
            </div>
            {showModal && (
                <Modal
                    selectedUser={selectedUser}
                    onClose={handleModalClose}
                    modalType={modalType}
                />
            )}

            <Footer />
        </div>
    );
};

export default UserMaintenance;

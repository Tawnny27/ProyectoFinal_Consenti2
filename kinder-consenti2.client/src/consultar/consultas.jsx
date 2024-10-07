import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; // Aseg�rate de tener un componente Modal
import RegisterChildrenForm from './RegisterChildrenForm'; // Componente para ni�os
import RegisterUserForm from './RegisterUserForm'; // Componente para usuarios
import './UserMaintenance.css'; // Aseg�rate de tener los estilos necesarios

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
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const navigate = useNavigate();

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = () => {
        // Aqu� ir�a la l�gica para filtrar los usuarios seg�n los filtros
        // y actualizar el estado `userList`
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalType(user.isChild ? 'child' : 'user');
        setShowModal(true);
    };

    const handleInactivate = (userId) => {
        // Aqu� ir�a la l�gica para inactivar al usuario
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

    return (
        <div className="user-maintenance-container">
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
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </div>
                <div className="button-container">
                    <button className="search-button" onClick={handleSearch}>Consultar</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
                </div>
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>C�dula</th>
                        <th>Fecha de Ingreso</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.idCard}</td>
                            <td>{user.entryDate}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                                <button className="edit-button" onClick={() => handleEdit(user)}>Editar</button>
                                <button className="inactivate-button" onClick={() => handleInactivate(user.id)}>Inactivar</button>
                                <button className="delete-button" onClick={() => handleDelete(user.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <Modal isOpen={showModal} onClose={handleModalClose}>
                    {modalType === 'child' ? (
                        <RegisterChildrenForm user={selectedUser} onClose={handleModalClose} />
                    ) : (
                        <RegisterUserForm user={selectedUser} onClose={handleModalClose} />
                    )}
                </Modal>
            )}
        </div>
    );
};

export default UserMaintenance;

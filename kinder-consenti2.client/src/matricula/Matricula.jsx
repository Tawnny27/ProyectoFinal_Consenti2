import React, { useState, useEffect } from 'react';
import axios from '../axios';
import './matricula.css';
import { useUser } from '../UserContext';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

const Matricula = () => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        nombreUsuario: '',
        apellidosUsuario: '',
        cedulaUsuario: '',
        telefonoUsuario: '',
        correoUsuario: '',
        totalAmount: 0,
        selectedChildren: [],
        period: '4 meses',
        paymentMethod: '',
        proofOfPayment: null,
    });

    const [childrenList, setChildrenList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            if (user.rolId === 3) {
                // Prellenar datos del padre si es usuario tipo Padre
                setFormData((prev) => ({
                    ...prev,
                    parentFullName: `${user.nombreUsuario} ${user.apellidosUsuario}`,
                    parentID: user.cedulaUsuario,
                    phone: user.telefonoUsuario || '',
                    address: user.direccionUsuario || '',
                }));
                setChildrenList(user.alumnos || []);
            } else if (user.rolId === 1) {
                fetchUsers();
            }
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('https://localhost:44369/Usuarios/ObtenerUsuarios');
            const formattedUsers = data
                .filter((usuario) => usuario.rolId === 3)
                .map((usuario) => ({
                    id: usuario.idUsuario,
                    name: `${usuario.nombreUsuario} ${usuario.apellidosUsuario}`,
                    idCard: usuario.cedulaUsuario,
                    children: usuario.alumnos || [],
                    phone: usuario.telefonoUsuario,
                    address: usuario.direccionUsuario || '',
                }));
            setUserList(formattedUsers);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    const handleUserSelect = (userId) => {
        const selectedUser = userList.find((user) => user.id === parseInt(userId));
        if (selectedUser) {
            setFormData((prev) => ({
                ...prev,
                parentFullName: selectedUser.name,
                parentID: selectedUser.idCard,
                phone: selectedUser.phone,
                address: selectedUser.address,
            }));
            setChildrenList(selectedUser.children);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, proofOfPayment: e.target.files[0] }));
    };

    const handleChildSelection = (childId) => {
        setFormData((prev) => ({
            ...prev,
            selectedChildren: prev.selectedChildren.includes(childId)
                ? prev.selectedChildren.filter((id) => id !== childId)
                : [...prev.selectedChildren, childId],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.selectedChildren.length) {
            setError('Debes seleccionar al menos un niño para matricular.');
            return;
        }
        if (!formData.proofOfPayment) {
            setError('Debes agregar un comprobante de pago.');
            return;
        }
        console.log('Formulario enviado:', formData);
    };

    return (
        <div className="enrollment-form-container">
            <Navbar />
            <div className="enrollment-form">
                <h2>Formulario de Matrícula</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {user.rolId === 1 && (
                        <div className="select-parent">
                            <label>Selecciona un Padre:</label>
                            <select
                                onChange={(e) => handleUserSelect(e.target.value)}
                                value={formData.parentID || ''}
                            >
                                <option value="">Selecciona un padre</option>
                                {userList.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <PaymentSection
                        formData={formData}
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                    />

                    <ParentInfo formData={formData} handleChange={handleChange} userRole={user.rolId} />

                    <ChildrenSelection
                        childrenList={childrenList}
                        selectedChildren={formData.selectedChildren}
                        handleChildSelection={handleChildSelection}
                    />

                    <div className="payment-period">
                        <label>
                            Periodo:
                            <select
                                name="period"
                                value={formData.period}
                                onChange={handleChange}
                            >
                                <option value="4 meses">4 meses</option>
                                <option value="Anual">Anual</option>
                            </select>
                        </label>
                    </div>

                    <div className="total-amount">
                        <p>Total a pagar: {formData.totalAmount}</p>
                    </div>

                    <div className="buttons">
                        <button type="submit">Realizar Matrícula</button>
                        <button type="button" onClick={() => (window.location.href = '/main')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

const PaymentSection = ({ formData, handleChange, handleFileChange }) => (
    <div className="payment-section">
        <h3>Opciones de Pago</h3>
        <label>
            <input
                type="radio"
                name="paymentMethod"
                value="Transaccion"
                checked={formData.paymentMethod === 'Transaccion'}
                onChange={handleChange}
            />
            Transacción Bancaría
        </label>
        <label>
            <input
                type="radio"
                name="paymentMethod"
                value="SINPE"
                checked={formData.paymentMethod === 'SINPE'}
                onChange={handleChange}
            />
            SINPE
        </label>
        <label>
            <input
                type="radio"
                name="paymentMethod"
                value="Efectivo"
                checked={formData.paymentMethod === 'Efectivo'}
                onChange={handleChange}
               
            />
            Efectivo
        </label>
        <div className="proof-of-payment">
            <label>Agregar comprobante de pago:</label>
            <input type="file" onChange={handleFileChange} />
        </div>
    </div>
);

const ParentInfo = ({ formData, handleChange, userRole }) => (
    <div className="parent-info">
        <h3>Información del Padre</h3>
        <label>Nombre Completo del Padre:</label>
        <input
            type="text"
            name="parentFullName"
            value={formData.parentFullName}
            onChange={handleChange}
            disabled={userRole === 3}
        />
        <label>Cédula:</label>
        <input
            type="text"
            name="parentID"
            value={formData.parentID}
            onChange={handleChange}
            disabled={userRole === 3}
        />
        <label>Teléfono:</label>
        <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
        />
        <label>Dirección:</label>
        <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
        />
    </div>
);

const ChildrenSelection = ({ childrenList, selectedChildren, handleChildSelection }) => (
    <div className="children-selection">
        <h3>Niños a Matricular:</h3>
        {childrenList.length > 0 ? (
            childrenList.map((child) => (
                <div key={child.idAlumno}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedChildren.includes(child.idAlumno)}
                            onChange={() => handleChildSelection(child.idAlumno)}
                        />
                        {`${child.nombreAlumno} ${child.apellidosAlumno}`}
                    </label>
                </div>
            ))
        ) : (
            <p>No hay niños para mostrar.</p>
        )}
    </div>
);

export default Matricula;

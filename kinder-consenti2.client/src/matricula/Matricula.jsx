import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './matricula.css';

const Matricula = ({ userId, padresData }) => {
    const [idRol, setIdRol] = useState(null);
    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({
        paymentMethod: '',
        proofOfPayment: null,
        parentName: '',
        parentID: '',
        phone: '',
        address: '',
        selectedChildren: [],
        period: '4 meses',
        totalAmount: 0,
    });
    const [childrenList, setChildrenList] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const loginResponse = await axios.get('https://localhost:44369/Usuarios/AccesoUsuario2');
                setIdRol(loginResponse.data.rolId);

                const userResponse = await axios.get(`https://localhost:44369/Usuarios/BuscarUsuarios/${userId}`);
                setUserData(userResponse.data);

                if (loginResponse.data.rolId === 3) { // Si es un padre
                    setFormData(prev => ({
                        ...prev,
                        parentName: userResponse.data.nombreUsuario,
                        parentID: userResponse.data.cedulaUsuario,
                        phone: userResponse.data.telefonoUsuario,
                        address: userResponse.data.direccionUsuario || '',
                    }));
                    setChildrenList(userResponse.data.alumnos || []);
                }
            } catch (error) {
                setError("Error fetching user data");
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleParentChange = (e) => {
        const selectedParent = padresData.find(parent => parent.id === e.target.value);
        if (selectedParent) {
            setFormData(prev => ({
                ...prev,
                parentName: selectedParent.name,
                parentID: selectedParent.id,
                phone: selectedParent.phone,
                address: selectedParent.address,
            }));
            setChildrenList(selectedParent.children);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Actualizar el total a pagar según el período
        if (name === 'period') {
            const amount = value === 'Anual' ? 1000 : 300;
            setFormData(prev => ({ ...prev, totalAmount: amount }));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, proofOfPayment: e.target.files[0] }));
    };

    const handleChildSelection = (childId) => {
        setFormData(prev => ({
            ...prev,
            selectedChildren: prev.selectedChildren.includes(childId)
                ? prev.selectedChildren.filter(id => id !== childId)
                : [...prev.selectedChildren, childId],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación simple
        if (formData.selectedChildren.length === 0) {
            setError('Debes seleccionar al menos un niño para matricular.');
            return;
        }

        if (!formData.proofOfPayment) {
            setError('Debes agregar un comprobante de pago.');
            return;
        }

        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            const response = await axios.post('URL_DEL_ENDPOINT_DE_MATRICULA', formDataToSend);

            if (response.status === 200) {
                // Resetear el formulario o redirigir al usuario
                setFormData({
                    paymentMethod: '',
                    proofOfPayment: null,
                    parentName: '',
                    parentID: '',
                    phone: '',
                    address: '',
                    selectedChildren: [],
                    period: '4 meses',
                    totalAmount: 0,
                });

                alert('Matrícula realizada con éxito!');
                // redirigir o realizar otras acciones aquí
            }
        } catch (error) {
            setError("Error al enviar los datos de matrícula.");
            console.error("Error al enviar datos de matrícula:", error);
        }
    };

    return (
        <div className="enrollment-form-container">
            <div className="enrollment-form">
                <h2>Formulario de Matrícula</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="payment-section">
                        <h3>Opciones de Pago</h3>
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
                        {idRol === 1 && (
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
                        )}
                        <div className="proof-of-payment">
                            <label>Agregar comprobante de pago:</label>
                            <input type="file" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div className="parent-info">
                        <h3>Información del Padre</h3>
                        {idRol === 1 ? (
                            <select onChange={handleParentChange} value={formData.parentID}>
                                <option value="">Seleccionar Padre</option>
                                {padresData.map((parent) => (
                                    <option key={parent.id} value={parent.id}>
                                        {parent.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <>
                                    <label>Nombre del Padre:</label>
                                    <input type="text" value={formData.parentName} readOnly />
                                <label>Cédula:</label>
                                <input type="text" value={formData.parentID} readOnly />
                                <label>Teléfono:</label>
                                <input type="text" value={formData.phone} readOnly />
                                <label>Dirección:</label>
                                <textarea value={formData.address} readOnly />
                            </>
                        )}
                    </div>

                    <div className="child-info">
                        <h3>Seleccionar Niño(s) a Matricular</h3>
                        {childrenList.map((child) => (
                            <label key={child.id}>
                                <input
                                    type="checkbox"
                                    checked={formData.selectedChildren.includes(child.id)}
                                    onChange={() => handleChildSelection(child.id)}
                                />
                                {child.name}
                            </label>
                        ))}
                        <label>Período de Matrícula:</label>
                        <select name="period" value={formData.period} onChange={handleChange}>
                            <option value="4 meses">4 meses</option>
                            <option value="Anual">Anual</option>
                        </select>
                        <p>Total a pagar: {formData.totalAmount} XXX</p>
                    </div>

                    <div className="buttons">
                        <button type="submit" className="submit-m-button">Realizar Matrícula</button>
                        <button
                            type="button"
                            className="cancel-m-button"
                            onClick={() => window.location.href = '/main'}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Matricula;

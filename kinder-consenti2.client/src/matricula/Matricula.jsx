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
    const [productosFijos, setProductosFijos] = useState([]);
    const [productosMensuales, setProductosMensuales] = useState([]);
    const [selectedProductos, setSelectedProductos] = useState([]);


    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const responseFijos = await axios.get('https://localhost:44369/ObtenerProductosfijos');
                const responseMensuales = await axios.get('https://localhost:44369/ObtenerProductosMensuales');

                setProductosFijos(responseFijos.data);
                setProductosMensuales(responseMensuales.data);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };

        obtenerProductos();
    }, []);



    useEffect(() => {
        const cargarDatosUsuario = async () => {
            if (user) {
                if (user.rolId === 3) {
                    // Si el usuario actual es un padre, prellenar sus datos y cargar sus hijos
                    setFormData((prev) => ({
                        ...prev,
                        id: user.idUsuario,
                        parentFullName: `${user.nombreUsuario} ${user.apellidosUsuario}`,
                        parentID: user.cedulaUsuario,
                        phone: user.telefonoUsuario || '',
                        address: user.direccionUsuario || '',
                    }));
                    if (user.alumnos && user.alumnos.length > 0) {
                        setChildrenList(user.alumnos); // Los alumnos deberían estar en `user.alumnos`
                    } else {
                        setChildrenList([]); // Si no hay alumnos
                    }

                } else if (user.rolId === 1) {
                    // Si el usuario actual es un administrador, usar fetchUsers para obtener datos
                    await fetchUsers();

                    // Buscar al usuario correspondiente con el mismo id del usuario actual
                    const usuarioEncontrado = userList.find(
                        (usuario) => usuario.id === user.idUsuario
                    );
                    if (usuarioEncontrado) {
                        setChildrenList(usuarioEncontrado.children || []);
                    }
                }
            }
        };

        cargarDatosUsuario();
    }, [user, userList]);

    useEffect(() => {
        const total = selectedProductos.reduce((acc, productoId) => {
            const producto = [...productosFijos, ...productosMensuales].find(
                (p) => p.idProducto === productoId
            );
            return acc + (producto ? producto.monto : 0);
        }, 0);

        setFormData((prev) => ({ ...prev, totalAmount: total }));
    }, [selectedProductos, productosFijos, productosMensuales]);


    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('https://localhost:44369/Usuarios/ObtenerUsuarios');
            const formattedUsers = data
                .filter((usuario) => usuario.rolId === 3)
                .map((usuario) => ({
                    id: usuario.idUsuario,
                    name: `${usuario.nombreUsuario} ${usuario.apellidosUsuario}`,
                    idCard: usuario.cedulaUsuario,
                    children: usuario.alumnos || [], // Asegúrate de que la API devuelve `alumnos`
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

    const handleProductoSelection = (productoId) => {
        setSelectedProductos((prev) =>
            prev.includes(productoId)
                ? prev.filter((id) => id !== productoId)
                : [...prev, productoId]
        );
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

        const dataToSend = {
            cliente: `${user.nombreUsuario} ${user.apellidosUsuario}`,
            fecha: new Date().toISOString(),
            subtotal: formData.totalAmount - formData.iva,  // El subtotal es el total menos el IVA
            descuento: 0,  // Agrega lógica para descuentos si es necesario
            iva: formData.iva,
            total: formData.totalAmount,  // Total incluye IVA
            detalles: formData.selectedChildren.map((childId) => ({
                productoId: childId,  // Asegúrate de enviar los productos seleccionados de alguna forma
                alumnoId: childId,  // O el id del alumno relacionado
                monto: formData.totalAmount,
                dias: formData.period,  // O la duración seleccionada
            })),
        };

        axios.post('https://localhost:44369/EncabezadoFactura/CrearMatricula', dataToSend)
            .then((response) => {
                console.log('Matrícula creada:', response);
            })
            .catch((error) => {
                console.error('Error al crear matrícula:', error);
            });
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

                    {/* Sección de Pago */}
                    <div className="payment-section">
                        <PaymentSection
                            formData={formData}
                            handleChange={handleChange}
                            handleFileChange={handleFileChange}
                            userRole={user.rolId}
                        />
                    </div>

                    {/* Sección de Información del Padre */}
                    <div className="parent-info">
                        <ParentInfo formData={formData} handleChange={handleChange} userRole={user.rolId} />
                    </div>

                    {/* Sección de Selección de Niños */}
                    <div className="children-selection">
                        <ChildrenSelection
                            childrenList={childrenList}
                            selectedChildren={formData.selectedChildren}
                            handleChildSelection={handleChildSelection}
                        />
                    </div>
                    <div className="products-selection">
                        <h3>Seleccionar Productos:</h3>
                        <h4>Productos Fijos:</h4>
                        {productosFijos.map((producto) => (
                            <div key={producto.idProducto}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedProductos.includes(producto.idProducto)}
                                        onChange={() => handleProductoSelection(producto.idProducto)}
                                    />
                                    {producto.nombreProducto} - {producto.monto} colones
                                </label>
                            </div>
                        ))}

                        <h4>Productos Mensuales:</h4>
                        {productosMensuales.map((producto) => (
                            <div key={producto.idProducto}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedProductos.includes(producto.idProducto)}
                                        onChange={() => handleProductoSelection(producto.idProducto)}
                                    />
                                    {producto.nombreProducto} - {producto.monto} colones
                                </label>
                            </div>
                        ))}
                    </div>


                    <div className="payment-period">
                        <label>
                            Periodo:
                            <select
                                name="period"
                                value={formData.period}
                                onChange={handleChange}
                            >
                                <option value="4 meses">Mensual</option>
                                <option value="Anual">Anual</option>
                            </select>
                        </label>
                    </div>

                    <div className="total-amount">
                        <p>Total a pagar: {formData.totalAmount} colones</p>
                    </div>

                    <div className="buttons">
                        <button type="submit">Realizar Matrícula</button>
                        <button type="button" onClick={(handleSubmit) => (window.location.href = '/main')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>

    );
};

const PaymentSection = ({ formData, handleChange, handleFileChange, userRole }) => (
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
                disabled={userRole === 3}
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

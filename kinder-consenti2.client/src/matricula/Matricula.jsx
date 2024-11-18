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
        period: '',
        paymentMethod: '',
        proofOfPayment: null,
        matriculaStatus: '',
        lastEnrollmentDate: null,
        date: new Date().toISOString(), // Fecha actual
        referenceNumber: '', // Número de referencia del comprobante
        subtotal: 0, // Subtotal
        iva: 0, // IVA
        discount: 0, // Descuento
    });

    const [childrenList, setChildrenList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [error, setError] = useState('');
    const [productosFijos, setProductosFijos] = useState([]);
    const [productosMensuales, setProductosMensuales] = useState([]);
    const [selectedProductos, setSelectedProductos] = useState([]);


    useEffect(() => {
        const cargarDatosUsuario = async () => {

            if (user) {
                try {

                    // Si el rol del usuario es 3 (Padre)
                    if (user.rolId === 3) {
                        // Prellenar los datos del usuario actual (padre)
                        setFormData((prev) => ({
                            ...prev,
                            id: user.idUsuario,
                            parentFullName: `${user.nombreUsuario} ${user.apellidosUsuario}`,
                            parentID: user.cedulaUsuario,
                            phone: user.telefonoUsuario || '',
                            address: user.direccionUsuario || '',
                        }));

                        // Llamada para obtener los datos del usuario con el idUsuario del padre
                        const usuarioResponse = await fetch(`/Usuarios/BuscarUsuarios/${user.idUsuario}`);
                        if (!usuarioResponse.ok) {
                            throw new Error('No se pudo obtener los datos del usuario');
                        }

                        const usuarioData = await usuarioResponse.json();

                        // Validar que el idUsuario de la API coincida con el idUsuario del usuario actual
                        if (usuarioData && usuarioData.idUsuario === user.idUsuario) {
                            // Si el idUsuario coincide, obtener la lista de alumnos (hijos)
                            const alumnosResponse = await fetch(`/api/alumnos/${user.idUsuario}`);
                            const alumnos = await alumnosResponse.json();
                            setChildrenList(alumnos || []); // Establecer la lista de alumnos (hijos)
                        } else {
                            setChildrenList([]); // Limpiar la lista de alumnos si el idUsuario no coincide
                        }
                    }

                    // Si el rol es 1 (Administrador), usar los usuarios de la API
                    else if (user.rolId === 1) {
                        // Usar la función fetchUsers para obtener los usuarios
                        await fetchUsers();

                        // Buscar el usuario correspondiente por idUsuario en la lista de usuarios
                        const usuarioEncontrado = userList.find(
                            (usuario) => usuario.id === user.idUsuario
                        );

                        // Si el usuario se encuentra, cargar los datos de los alumnos
                        if (usuarioEncontrado) {
                            if (usuarioEncontrado.idUsuario === user.idUsuario) {
                                // Obtener los datos de los alumnos
                                const alumnosResponse = await fetch(`/api/alumnos/${user.idUsuario}`);
                                const alumnos = await alumnosResponse.json();
                                setChildrenList(alumnos || []); // Establecer la lista de alumnos
                            } else {
                                setChildrenList([]); // Limpiar la lista de alumnos si no coincide el idUsuario
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del usuario:', error);
                    setChildrenList([]); // Limpiar la lista de alumnos en caso de error
                }
            }
        };


        cargarDatosUsuario();
    }, [user, userList]); // Se ejecuta cada vez que cambia el 'user' o la lista de 'userList'



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

    //Productos
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

    // Actualizar el subtotal, IVA y total
    useEffect(() => {
        const subtotal = selectedProductos.reduce((acc, productoId) => {
            const producto = [...productosFijos, ...productosMensuales].find(
                (p) => p.idProducto === productoId
            );
            return acc + (producto ? producto.monto : 0);
        }, 0);

        const iva = subtotal * 0.13; // 13% de IVA
        const discountAmount = user.rolId === 1 ? ((iva + subtotal) * formData.discount) / 100 : 0; // Descuento para rol 1
        const total = subtotal + iva - discountAmount;

        setFormData((prev) => ({
            ...prev,
            subtotal: subtotal,
            iva: iva,
            totalAmount: total,
        }));
    }, [selectedProductos, productosFijos, productosMensuales, formData.discount]);

    const handleProductoSelection = (productoId) => {
        setSelectedProductos((prev) =>
            prev.includes(productoId)
                ? prev.filter((id) => id !== productoId)
                : [...prev, productoId]
        );
    };

    const handlePeriodoChange = async (e) => {
        const selectedPeriod = e.target.value;
        setFormData((prev) => ({ ...prev, period: selectedPeriod }));

        // Si selecciona "Anual", marca automáticamente la matrícula
        if (selectedPeriod === 'Anual') {
            setFormData((prev) => ({
                ...prev,
                matriculaStatus: 'Matrícula marcada automáticamente.',
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                matriculaStatus: 'El niño está actualmente matriculado.',
            }));

            // Validar si el niño tiene matrícula activa (un año desde la última matrícula)
            const lastEnrollmentDate = formData.lastEnrollmentDate;
            if (lastEnrollmentDate) {
                const today = new Date();
                const oneYearLater = new Date(lastEnrollmentDate);
                oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

                if (today < oneYearLater) {
                    setFormData((prev) => ({
                        ...prev,
                        matriculaStatus: 'El niño está actualmente matriculado. No puede matricularse nuevamente.',
                    }));
                }
            }
        }
    };

    //Envia datos
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
            referenceNumber: formData.referenceNumber, // Número de referencia
            subtotal: formData.subtotal,
            iva: formData.iva,
            descuento: formData.discount, // Descuento
            total: formData.totalAmount,
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
                    <div className="form-layout">
                        {/* Sección Izquierda (Información del Usuario e Hijos) */}
                        <div className="left-section">
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

                            <div className="parent-info">
                                <ParentInfo formData={formData} handleChange={handleChange} userRole={user.rolId} />
                            </div>

                            <div className="children-selection">
                                <ChildrenSelection
                                    childrenList={childrenList}
                                    selectedChildren={formData.selectedChildren}
                                    handleChildSelection={handleChildSelection}
                                />
                            </div>
                        </div>

                        {/* Sección Derecha (Pagos y Productos) */}
                        <div className="right-section">
                            <div className="payment-section">
                                <label>Fecha Actual: {new Date().toLocaleDateString()}</label>

                                {/* Sección de Pago */}
                                <div className="payment-section">
                                    <PaymentSection
                                        formData={formData}
                                        handleChange={handleChange}
                                        handleFileChange={handleFileChange}
                                        userRole={user.rolId}
                                    />
                                <label>Número de Referencia del Comprobante:</label>
                                <input
                                    type="text"
                                    name="referenceNumber"
                                    value={formData.referenceNumber}
                                    onChange={handleChange}
                                        //required
                                    />
                                    <div className="payment-period">
                                        <label>
                                            Periodo:
                                            <select name="period" value={formData.period} onChange={handlePeriodoChange}>
                                                <option value="Mensual">Mensual</option>
                                                <option value="Anual">Anual</option>
                                            </select>
                                        </label>
                                    </div>
                                
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
                                <label>Subtotal: {formData.subtotal}</label>
                                <label>IVA (13%): {formData.iva}</label>
                                

                                {user.rolId === 1 && (
                                    <>
                                        <label>Descuento (%):</label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                        />
                                    </>
                                )}
                            </div>

                            <div className="total-amount">
                                <p>Total a pagar: {formData.totalAmount} colones</p>
                            </div>
                        </div>
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
}


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

const ChildrenSelection = ({ childrenList, selectedChildren, handleChildSelection }) => {
    console.log('childrenList:', childrenList); // Verifica el contenido de childrenList

    return (
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
                <p>No hay niños para mostrar.</p> // Se muestra este mensaje si childrenList está vacío
            )}
        </div>
    );
};



export default Matricula;

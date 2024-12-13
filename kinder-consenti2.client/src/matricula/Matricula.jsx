import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import './matricula.css';
import { useUser } from '../UserContext';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

const Matricula = () => {
    const navigate = useNavigate();
    const { user, usuario } = useUser();
    const [formData, setFormData] = useState({
        parentID:0,
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
        lastEnrollmentDate: null,
        date: new Date().toISOString(), // Fecha actual
        referenceNumber: '', // Número de referencia del comprobante
        subtotal: 0, // Subtotal
        iva: 0, // IVA
        discount: 0, // Descuento
    });

    const [userDetails, setUserDetails] = useState({
        idPadre: 0,
        idRol: 0
    });

    const [selectedUser, setSelectedUser] = useState(null); 
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
                            rol: user.rolId,
                            parentFullName: `${user.nombreUsuario} ${user.apellidosUsuario}`,
                            parentID: user.cedulaUsuario,
                            phone: user.telefonoUsuario || '',
                            address: user.direccionUsuario || '',
                            
                        }));

                        // Llamada para obtener los datos del usuario con el idUsuario del padre
                        const usuarioResponse = await fetch(`https://localhost:44369/Usuarios/BuscarUsuarios/${user.idUsuario}`);

                        if (!usuarioResponse.ok) {
                            throw new Error('No se pudo obtener los datos del usuario');
                        }

                        const usuarioData = await usuarioResponse.json();

                        // Verificar si la respuesta de la API contiene los niños
                        if (usuarioData && usuarioData.alumnos && usuarioData.alumnos.length > 0) {
                            setChildrenList(usuarioData.alumnos); // Establecer los niños asociados
                        } else {
                            setChildrenList([]); // Limpiar la lista si no hay niños
                        }
                    }
                    // Si el rol es 1 (Administrador), usar los usuarios de la API
                    else if (user.rolId === 1) {
                        await fetchUsers();

                        const usuarioEncontrado = userList.find(
                            (usuario) => usuario.id === user.idUsuario
                        );

                        // Si el usuario se encuentra, cargar los datos de los alumnos
                        if (usuarioEncontrado) {
                            if (usuarioEncontrado.idUsuario === user.idUsuario) {
                                const alumnosResponse = await fetch(`https://localhost:44369/alumnos/${user.idUsuario}`);
                                const alumnos = await alumnosResponse.json();
                                setChildrenList(alumnos || []);
                            } else {
                                setChildrenList([]);
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
    }, [user]); // Dependencia solo de `user` para evitar la carga infinita


    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('https://localhost:44369/Usuarios/ObtenerUsuarios');
            const formattedUsers = data
                .filter((usuario) => usuario.rolId === 3)
                .map((usuario) => ({
                    id: usuario.idUsuario,
                    rol: usuario.rolId,
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

            // Obtener idUsuario y idRol
            const idPadre = selectedUser.id;
            const idRol = selectedUser.rol;  // Suponiendo que el rol está guardado como 'rolId' en el objeto 'selectedUser'

            // Aquí podrías hacer algo con esos valores si los necesitas, por ejemplo:
            console.log('ID Padre:', idPadre);
            console.log('ID Rol:', idRol);
            

            // Si necesitas guardarlos en el estado o hacer alguna otra acción con ellos, puedes hacerlo aquí.
            // Ejemplo:
            setUserDetails({
                idPadre,
                idRol
            });
            // Guardar el usuario seleccionado
            setSelectedUser(selectedUser); // Esto asegura que tienes acceso al usuario seleccionado
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

    const validatePaymentProof = (file) => {
        if (!file) {
            throw new Error('Por favor seleccione un comprobante de pago.');
        }
        if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
            throw new Error('Formato no permitido. Use JPG, PNG o PDF');
        }
        if (file.size > 10 * 1024 * 1024) {  // 10MB máximo
            throw new Error('El archivo excede el tamaño máximo de 10MB.');
        }
        return true;
    };

    //Envia datos
    const handleSubmit = async (e) => {
        e.preventDefault();
        ////if (!formData.selectedChildren.length) {
        ////    setError('Debes seleccionar al menos un niño para matricular.');
        ////    return;
        ////}
        ////if (!formData.proofOfPayment) {
        ////    setError('Debes agregar un comprobante de pago.');
        ////    return;
        ////}


        //// Validar el comprobante de pago antes de enviarlo
        //try {
        //    validatePaymentProof(formData.proofOfPayment);
        //} catch (error) {
        //    setError(error.message);
        //    return;
        //}

        // Preparar los detalles de la matrícula (productos, monto, días)
        const detalles = selectedProductos.map((productoId) => {
            const producto = [...productosFijos, ...productosMensuales].find(
                (p) => p.idProducto === productoId
            );
            return {
                productoId: producto.idProducto,
                alumnoId: formData.selectedChildren[0], // Asumiendo que seleccionas un niño
                monto: producto.monto,
                dias: producto.nombreProducto, // Suponiendo que el periodo se utiliza para los días
            };
        });

        const dataToSend = {
            ...(user.rolId === 3 && { clienteId: user.idUsuario, rollId: user.rolId }),
            ...(user.rolId === 1 && { clienteId: userDetails.idPadre, rollId: userDetails.idRol }),
            //clienteId: user.idUsuario,
            //rollId:  user.rolId,
            metodoPago: formData.paymentMethod,
            /*imagenPago: formData.proofOfPayment,*/
            imagenPago: 'Prueba',
            fecha: new Date().toISOString(),
            referencia: formData.referenceNumber, // Número de referencia
            subtotal: formData.subtotal,
            iva: formData.iva,
            descuento: formData.discount, // Descuento
            total: formData.totalAmount,
            detalles: detalles,
        };

        console.log("Datos a enviar:", dataToSend);

        // Enviar datos al backend
        try {
            const response = await axios.post('https://localhost:44369/EncabezadoFactura/CrearMatricula', dataToSend);
            console.log('Respuesta del servidor:', response.dataToSend);
            console.log('Matrícula creada con éxito');
        } catch (error) {
            console.error('Error al crear matrícula:', error.response?.dataToSend || error.message);
        }
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
                                    {formData.paymentMethod !== 'Efectivo' && (
                                        <>
                                            <label>Número de Referencia del Comprobante:</label>
                                            <input
                                                type="text"
                                                name="referenceNumber"
                                                value={formData.referenceNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </>
                                    )}
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
                        <button type="button" onClick={() => (window.location.href = '/main')}>
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
        {formData.paymentMethod !== 'Efectivo' && (
            <div className="proof-of-payment">
                <label>Agregar comprobante de pago:</label>
                <input type="file" onChange={handleFileChange} />
            </div>
        )}
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

const handleChildSelection = (idAlumno) => {
    setSelectedChildren((prevSelectedChildren) => {
        if (prevSelectedChildren.includes(idAlumno)) {
            // El niño ya está seleccionado, eliminarlo
            return prevSelectedChildren.filter((id) => id !== idAlumno);
        } else {
            // El niño no está seleccionado, agregarlo
            return [...prevSelectedChildren, idAlumno];
        }
    });
};

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
                                checked={selectedChildren.includes(child.idAlumno)} // Asegúrate de que selectedChildren sea un array
                                onChange={() => handleChildSelection(child.idAlumno)} // Llama a la función para manejar la selección
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

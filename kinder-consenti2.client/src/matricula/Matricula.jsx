import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../axios';
import './matricula.css';
import { useUser } from '../UserContext';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

const Matricula = () => {
    const navigate = useNavigate();
    const { user, usuario } = useUser();
    const [formData, setFormData] = useState({
        parentID: 0,
        nombreUsuario: '',
        apellidosUsuario: '',
        cedulaUsuario: '',
        telefonoUsuario: '',
        correoUsuario: '',
        totalAmount: 0,
        selectedChildren: [],
        period: '',
        paymentMethod: '',
        proofOfPayment: '',
        lastEnrollmentDate: null,
        date: new Date().toISOString(), // Fecha actual
        referenceNumber: '', // Número de referencia del comprobante
        subtotal: 0, // Subtotal
        iva: 0, // IVA
        discount: 0, // Descuento
    });

    
    const handleCancel = () => {
        // Redirige a la página principal
        navigate('/main');
    };

    const [userDetails, setUserDetails] = useState({
        idPadre: 0,
        idRol: 0
    });


    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageError, setImageError] = useState('');
    const fileInputRef = useState(null);

    const IMAGE_PATH = '/FotosPagos/';
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
            selectedChildren: [childId], // Solo se permite un único niño seleccionado
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
        setSelectedProductos([productoId]); // Reemplaza cualquier selección previa con el nuevo ID
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

    const validateImage = (file) => {
        if (!file) throw new Error('Por favor seleccione un archivo válido.');
        if (!ALLOWED_FILE_TYPES.includes(file.type)) throw new Error('Formato no permitido. Use JPG, PNG o PDF.');
        if (file.size > MAX_FILE_SIZE) throw new Error('El archivo excede el tamaño máximo de 5MB.');
        return true;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageError('');

        try {
            if (validateImage(file)) {
                setSelectedFile(file);
                // Crear URL temporal para vista previa
                const previewURL = URL.createObjectURL(file);
                setPreviewUrl(previewURL);
            }
        } catch (error) {
            setImageError(error.message);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    //Envia datos
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificación del archivo de pago solo si el método no es "Efectivo"
        if (formData.paymentMethod !== 'Efectivo' && !selectedFile) {
            console.error("No se ha seleccionado ningún archivo.");
            toast.error("Por favor, selecciona un archivo de pago.");
            return;
        }
        // Validación de niños (si es necesario)
        if (!formData.selectedChildren.length) {
            toast.error('Debes seleccionar al menos un niño para matricular.');
            return;
        }
        // Validación de productos seleccionados
        if (selectedProductos.length === 0) {
            toast.error('Debes seleccionar al menos un producto.');
            return;
        }
       
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

        // Generar nombre único para la imagen de comprobante
        let imagePath = formData.paymentMethod === 'Efectivo' ? 'Pago en Efectivo' : '';
        let uniqueFileName = '';

        if (selectedFile) {
            // Generar nombre único para la imagen
            const fileExtension = selectedFile.name.split('.').pop();
            const formattedDate = new Date().toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
            uniqueFileName = `${formattedDate}_${formData.parentFullName}.${fileExtension}`;
            imagePath = `${IMAGE_PATH}${uniqueFileName}`;
        }

        const dataToSend = {
            ...(user.rolId === 3 && { clienteId: user.idUsuario, rollId: user.rolId }),
            ...(user.rolId === 1 && { clienteId: userDetails.idPadre, rollId: userDetails.idRol }),
            metodoPago: formData.paymentMethod,
            imagenPago: imagePath || 'Pago en Efectivo',  // Si no hay archivo, se envía una cadena 
            fecha: new Date().toISOString(),
            referencia: formData.referenceNumber || 0, // Número de referencia
            subtotal: formData.subtotal,
            iva: formData.iva,
            descuento: formData.discount, // Descuento
            total: formData.totalAmount,
            detalles: detalles,
        };

        console.log("Datos a enviar:", dataToSend);

        try {
            console.log('Enviando datos de matrícula:', JSON.stringify(dataToSend, null, 2));

            // Intentamos crear la matrícula primero
            const matriculaResponse = await axios.post(
                'https://localhost:44369/EncabezadoFactura/CrearMatricula',
                dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );

            if (matriculaResponse.data) {
                console.log('Matrícula registrada exitosamente:', matriculaResponse.data);
                if (user.rolId === 3) { toast.info('Matrícula enviada para validación de pago') }

                // Si el método de pago no es "Efectivo" y se ha seleccionado un archivo, proceder a enviarlo al servidor
                if (formData.paymentMethod !== 'Efectivo' && selectedFile) {
                    console.log('Subiendo imagen de pago...');
                    const imageFormData = new FormData();
                    imageFormData.append('file', selectedFile);
                    imageFormData.append('fileName', 'Comprobante_' + uniqueFileName);

                    try {
                        const imageResponse = await axios.post(
                            'https://localhost:44369/Imagenes/GuardarImagenPago',
                            imageFormData,
                            {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            }
                        );

                        if (imageResponse.status === 200) {
                            console.log('Imagen subida exitosamente:', imageResponse.data);
                            imagePath = imageResponse.data.filePath || imagePath; // Confirmamos la ruta desde el backend
                        } else {
                            setError('Error al guardar la imagen de pago');
                            console.error('Error al subir la imagen:', imageResponse);
                            return;
                        }
                    } catch (error) {
                        console.error('Error al subir la imagen:', error);
                        setError('Error al subir la imagen de pago');
                    }
                }

                if (user.rolId === 1) {
                    toast.success('¡Matrícula registrada y pago procesado con éxito!', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } else {
                setError('Error al registrar la matrícula');
                toast.error('Error al registrar la matrícula', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('Error en el proceso de matrícula y pago:', error);

            if (error.response) {
                console.error('Detalles del error:', {
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers,
                });

                if (error.response.data && error.response.data.errors) {
                    console.error('Errores de validación:', error.response.data.errors);
                }
            }

            setError('Error al realizar el proceso de matrícula y pago');
            toast.error('Error al realizar el proceso de matrícula y pago', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
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
                                    <h3>Selecciona un Padre:</h3>
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
                                <h3>Fecha Actual: {new Date().toLocaleDateString()}</h3>

                                {/* Sección de Pago */}
                                <div className="payment-section">
                                    <PaymentSection
                                        formData={formData}
                                        handleChange={handleChange}
                                        handleFileChange={handleFileChange}
                                        handleImageChange={handleImageChange}
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
                                                <option value="Mensual">Mensualidad</option>
                                                <option value="Anual">Anualidad</option>
                                            </select>
                                        </label>
                                    </div>

                                </div>


                                <div className="products-selection">
                                    <h3>Seleccionar Productos:</h3>
                                    {formData.period === 'Anual' ? (
                                        <>
                                    <h4>Anualidad:</h4>
                                    {productosFijos.map((producto) => (
                                        <div key={producto.idProducto}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    checked={selectedProductos.includes(producto.idProducto)}
                                                    onChange={() => handleProductoSelection(producto.idProducto)}
                                                    required
                                                />
                                                {producto.nombreProducto} - {producto.monto} colones
                                            </label>
                                        </div>
                                    ))}
                                        </>
                                    ) : (
                                        <>
                                
                                    <h4>Horarios:</h4>
                                    {productosMensuales.map((producto) => (
                                        <div key={producto.idProducto}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    checked={selectedProductos.includes(producto.idProducto)}
                                                    onChange={() => handleProductoSelection(producto.idProducto)}
                                                    required
                                                />
                                                {producto.nombreProducto} - {producto.monto} colones
                                            </label>
                                        </div>
                                    ))}
                                        </>
                                    )}
                                </div>
                                <label>Subtotal: {formData.subtotal}</label>
                                <label>IVA (13%): {formData.iva}</label>


                                {user.rolId === 1 && (
                                    <>
                                        <div className="decuento">
                                        <label>Descuento (%):</label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="total-amount">
                                <h4>Total a pagar: {formData.totalAmount} colones</h4>
                            </div>
                        </div>
                    </div>

                    <div className="buttons">
                        <button className="submit-m-button" type="submit">Realizar Envío</button>
                        <button className="cancel-m-button" type="button" onClick={handleCancel}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}


const PaymentSection = ({ formData, handleChange, handleImageChange, userRole }) => (
    <div className="payment-section">
        <h4>Opciones de Pago</h4>
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
                <label>Agregar comprobante de pago (JPG, PNG o PDF):</label>
                <input type="file" id="proofOfPayment"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleImageChange}
                    required />
                
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
            disabled
        />
        <label>Cédula:</label>
        <input
            type="text"
            name="parentID"
            value={formData.parentID}
            onChange={handleChange}
            disabled
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
    setSelectedChildren([idAlumno]); // Reemplaza cualquier selección previa con el nuevo ID
};

const ChildrenSelection = ({ childrenList, selectedChildren, handleChildSelection }) => {
    console.log('childrenList:', childrenList); // Verifica el contenido de childrenList

    return (
        <div className="children-selection">
            <h3>Seleccionar Niño:</h3>
            {childrenList.length > 0 ? (
                childrenList.map((child) => (
                    <div key={child.idAlumno}>
                        <label>
                            <input
                                type="radio"
                                checked={selectedChildren.includes(child.idAlumno)} // Asegúrate de que selectedChildren sea un array
                                onChange={() => handleChildSelection(child.idAlumno)} // Llama a la función para manejar la selección
                            />
                            {`${child.nombreAlumno} ${child.apellidosAlumno}`}
                        </label>
                    </div>
                ))
            ) : (
                    <p>Se debe seleccionar un padre.</p>
                    // Se muestra este mensaje si childrenList está vacío
            )}
        </div>
    );
};

export default Matricula;

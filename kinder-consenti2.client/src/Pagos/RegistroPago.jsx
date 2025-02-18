// PaymentRegistrationForm.jsx
import { useState, useEffect } from 'react';
import './RegistroPago.css';
import Navbar from '../componentes/navbar';
import Sidebar from '../componentes/Sidebar';
import Footer from '../componentes/footer';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserContext } from '../UserContext'; // Importar el hook del contexto
import { faUser, faCalendar, faIdCard, faVenusMars, faHome, faInfoCircle, faCamera, faUserShield, faPhone } from '@fortawesome/free-solid-svg-icons';




import { DetallesApagar, BuscarUsuarios, ObtenerPadres, GuardarImagenPago, CrearPago } from '../apiClient'; // Importar las funciones desde apiClient.js

//import axios from '../../../node_modules/axios/index';



const RegistroPago = () => {

    const { user } = useUserContext();
    const [usuario, setUsuario] = useState([]);
    const [detallesTemp, setDetallesTemp] = useState([]);
    const [mensaje, setMensaje] = useState([]);
    const [usuarioSelect, setUsuarioSelect] = useState({
        idUsuario: 0,
        rolId: 0,
        nombreUsuario: '',
        apellidosUsuario: '',
        cedulaUsuario: '',
        referencia: '',
    });

    const [errorMessages, setErrorMessages] = useState({
        idUsuario: '',
        rolId: '',
        nombreUsuario: '',
        apellidosUsuario: '',
        cedulaUsuario: '',
        referencia: '',
    });

    const [pago, setPago] = useState({
        clienteId: 0,
        rollId: 0,
        fecha: new Date().toISOString(),
        metodoPago: '',
        imagenPago: '/FotosPagos/default.jpg',
        referencia: '0',
        subtotal: 0,
        descuento: 0,
        iva: 0.13,
        total: 0,
        detalles: detallesTemp,
    });

    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    //---------------------------------------------------------------------------
    const [isValid, setIsValid] = useState(true);
    const fileInputRef = useState(null);
    const [imageError, setImageError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [nombreUnico, setNombreUnico] = useState('default.jpg');
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const IMAGE_PATH = '/FotosPagos/';

    const limpiarDatos = () => {

        setSelectedCheckbox(null);
        setIsValid(true);

        setPago({
            clienteId: 0,
            rollId: 0,
            fecha: new Date().toISOString(),
            metodoPago: '',
            imagenPago: '/FotosPagos/default.jpg',
            referencia: '0',
            subtotal: 0,
            descuento: 0,
            iva: 0.13,
            total: 0,
            detalles: [],
        });

        setUsuarioSelect({
            idUsuario: 0,
            rolId: 0,
            nombreUsuario: '',
            apellidosUsuario: '',
            cedulaUsuario: '',
            referencia: '',
        });

        setDetallesTemp([]);
        setSelectedFile(null);
        setPreviewUrl('');
        fileInputRef.current.value = '';

        setNombreUnico('default.jpg');
    };

    const validateImage = (file) => {
        if (!file) {
            throw new Error('Por favor seleccione una imagen');
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            throw new Error('Formato no permitido. Use JPG, PNG');
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error('La imagen excede el tamaño máximo de 5MB');
        }
        return true;
    };
    async function cargarDatos() {
        try {
            if (user.rolId == 3) {
                const usuarioResponse = await BuscarUsuarios(user.idUsuario);
                setUsuarioSelect(() => ({
                    ...usuarioSelect,
                    idUsuario: usuarioResponse.data.idUsuario,
                    rolId: usuarioResponse.data.rolId,
                    nombreUsuario: usuarioResponse.data.nombreUsuario,
                    apellidosUsuario: usuarioResponse.data.apellidosUsuario,
                    cedulaUsuario: usuarioResponse.data.cedulaUsuario,
                    referencia: 0,
                }));

            }
            else if (user.rolId == 1) {
                const usuarioResponse = await ObtenerPadres();
                setUsuario(usuarioResponse.data);
            }

        } catch (error) {
            console.error('Error al cargar los datos :', error.usuarioResponse);
            alert('Error al cargar los datos :', error.usuarioResponse);
        }
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    const sumarPrecios = (array) => {
        return array.reduce((acumulador, producto) => acumulador + producto.monto, 0);
    };

    const cargarDetalles = async () => {
        try {
            if (usuarioSelect.idUsuario != 0) {
                //const detallesResponse = await fetch(`api/DetallesApagar/${usuarioSelect.idUsuario}`);
                const detallesResponse = await DetallesApagar(usuarioSelect.idUsuario);
                //console.log(detallesResponse);

                if (detallesResponse.status == 200) {
                    setDetallesTemp(detallesResponse.data);
                    console.log(detallesTemp);
                    setMensaje('');
                } else {
                    setDetallesTemp([]);
                    setMensaje(detallesResponse);
                }
                setPago({
                    ...pago,
                    clienteId: usuarioSelect.idUsuario,
                    rollId: user.rolId,
                    subtotal: 0,
                    total: 0,
                    detalles: []
                });
            }
            else {
                setDetallesTemp([]);
                setMensaje('');
            }
        } catch (error) {
            console.error('Error al cargar los datos :', error);
        }
    }

    useEffect(() => {
        let numControl = (detallesTemp.length);
        if (numControl == 0) {
            setPago({
                ...pago,
                detalles: []
            });
        }
        else {
            setPago({
                ...pago,
                subtotal: sumarPrecios(detallesTemp),
                total: sumarPrecios(detallesTemp) + (sumarPrecios(detallesTemp) * pago.iva),
                detalles: detallesTemp
            });
        }
    }, [detallesTemp]);

    useEffect(() => {
        cargarDetalles();

    }, [usuarioSelect]);

    const handleUserSelect = (id) => {
        const usSelect = usuario.find((user) => user.idUsuario === parseInt(id));
        if (usSelect) {
            setUsuarioSelect(() => ({
                idUsuario: usSelect.idUsuario,
                rolId: usSelect.rolId,
                nombreUsuario: usSelect.nombreUsuario,
                apellidosUsuario: usSelect.apellidosUsuario,
                cedulaUsuario: usSelect.cedulaUsuario,
                referencia: '',
            }));

            setErrorMessages(() => ({
                idUsuario: '',
                rolId: '',
                nombreUsuario: '',
                apellidosUsuario: '',
                cedulaUsuario: '',
                referencia: '',
            }));
        }
    }

    const validacionDatos = () => {
        let Valid = true;
        let errors = {};
        for (let key in usuarioSelect) {
            if (!usuarioSelect[key]) {
                if (key == "referencia") {
                    if (pago.metodoPago == "Efectivo") {
                        errors[key] = '';
                    } else {
                        errors[key] = `Por favor, completa el campo ${key}.`;
                        Valid = false;
                    }
                } else {
                    errors[key] = `Por favor, completa el campo ${key}.`;
                    Valid = false;
                }
            }
        }
        setErrorMessages(errors);
        return Valid;
    }


    const columns = [
        {
            name: 'Producto',
            selector: (row) => row.producto.nombreProducto,
            sortable: true,
        },
        {
            name: 'Alumno',
            selector: (row) => row.alumno.nombreAlumno,
            sortable: true,
        },
        {
            name: 'Monto',
            selector: (row) => "¢" + row.monto,
            sortable: true,
        }
    ];


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (value != '') {
            setPago({ ...pago, [name]: value });
        } else {
            setPago({ ...pago, [name]: '0' });
        }
        if ([name] == "referencia") {
            setUsuarioSelect({ ...usuarioSelect, referencia: value });
        }

    };


    const handleCheckboxChange = (index, label) => {
        if (selectedCheckbox == index) {
            setSelectedCheckbox(null);
            setPago({
                ...pago,
                metodoPago: '',
            });
        } else {
            setSelectedCheckbox(index);
            setPago({
                ...pago,
                metodoPago: label,
            });
        }

        if (index == 0) {
            setUsuarioSelect({...usuarioSelect,referencia:'',});
        }
        setIsValid(true);
    }


    //------------------------------------combio en la imagen------------------------------------------------
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageError('');
        try {
            if (validateImage(file)) {
                setSelectedFile(file);
                // Crear URL temporal para vista previa
                //const previewURL = URL.createObjectURL(file);
                setPreviewUrl(URL.createObjectURL(file));
            }

        } catch (error) {
            setImageError(error.message);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    //------------------------------------------------------------------------------------------------------
    //2********
    useEffect(() => {
        setPago({
            ...pago,
            imagenPago: `${IMAGE_PATH}${nombreUnico}`
        });
    }, [nombreUnico]);

    //1*********

    useEffect(() => {
        if (selectedFile) {
            // Generar nombre único para la imagen
            const fileExtension = selectedFile.name.split('.').pop();
            setNombreUnico(`${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`);
        }
        else {
            setNombreUnico('default.jpg');
        }
    }, [selectedFile]);

    // ---------------------------------------envio de datos-------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validacionDatos()) {
            if (selectedCheckbox === null) {
                setIsValid(false);
            } else { // Lógica para enviar el formulario o realizar la acción deseada 
                console.log(pago);
                //alert(`Aqui se envian los datosa la BD`);
                envioDatos();
            }
        }
    };
    //-----------------------------------------------------------------------------------------------------------------

    const envioDatos = async () => {
        try {

            const response = await CrearPago(pago);
            /*
            const response = await axios.post('api/CrearPago', pago, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            */

            console.log(response);
            if (response.data && selectedFile) {
                // Creamos FormData para enviar la imagen
                const imageFormData = new FormData();
                imageFormData.append('file', selectedFile);
                imageFormData.append('fileName', nombreUnico); // Enviamos el nombre generado

                // Enviamos la imagen al servidor
                const imageResponse = await GuardarImagenPago(imageFormData);
                /*
                const imageResponse = await axios.post('api/GuardarImagenPago', imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                */
                console.log(imageResponse);
                limpiarDatos();

            }


        } catch (error) {
            console.error("Error Insentardo los datos: ", error);
            if (error.response) {
                console.error("Error details:", {
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers
                });
                if (error.response.data && error.response.data.errors) {
                    console.error("Validation errors:", error.response.data.errors);
                }
            }
        }
    }

    //--------------------------------------------------------------------------------------------------------------------------


    return (
        <div>

            {< Navbar />}
            <div className="content-container">
                {<Sidebar />}

                <main className="main-content">
                    {/* Formulario */}

                    <div className="form-card">


                        <form onSubmit={handleSubmit} >

                            <div className="inline1">

                                <div className="form-group">

                                    { /* Dropdown*/}
                                    {user.rolId === 1 && (
                                        <div >
                                            <label>Usuario</label>
                                            <select
                                                name="clienteId"
                                                value={usuarioSelect.idUsuario}
                                                //onChange={manejarCambioUsuario}
                                                onChange={(e) => handleUserSelect(e.target.value)}
                                                required
                                            >
                                                <option key="0" value="0"> Seleccione una persona</option>
                                                {
                                                    usuario.map((us) => (
                                                        <option key={us.idUsuario} value={us.idUsuario}>
                                                            {us.nombreUsuario}
                                                        </option>
                                                    ))}
                                            </select>

                                        </div>
                                    )}
                                    { /* Dropdown*/}

                                    <div style={{ display: 'none' }}>
                                        <input type="text" name="rollId"
                                            value={usuarioSelect.rollId}
                                            disabled />
                                    </div>

                                    {user.rolId === 3 && (
                                        <div >
                                            <label>Nombre:</label>
                                            <input type="text" value={usuarioSelect.nombreUsuario} disabled required />
                                        </div>
                                    )}


                                    <div >
                                        <label>Apellido:</label>
                                        <input type="text" value={usuarioSelect.apellidosUsuario} disabled required />
                                        {errorMessages.apellidosUsuario && <div style={{ color: 'red' }}>{errorMessages.apellidosUsuario}</div>}
                                    </div>

                                    <div >
                                        <label>Cédula:</label>
                                        <input type="text" value={usuarioSelect.cedulaUsuario} disabled required />
                                        {errorMessages.cedulaUsuario && <div style={{ color: 'red' }}>{errorMessages.cedulaUsuario}</div>}
                                    </div>

                                    <div >
                                        <label># de referencia:</label>
                                        <input type="number"
                                            name="referencia"
                                            value={usuarioSelect.referencia}
                                            required
                                            onChange={handleInputChange}
                                        />
                                        {errorMessages.referencia && <div style={{ color: 'red' }}>{errorMessages.referencia}</div>}
                                    </div>
                                </div>

                            </div>

                            <div className="inline2">
                                <div className="inline2">
                                    { /*Partirlo*/}
                                    <div className="contenLabel">
                                        <label className="labelCheck">Tipo de Pago</label>
                                        {['Efectivo', 'SINPE MOVIL', 'Transferencia'].map((label, index) => (
                                            <div key={index} className="inputsOrder">
                                                <label className="check" key={index}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCheckbox === index}
                                                        onChange={() => handleCheckboxChange(index, label)}
                                                    />
                                                    {label}

                                                </label>
                                                <br />
                                            </div>
                                        ))}
                                        {!isValid && <p style={{ color: 'red' }}>Debe seleccionar al menos una opción.</p>}
                                    </div>
                                    {/*-----------------------------------------------------------------------------*/}
                                </div>
                                <div className="inline2">
                                    <div className="form-group">
                                        <label>Subtotal:</label>
                                        <input type="text" name="subtotal" value={pago.subtotal} disabled />
                                        <label>Total:</label>
                                        <input type="text" name="subtotal" value={pago.total} disabled />
                                    </div>


                                </div>
                                <div>
                                    <DataTable
                                        columns={columns}
                                        data={detallesTemp}
                                        noDataComponent={mensaje}
                                        highlightOnHover
                                        responsive
                                    />
                                </div>
                            </div>

                            {/*-----------------------------------------------------------------------------*/}

                            <div className="inline">
                                <div className="alumno-form-group">
                                    <label className="alumno-label">Foto del la transaccion</label>
                                    <div className="alumno-input-container">
                                        <FontAwesomeIcon icon={faCamera} className="alumno-input-icon" />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept=".jpg,.jpeg,.png"
                                            className="alumno-input"
                                        />
                                    </div>
                                    {previewUrl && (
                                        <div className="image-preview-container">
                                            <img
                                                src={previewUrl}
                                                alt="Vista previa"
                                                className="image-preview"
                                                style={{ maxWidth: '200px', marginTop: '10px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreviewUrl('');
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                className="remove-image-btn"                                    >
                                                Eliminar imagen
                                            </button>
                                        </div>
                                    )}
                                    {imageError && (
                                        <div className="error-message" style={{ color: 'red', marginTop: '5px' }}>
                                            {imageError}
                                        </div>
                                    )}
                                    <div className="image-info"
                                        style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                        Formatos permitidos: JPG, PNG. Tamano maximo: 5MB
                                    </div>
                                </div>

                            </div>
                            <div className="button-group">
                                <button type="submit" className="btn-submit" onClick={handleSubmit}>Enviar</button>
                                <button type="button" className="btn-submit" onClick={limpiarDatos}>Limpiar</button>
                                <button type="button" className="btn-cancel">Cancelar</button>
                            </div>
                        </form>
                    </div>

                </main>
            </div>

            {<Footer />}
        </div>

    );
};

export default RegistroPago;
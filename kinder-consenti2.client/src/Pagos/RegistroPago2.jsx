// PaymentRegistrationForm.jsx
import { useState, useEffect } from 'react';
import './RegistroPago.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faIdCard, faVenusMars, faHome, faInfoCircle, faCamera, faUserShield, faPhone } from '@fortawesome/free-solid-svg-icons';

//import axios from '../../../node_modules/axios/index';
import axios from '../axios';


const RegistroPago = () => {

    const [usuario, setUsuario] = useState([]);
    const [detallesTemp, setDetallesTemp] = useState([]);
    const [mensaje, setMensaje] = useState([]);
    const [usuarioSelect, setUsuarioSelect] = useState({
        idUsuario: 0,
        rolId: 0,
        nombreUsuario: '',
        apellidosUsuario: '',
        cedulaUsuario: ''
    });

    const [pago, setPago] = useState({
        clienteId: 0,
        rolId: 0,
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

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const usuarioResponse = await axios.get('https://localhost:44369/Usuarios/ObtenerPadres');
                setUsuario(usuarioResponse.data);
            } catch (error) {
                console.error('Error al cargar los datos :', error);
            }
        }
        cargarDatos();
    }, []);

    const sumarPrecios = (array) => {
        return array.reduce((acumulador, producto) => acumulador + producto.monto, 0);
    };

    const cargarDetalles = async () => {
        try {
            if (usuarioSelect.idUsuario != 0) {
                const detallesResponse = await fetch(`https://localhost:44369/DetalleFactura/DetallesApagar/${usuarioSelect.idUsuario}`);
                //console.log(detallesResponse);

                if (detallesResponse.ok) {
                    setDetallesTemp(await detallesResponse.json());
                    setMensaje('');
                } else {
                    setDetallesTemp([]);
                    setMensaje((await detallesResponse.text()).toString());
                }
                setPago({
                    ...pago,
                    clienteId: usuarioSelect.idUsuario,
                    rolId: usuarioSelect.rolId,
                    subtotal: 0,
                    total: 0,
                    detalles: []
                });
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
            }));
        }
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

    //const enviarDatos = () => { console.log(pago); }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (value != '') {            
            setPago({ ...pago, [name]: value });
        } else {
            setPago({ ...pago, [name]: '0' });
        }
        
    };


    const handleCheckboxChange = (index, label) => {
        setSelectedCheckbox(index);
        setPago({
            ...pago,
            metodoPago: label
        });
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

    //------------------------------------------------------------------------------------------------------
    //2********
    useEffect(() => {       
        console.log(pago.imagenPago);
        setPago({
            ...pago,
            imagenPago: `${IMAGE_PATH}${nombreUnico}`
        });
        console.log(nombreUnico);
        console.log(pago.imagenPago);
    }, [nombreUnico]);



    //1*********

    useEffect(() => {
        //let imagePath = `${IMAGE_PATH}` + 'default.jpg';
        //let uniqueFileName = '';

        if (selectedFile) {
            // Generar nombre único para la imagen
            const fileExtension = selectedFile.name.split('.').pop();
            setNombreUnico(`${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`);
            //uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
            console.log("Ojo");
            console.log(nombreUnico);
            //imagePath = `${IMAGE_PATH}${nombreUnico}`;
        }
        else {
            setNombreUnico('default.jpg');
        }
    },[selectedFile]);

    // ---------------------------------------envio de datos-------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedCheckbox === null) {
            setIsValid(false);

        } else { // Lógica para enviar el formulario o realizar la acción deseada 
            alert(`Aqui se envian los datosa la BD`);
            /*
            let imagePath = `${IMAGE_PATH}` + 'default.jpg';
            //let uniqueFileName = '';

            if (selectedFile != null) {
                // Generar nombre único para la imagen
                const fileExtension = selectedFile.name.split('.').pop();
                setNombreUnico(`${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`);
                //uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
                imagePath = `${IMAGE_PATH}${nombreUnico}`;
                setPago({
                    ...pago,
                    imagenPago: imagePath
                });
            } else {
                setPago({
                    ...pago,
                    imagenPago: imagePath
                });
            }
            */
            envioDatos();
        }
    };
    //-----------------------------------------------------------------------------------------------------------------

    const envioDatos = async () => {
        try {
            //console.log('Sending payload:', JSON.stringify(pago, null, 2));
            const response = await axios.post('https://localhost:44369/EncabezadoFactura/CrearPago', pago, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.data && selectedFile) {
                // Creamos FormData para enviar la imagen
                const imageFormData = new FormData();
                imageFormData.append('file', selectedFile);
                imageFormData.append('fileName', nombreUnico); // Enviamos el nombre generado

                // Enviamos la imagen al servidor
                const imageResponse = await axios.post('https://localhost:44369/Imagenes/GuardarImagenPago', imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert(imageResponse.message.toString);
            }
        } catch (error) {
            console.error("Error saving alumno:", error);
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
            <div className="fondo">
                {< Navbar />}

                {/* Formulario */}
                <div className="form-card">
                    <h2>Registro de pago</h2>

                    <form onSubmit={handleSubmit} >
                        { /* Dropdown*/}
                        <label>Usuario</label>
                        <select
                            name="clienteId"
                            value={usuarioSelect.idUsuario}
                            //onChange={manejarCambioUsuario}
                            onChange={(e) => handleUserSelect(e.target.value)}
                            required
                        >
                            <option value=""> Seleccione una persona</option>
                            {
                                usuario.map((us) => (
                                    <option key={us.idUsuario} value={us.idUsuario}>
                                        {us.nombreUsuario}
                                    </option>
                                ))}
                        </select>
                        { /* Dropdown*/}
                        <div className="form-group" style={{ display: 'none' }}>
                            <input type="text" name="rolId"
                                value={usuarioSelect.rolId}
                                disabled />
                        </div>

                        <div className="form-group" >
                            <label>Apellido:</label>
                            <input type="text" value={usuarioSelect.apellidosUsuario} disabled />
                        </div>

                        <div className="form-group">
                            <label>Cédula:</label>
                            <input type="text" value={usuarioSelect.cedulaUsuario} disabled />
                        </div>

                        <div className="form-group">
                            <label># de referencia:</label>
                            <input type="number"
                                name="referencia"
                                value={usuarioSelect.referencia}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            {['Efectivo', 'Simpe', 'Transferencia'].map((label, index) => (
                                <label key={index}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCheckbox === index}
                                        onChange={() => handleCheckboxChange(index, label)}
                                    />
                                    {label}
                                </label>
                            ))}
                            {!isValid && <p style={{ color: 'red' }}>Debe seleccionar al menos una opción.</p>}
                        </div>


                        <div className="form-group">

                            <label>Subtotal:</label>
                            <input type="text" name="subtotal" value={pago.subtotal} disabled />
                            <label>Total:</label>
                            <input type="text" name="subtotal" value={pago.total} disabled />
                        </div>

                        {/*-----------------------------------------------------------------------------*/}
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
                                        className="remove-image-btn"
                                    >
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
                        {/*-----------------------------------------------------------------------------*/}

                        <DataTable
                            columns={columns}
                            data={detallesTemp}
                            noDataComponent={mensaje}
                            highlightOnHover
                            responsive
                        />

                        {/*
                            <div className="form-group">
                            <label>Subir factura de pago (Solo PDF):</label>
                            <div className="file-input-wrapper">
                                <input type="file" id="file-input" accept=".pdf" />
                                <label htmlFor="file-input" className="file-label">
                                    Seleccionar archivo
                                </label>
                            </div>
                        </div>           
                        
                        */ }

                        <div className="button-group">
                            <button type="submit" className="btn-submit" onClick={handleSubmit}>Enviar</button>
                            <button type="button" className="btn-cancel">Cancelar</button>
                        </div>
                    </form>
                </div>

                {/*<Footer />*/}
            </div>
        </div>

    );
};

export default RegistroPago;
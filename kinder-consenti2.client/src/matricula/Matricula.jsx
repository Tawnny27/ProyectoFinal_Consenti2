import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './matricula.css';
import { Confirmacion } from './Confirmacion';
import { useUserContext } from '../UserContext';
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { ObtenerPadres, BuscarUsuarios, ObtenerProductosfijos, ObtenerProductosMensuales, CrearMatricula, } from '../apiClient'; // Importar las funciones desde apiClient.js

export const Matricula = () => {

    const { user } = useUserContext();
    const [loading, setLoading] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [opciones, setOpciones] = useState([]);
    const fileInputRef = useState(null);
    const [imageError, setImageError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [seleccionPadre, setSeleccionPadre] = useState(null);
    const [disabledRef, setDisableRef] = useState(true);
    const [total, setTotal] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [pago, setPago] = useState("");
    const [imgPago, setImgPago] = useState("");
    const [ref, setRef] = useState(null);
    const [envio, setEnvio] = useState(false);
    const [checkVisible, setCheckVisible] = useState(false);
    const [usSelect, setUsSelect] = useState({});
    const [hijoSelect, setHijoSelect] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [fijos, setFijos] = useState([]);
    const [mensuales, setMensuales] = useState([]);
    const [registrosTemp, setRegistrosTemp] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [mesajePago, setMesajePago] = useState(false);
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [selectedPagoCheckbox, setSelectedPagoCheckbox] = useState(null);
    const [matricula, setMatricula] = useState({});
    const [tiposPago, setTiposPago] = useState([]);
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


    const setearMatricula = () => {
        setMatricula(
            {
                "clienteId": 0,
                "rollId": user.rolId,
                "fecha": new Date().toISOString(),
                "metodoPago": "",
                "imagenPago": "",
                "referencia": null,
                "subtotal": 0,
                "descuento": 0,
                "iva": 0,
                "total": 0,
                "detalles": []
            }
        );
    }

    const reset = () => {
        if (opciones.length>0) {
            setUsSelect({});
        }        
        setHijoSelect({});
        setCheckVisible(false);
        setEnvio(false);
        setRegistrosTemp([]);
        setRegistros([]);
        setSelectedCheckbox(null);       
        setSelectedPagoCheckbox(null);
        setSeleccionPadre(null);
        eliminaImagen();
        setMesajePago(false);
        setDisableRef(true);
        setRef(null);
        setearMatricula();
    }

    const cargarPadre = async () => {
        if (user.rolId == 1) {
            const response = await ObtenerPadres();
            if (response.status == 200) {
                setUsuarios(response.data);

                const datosTransformados = response.data.map((item) => ({
                    value: item.idUsuario, // Valor interno
                    label: item.nombreUsuario + " " + item.apellidosUsuario, // Texto visible
                }));
                setOpciones(datosTransformados);

            } else {
                setUsuarios([]);
            }
        } else if (user.rolId == 3) {
            const response = await BuscarUsuarios(user.idUsuario);
            if (response.status == 200) {
                setUsSelect(response.data);
            } else {
                setUsSelect({});
            }
        }
    }

    const cargarFijos = async () => {
        const response = await ObtenerProductosfijos();
        if (response.status == 200) {
            setFijos(response.data);
        }
    }

    const cargarMensuales = async () => {
        const response = await ObtenerProductosMensuales();
        if (response.status == 200) {
            setMensuales(response.data);
        }
    }

    const handleUseSelectOP = (opcion) => {
        setSeleccionPadre(opcion);
        if (opcion.value != 0) {
            setUsSelect(usuarios.find((us) =>
                us.idUsuario === parseInt(opcion.value)
            ));
        } else {
            setUsSelect({});
        }
        setHijoSelect({});
        setCheckVisible(false);
        setEnvio(false);
        setRegistrosTemp([]);
        setRegistros([]);
        setSelectedCheckbox(null);
        setMesajePago(false);
        setSelectedPagoCheckbox(null);
    }

    const addFijos = (idHijo) => {
        const detalle = [];
        fijos.map(pr =>
            detalle.push(
                {
                    "productoId": pr.idProducto,
                    "alumnoId": parseInt(idHijo),
                    "monto": pr.monto,
                    "dias": ""
                },
            ));
        setRegistrosTemp(detalle);
    }

    const addHorario = (idHorario, idHijo) => {

        let horario = mensuales.find(pr => pr.idProducto === idHorario);
        const detalle = {
            "productoId": horario.idProducto,
            "alumnoId": parseInt(idHijo),
            "monto": horario.monto,
            "dias": ""
        };
        setRegistrosTemp((prevRegistros) => [...prevRegistros, detalle]);
    }

    const handleCheckboxChange = (index, idHorario, idHijo) => {
        setSelectedCheckbox(index);
        addFijos(idHijo);
        addHorario(idHorario, idHijo);
        setEnvio(true);
    }

    const handleSelectAlumno = (idHijo) => {
        if (idHijo != 0) {
            setHijoSelect(usSelect.alumnos.find(hi =>
                hi.idAlumno === parseInt(idHijo)
            ));
            setCheckVisible(true);
            setSelectedCheckbox(null);
            setEnvio(false);
        } else {
            setHijoSelect({});
            setCheckVisible(false);
            setEnvio(false);
            setRegistrosTemp([]);
            setSelectedCheckbox(null);
        }
    }

    const addDetalle = () => {
        const validar = registros.filter(item => item.alumnoId === parseInt(hijoSelect.idAlumno));
        if (validar.length === 0) {
            setRegistros((prevRegistros) => [...prevRegistros, ...registrosTemp]);
        } else {
            toast.error("Este Niño ya fue ingresado");
            console.log(registros);
        }
        setEnvio(false);
        setHijoSelect({});
        setSelectedCheckbox(null);
        setCheckVisible(false);
    }

    const estilos = {
        check: {
            display: "none",
        },
    }

    const handleCheckboxPagoChange = (index, label) => {
        setSelectedPagoCheckbox(index);
        setPago(label);
        if (label == "Efectivo") {
            setDisableRef(true);
            setPreviewUrl('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setRef(null);
            setImgPago("Pago en efectivo");
        } else {
            setDisableRef(false);
            setImgPago("");
        }
        setMesajePago(false);
    }

    const handleKeyPress = (event) => {
        const charCode = event.charCode;

        // Permitir solo números (0-9)
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    };

    const handleInputChange = (e) => {
        e.target.value;
        if (e.target.value != '' && e.target.value != 0) {
            setRef(e.target.value);
        } else {
            setRef(null);
        }
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


    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };


    const base64Image = async (file) => {
        const base64 = await convertToBase64(file);
        return base64;
    }


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setImageError('');
        try {
            if (validateImage(file)) {

                let base64 = await base64Image(file);
                setImgPago(base64);
                setPreviewUrl(URL.createObjectURL(file));

            }
        } catch (error) {
            setImageError(error.message);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const eliminaImagen = () => {
        setPreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setImgPago("");
    };

    const eliminaImagenBoton = () => {
        setPreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setImgPago("");
    };

    const validacionesEnvio = () => {
        if (selectedPagoCheckbox === null) {
            setMesajePago(true);
            return false;
        } else {
            setMesajePago(false);
            if (registros.length === 0) {
                toast.error("Faltan datos favor valide");
                return false;
            }
            let refer = 0;
            if (ref != null) {
                refer = ref;
            }
            
            setMatricula(
                {
                    ...matricula,
                    "clienteId": usSelect.idUsuario,
                    "rollId": user.rolId,
                    "metodoPago": pago,
                    "imagenPago": imgPago,
                    "referencia": refer,
                    "subtotal": subtotal,
                    "descuento": 0,
                    "iva": 0.13,
                    "total": total,
                    "detalles": registros
                }
            );
            return true;
        }
    };

    const nombreAlumno = (id) => {
        return usSelect.alumnos.find(item => item.idAlumno === id).nombreAlumno;
    }
    const nombreRubro = (id) => {
        let rubros = [...fijos, ...mensuales];
        return rubros.find(item => item.idProducto === id).nombreProducto;
    }

    const envioDatos = async () => {
        setLoading(true);
        const response = await CrearMatricula(matricula);
        if (response.status === 200) {    
            console.log(matricula);
            reset();
            setLoading(false);
            toast.success(response.data);
        } else {     
            console.log(matricula);
            setLoading(false);
            toast.error(response.data);
        }
    }

    const cerrarConfirmacion = () => {
        setMostrarConfirmacion(false);
    };

    // Función para mostrar el componente de confirmación
    const ejecutarConfirmacion = () => {
        setMostrarConfirmacion(true);
    };


    // ---------------------------------------envio de datos-------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validacionesEnvio() == true) {
            ejecutarConfirmacion();
        }
    };

    //UseEffect*******************************************************

    useEffect(() => {
        cargarPadre();
        cargarFijos();
        cargarMensuales();
        setearMatricula();
        if (user.rolId === 3) {
            setTiposPago(['SINPE Movil', 'Transferencia']);
        } else {
            setTiposPago(['Efectivo', 'SINPE Movil', 'Transferencia']);
        }
        
    }, []);

    useEffect(() => {
        if (registros.length > 0) {
            let suma = 0;
            registros.map(item => suma = suma + item.monto);
            setSubtotal(suma);
            setTotal(suma + (suma * 0.13));
        } else {
            setTotal(0);
        }
    }, [registros]);


    useEffect(() => {
        console.log(registrosTemp);
        console.log(selectedPagoCheckbox);
        console.log(registros);
        console.log(hijoSelect);
        console.log(usSelect);
    }, [registrosTemp], [hijoSelect], [usSelect], [registros]);


    return (
        <div>
            {loading && <div className="overlay">En Proceso...</div>}
        <div className="content-container">
            <main className="main-content">
                <div className="content-matricula">
                    {!mostrarConfirmacion && (
                    <div className="enrollment-form">
                        <h2>Formulario de Matrícula</h2>
                        <form onSubmit={handleSubmit}>
                            {user.rolId === 1 ? (
                                <div>
                                    <label> Seleccione un Padre</label>
                                    <Select
                                        options={opciones}            // Opciones con la opción inicial incluida
                                        value={seleccionPadre}             // Valor actualmente seleccionado
                                        onChange={handleUseSelectOP}       // Ejecuta el proceso al cambiar la selección
                                        placeholder="Buscar o seleccionar..."
                                    />

                                </div>
                            ) : (
                                <div>
                                    <label> Padre</label>
                                    <input type="text" value={usSelect.nombreUsuario + " " + usSelect.apellidosUsuario} />
                                </div>
                            )}

                            {usSelect.alumnos && usSelect.alumnos.length > 0 && (
                                <div className="hijos" >
                                    <label>Hijos</label>

                                    <select
                                        value={hijoSelect.idAlumno || "0"}
                                        onChange={(e) => handleSelectAlumno(e.target.value)}
                                    >
                                        <option value="0"> Seleccione un hijo</option>
                                        {usSelect.alumnos.map((hijo) => (
                                            <option key={hijo.idAlumno} value={hijo.idAlumno}> {hijo.nombreAlumno} </option>
                                        ))}
                                    </select>

                                    <div>
                                        <label>Horarios</label>
                                        {mensuales.map((hr, index) => (
                                            <div key={index} style={{ padding: "5px" }}>
                                                <label className="check" key={index} style={!checkVisible ? estilos.check : {}} >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCheckbox === index}
                                                        onChange={() => handleCheckboxChange(index, hr.idProducto, hijoSelect.idAlumno)}
                                                    />
                                                    {hr.nombreProducto} - {hr.monto}
                                                </label>
                                                <br />
                                            </div>
                                        ))}
                                        {envio && (
                                            <button type="button" onClick={addDetalle} >Agregar</button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="contenLabel">
                                <label className="labelCheck">Tipo de Pago</label>
                                        {tiposPago.map((label, index) => (
                                    <div key={index} className="inputsOrder">
                                        <label className="check" key={index}>
                                            <input
                                                type="checkbox"
                                                checked={selectedPagoCheckbox === index}
                                                onChange={() => handleCheckboxPagoChange(index, label)}
                                            />
                                            {label}

                                        </label>
                                        <br />
                                    </div>
                                ))}
                                {mesajePago && <p style={{ color: 'red' }}>Debe seleccionar al menos una opción.</p>}
                            </div>

                            <div>
                                <label># de referencia:</label>
                                <input type="text"
                                    name="referencia"
                                    value={ref}
                                    required
                                    onKeyPress={handleKeyPress}
                                    onChange={handleInputChange}
                                    disabled={disabledRef}
                                />
                            </div>

                            <div >
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
                                            disabled={disabledRef}
                                            required
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
                                                onClick={eliminaImagenBoton}
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

                            <div>
                                <label>Subtotal</label>
                                <input type="text" value={subtotal} />
                            </div>

                            <div>
                                <label>Total</label>
                                <input type="text" value={total} />
                            </div>

                            <div className="botones">
                                <button type="submit" className="submit-m-button" >Enviar</button>
                                <button type="reset" className="cancel-m-button" onClick={reset}> Borrar</button>
                            </div>
                        </form>
                    </div>
                    )}
                    {mostrarConfirmacion && (
                        <Confirmacion
                            cerrar={cerrarConfirmacion}
                            envioDatos={envioDatos}
                            nombreAlumno={nombreAlumno}
                            nombreRubro={nombreRubro}
                            usSelect={usSelect}
                            matricula={matricula}
                            subtotal={subtotal}
                            total={total}
                        />
                    )}

                </div >
            </main >
            </div >
        </div>
    );
}
//-------------------------------------------------------------------------------------------------------------

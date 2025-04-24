import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './matricula.css';
import { useUserContext } from '../UserContext';
import Select from "react-select";

import { ObtenerPadres, BuscarUsuarios, ObtenerProductosfijos, ObtenerProductosMensuales, CrearMatricula, } from '../apiClient'; // Importar las funciones desde apiClient.js

export const Matricula2 = () => {

    const { user } = useUserContext();

    const [opciones, setOpciones] = useState([]);
    const [seleccionPadre, setSeleccionPadre] = useState(null);
    const [isValid, setIsValid] = useState(true);
    const [disabledRef, setDisableRef] = useState(true);
    const [total, setTotal] = useState(0);
    const [pago, setPago] = useState("");
    const [imgPago, setImgPago] = useState("");
    const [ref, setRef] = useState("");
    const [envio, setEnvio] = useState(false);
    const [checkVisible, setCheckVisible] = useState(false);
    const [usSelect, setUsSelect] = useState({});
    const [hijoSelect, setHijoSelect] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [fijos, setFijos] = useState([]);
    const [mensuales, setMensuales] = useState([]);
    const [registrosTemp, setRegistrosTemp] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [selectedPagoCheckbox, setSelectedPagoCheckbox] = useState(null);
    const [matricula, setMatricula] = useState(
        {
            "clienteId": 0,
            "rollId": user.rolId,
            "fecha": new Date().toISOString(),
            "metodoPago": "",
            "imagenPago": "",
            "referencia": 0,
            "subtotal": 0,
            "descuento": 0,
            "iva": 0,
            "total": 0,
            "detalles": []
        }
    );

    const reset = () => {
        setUsSelect({});
        setHijoSelect({});
        setCheckVisible(false);
        setEnvio(false);
        setRegistrosTemp([]);
        setRegistros([]);
        setSelectedCheckbox(null);
        setSeleccionPadre(null);
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

    //const handleUseSelect = (idUser) => {
    //    if (idUser != 0) {
    //        setUsSelect(usuarios.find((us) =>
    //            us.idUsuario === parseInt(idUser)
    //        ));
    //    } else {
    //        setUsSelect({});
    //    }
    //    setHijoSelect({});
    //    setCheckVisible(false);
    //    setEnvio(false);
    //    setRegistrosTemp([]);
    //    setSelectedCheckbox(null);
    //}

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
    }

    const addFijos = (idHijo) => {
        const detalle = [];
        fijos.map(pr =>
            detalle.push(
                {
                    "productoid": pr.idProducto,
                    "alumnoid": parseInt(idHijo),
                    "monto": pr.monto,
                    "dias": ""
                },
            ));
        setRegistrosTemp(detalle);
    }

    const addHorario = (idHorario, idHijo) => {

        let horario = mensuales.find(pr => pr.idProducto === idHorario);
        const detalle = {
            "productoid": horario.idProducto,
            "alumnoid": parseInt(idHijo),
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
        const validar = registros.filter(item => item.alumnoid === parseInt(hijoSelect.idAlumno));
        if (validar.length === 0) {
            setRegistros((prevRegistros) => [...prevRegistros, ...registrosTemp]);
        } else {
            alert("Este Niño ya fue ingresado");
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
        if (index == 0) {          
            setDisableRef(true);
            setRef("");
            setImgPago("Pago en efectivo");
        } else {
            setDisableRef(false);
            setImgPago("");
        }
        setIsValid(true);
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
            setRef("");
        }
    };

    // ---------------------------------------envio de datos-------------------------------------------------
    //const handleSubmit = (e) => {
    //    e.preventDefault();

    //    if (validacionDatos(1)) {
    //        if (selectedCheckbox === null) {
    //            setIsValid(false);
    //        } else { // Lógica para enviar el formulario o realizar la acción deseada 
    //            console.log(pago);
    //            //alert(`Aqui se envian los datosa la BD`);
    //            if (!pago.referencia || pago.referencia == "") {
    //                setPago({ ...pago, referencia: 0, });
    //            }
    //            envioDatos();
    //        }
    //    }
    //};

    //UseEffect*******************************************************

    useEffect(() => {
        cargarPadre();
        cargarFijos();
        cargarMensuales();
    }, []);

    useEffect(() => {
        if (registros.length > 0) {
            let suma = 0;
            registros.map(item => suma = suma + item.monto);
            setTotal(suma);
        } else {
            setTotal(0);
        }
    }, [registros]);


    useEffect(() => {
        console.log(registrosTemp);
        console.log(registros);
        console.log(hijoSelect);
        console.log(usSelect);
    }, [registrosTemp], [hijoSelect], [usSelect], [registros]);


    return (
        <div className="content-container">
            <main className="main-content">
                <div className="content-matricula">
                    <div className="enrollment-form">
                        <h2>Formulario de Matrícula</h2>
                        <form>
                            {user.rolId === 1 ? (
                                <div>
                                    <label> Seleccione un Padre</label>
                                    {/*<select*/}
                                    {/*    onChange={(e) => handleUseSelect(e.target.value)}*/}
                                    {/*    value={usSelect.idUsuario || "0"}>*/}

                                    {/*    <option value="0"> Seleccione un padre </option>*/}
                                    {/*    {usuarios.map((use) => (*/}
                                    {/*        <option key={use.idUsuario} value={use.idUsuario}> {use.nombreUsuario} {use.apellidosUsuario}</option>*/}
                                    {/*    ))}*/}
                                    {/*</select>*/}
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
                                {['Efectivo', 'SINPE Movil', 'Transferencia'].map((label, index) => (
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
                                {!isValid && <p style={{ color: 'red' }}>Debe seleccionar al menos una opción.</p>}
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
                                {/*errorMessages.referencia && <div style={{ color: 'red' }}>{errorMessages.referencia}</div>*/}
                            </div>


                            <div>
                                <label>Total</label>
                                <input type="text" value={total} />
                            </div>

                            <div className="botones">
                                <button type="submit" className="submit-m-button"> Enviar</button>
                                <button type="reset" className="cancel-m-button" onClick={reset}> Borrar</button>
                            </div>
                        </form>
                    </div>
                </div >
            </main >
        </div >
    );
}
//-------------------------------------------------------------------------------------------------------------

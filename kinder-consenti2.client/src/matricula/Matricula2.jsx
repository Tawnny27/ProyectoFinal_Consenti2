import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './matricula.css';
import { useUserContext } from '../UserContext';
import { ObtenerPadres, BuscarUsuarios, ObtenerProductosfijos, ObtenerProductosMensuales, CrearMatricula, } from '../apiClient'; // Importar las funciones desde apiClient.js

export const Matricula2 = () => {

    const { user } = useUserContext();
    const [usSelect, setUsSelect] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [fijos, setFijos] = useState([]);
    const [mensuales, setMensuales] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [matricula, setMatricula] = useState(
        {
            "clienteId": 0,
            "rollId": 0,
            "fecha": "",
            "metodoPago": "",
            "imagenPago": "",
            "referencia": 0,
            "subtotal": 0,
            "descuento": 0,
            "iva": 0,
            "total": 0,
            "detalles": [
                {
                    "encabezadoFacturaId": 0,
                    "productoId": 0,
                    "alumnoId": 0,
                    "monto": 0,
                    "dias": "string"
                }
            ]
        }
    );


    const cargarPadre = async () => {
        if (user.rolId == 1) {
            const response = await ObtenerPadres();
            if (response.status == 200) {
                setUsuarios(response.data);
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


    const handleUseSelect = (idUser) => {
        if (idUser != 0) {
            setUsSelect(usuarios.find((us) =>
                us.idUsuario === parseInt(idUser)
            ));
        } else {
            setUsSelect({});
        }
        console.log(idUser);
        console.log(usSelect);
    }

    const handleCheck = (id) => {
        const detalle = [];
        if (registros.length === 0) {
            detalle.push(
                {
                    "productoId": 1,
                    "alumnoId": id,
                    "monto": fijos.find(prod => prod.idProducto === 1)?.monto,
                    "dias": "string"
                },
                {
                    "productoId": 2,
                    "alumnoId": id,
                    "monto": fijos.find(prod => prod.idProducto === 2)?.monto,
                    "dias": "string"
                },
                {
                    "productoId": 3,
                    "alumnoId": id,
                    "monto": fijos.find(prod => prod.idProducto === 3)?.monto,
                    "dias": "string"
                },
            );
            setRegistros(prevRegistros => [...prevRegistros, ...detalle]);

        } else {
            let validado = registros.filter(reg => reg.alumnoId === id);
            if (validado.length === 0) {
                console.log("entra al push 2");
                detalle.push(
                    {
                        "productoId": 1,
                        "alumnoId": id,
                        "monto": fijos.find(prod => prod.idProducto === 1)?.monto,
                        "dias": "string"
                    },
                    {
                        "productoId": 2,
                        "alumnoId": id,
                        "monto": fijos.find(prod => prod.idProducto === 2)?.monto,
                        "dias": "string"
                    },
                    {
                        "productoId": 3,
                        "alumnoId": id,
                        "monto": fijos.find(prod => prod.idProducto === 3)?.monto,
                        "dias": "string"
                    },
                );
                console.log(detalle);
                setRegistros(prevRegistros => [...prevRegistros, ...detalle]);

            } else {
                validado = registros.filter(reg => reg.alumnoId != id);
                if (validado.length > 0) {
                    setRegistros(validado);
                } else {
                    setRegistros([]);
                }
            }
        }
    }

    const alumnoActivo = (id) => {
        const validacionAlumno = registros.filter(reg => reg.alumnoId != id);
        if (validacionAlumno.length === 0) {
            return false;
        } else {
            return true;
        }

    }

    const horario = (id, idHorario) => {
        let reg = {
            "productoId": parseInt(idHorario),
            "alumnoId": id,
            "monto": mensuales.find(prod => prod.idProducto === parseInt(idHorario))?.monto,
            "dias": "string"
        }
        setRegistros(prevRegistros => [...prevRegistros, reg]);
      
    }
    //UseEffect*******************************************************

    useEffect(() => {
        cargarPadre();
        cargarFijos();
        cargarMensuales();
    }, []);

    useEffect(() => {
        console.log(registros);
    }, [registros]);


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
                                    <select
                                        onChange={(e) => handleUseSelect(e.target.value)}
                                        value={usSelect.idUsuario || "0"}>

                                        <option value="0"> Seleccione un padre </option>
                                        {usuarios.map((use) => (
                                            <option key={use.idUsuario} value={use.idUsuario}> {use.nombreUsuario} {use.apellidosUsuario}</option>
                                        ))}
                                    </select>
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
                                    {usSelect.alumnos.map((hijo, index) => (
                                        <div key={index}>
                                            <div>
                                                <label key={index}>
                                                    <input
                                                        type="checkbox"
                                                        key={hijo.idAlumno}
                                                        onChange={() => handleCheck(hijo.idAlumno)}
                                                    />

                                                    {hijo.nombreAlumno}
                                                </label>

                                                {alumnoActivo(hijo.idAlumno) && (
                                                    <select
                                                        key={index}
                                                        onChange={(e) => horario(hijo.idAlumno, e.target.value)}
                                                        value={(e) => registros.find((pr) => pr.idProducto === e.target.value)?.productoId || "0"}
                                                    >
                                                        <option value="0"> Seleccione un horario</option>
                                                        {mensuales.map((ho) => (
                                                            <option key={ho.idProducto} value={ho.idProducto}>{ho.nombreProducto}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}


                            <div>
                                <label>Opcional</label>
                                <input type="text" />
                            </div>
                            <div>
                                <label>Opcional</label>
                                <input type="text" />
                            </div>
                            <div>
                                <label>Opcional</label>
                                <input type="text" />
                            </div>
                            <div className="botones">
                                <button type="submit" className="submit-m-button"> Enviar</button>
                                <button type="reset" className="cancel-m-button"> Borrar</button>
                            </div>
                        </form>
                    </div>
                </div >
            </main >
        </div >
    );
}
//-------------------------------------------------------------------------------------------------------------




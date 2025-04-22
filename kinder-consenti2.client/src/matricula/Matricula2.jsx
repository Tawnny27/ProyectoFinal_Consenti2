import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

    const handleCheck = (index, id) => {
        alert(index + "-" + id);
    }

    //UseEffect*******************************************************

    useEffect(() => {
        cargarPadre();
        cargarFijos();
        cargarMensuales();
    }, []);


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
                                            <label key={index}>
                                                <input
                                                    type="checkbox"
                                                    key={hijo.idAlumno}
                                                    onChange={() => handleCheck(index, hijo.idAlumno)}
                                                />
                                                {hijo.nombreAlumno}
                                            </label>
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




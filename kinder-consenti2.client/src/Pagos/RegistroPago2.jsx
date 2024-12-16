// PaymentRegistrationForm.jsx
import { useState, useEffect } from 'react';
import './RegistroPago.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import DataTable from 'react-data-table-component';
//import axios from '../../../node_modules/axios/index';
import axios from '../axios';


const RegistroPago = () => {

    const [usuario, setUsuario] = useState([]);
    const [detalles, setDetalles] = useState([]);
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
        imagenPago: '',
        referencia: 0,
        subtotal: 0,
        descuento: 0,
        iva: 0.13,
        total: 0,
        detalles: detalles,
    });
    
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
                    setDetalles(await detallesResponse.json());                    
                    setMensaje('');
                    setPago({
                        ...pago,
                        clienteId: usuarioSelect.idUsuario,
                        rolId: usuarioSelect.rolId                       
                    });
                } else {
                    setDetalles([]);   
                    setMensaje((await detallesResponse.text()).toString());                    
                    console.log(mensaje);
                    setPago({
                        ...pago,
                        clienteId: usuarioSelect.idUsuario,
                        rolId: usuarioSelect.rolId                   
                    });

                }
                
            }
        } catch (error) {
            console.error('Error al cargar los datos :', error);
        }
    }


    useEffect(() => {
        if (detalles.length===0) {
            setPago({
                ...pago,
                subtotal: 0,
                total: 0,
                detalles: detalles
            });
        }
        else
        {
            setPago({
                ...pago,                
                subtotal: sumarPrecios(detalles),
                total: sumarPrecios(detalles),
                detalles: detalles
            });
        }
    }, [detalles]);

    useEffect(() => {        
        cargarDetalles();
    },[usuarioSelect]);



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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPago({
            ...pago,
            [name]: value,
        });      
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
            selector: (row) => "¢"+ row.monto,
            sortable: true,
        }       
    ];

    const enviarDatos = () => { console.log(pago); }

        return (
            <div className="fondo">

                {<Navbar />}
                {/* Formulario */}
                <div className="form-card">
                    <h2>Registro de pago2</h2>

                    <form onSubmit={ev =>
                    {
                        ev.preventDefault();
                        enviarDatos();
                    }} >
                        { /* Dropdown*/}
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
                        <div className="form-group" style={{display:'none'}}>
                            <label></label>
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
                            <input type="text" value={usuarioSelect.cedulaUsuario} disabled  />
                        </div>
                        <div className="form-group">
                            <label>Subtotal:</label>
                            <input type="text" name="subtotal" value={pago.subtotal} disabled />
                        </div>

                        <DataTable
                            columns={columns}
                            data={detalles}  
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
                            <button type="submit" className="btn-submit">Enviar</button>
                            <button type="button" className="btn-cancel">Cancelar</button>
                        </div>
                    </form>
                </div>

                {/*<Footer />*/}
            </div>

        );
    };

    export default RegistroPago;
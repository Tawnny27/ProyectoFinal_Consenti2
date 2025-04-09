import { useState, useEffect } from 'react';
import './Gastos.css';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos
import { ObtenerCategorias, ObtenerGasto, CrearrGasto, EditarGasto, EliminarGasto } from '../apiClient'; // Importamos las funciones desde apiClient

const obtenerfechaInicial = () => {
    let fechainit = new Date();
    fechainit.setDate(1);
    return fechainit;
}


const Gastos = () => {
    const [gastos, setGastos] = useState([]);
    const [gastosVis, setGastosVis] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [nuevoGasto, setNuevoGasto] = useState({
        fecha: '',
        categoriaId: '',
        monto: ''
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [gastoSeleccionado, setGastoSeleccionado] = useState(null);
    const [fechaFiltro, setFechaFiltro] = useState('');   
    const [fechaCon, setFechaCon] = useState(obtenerfechaInicial());
    const [mensaje, setMensaje] = useState([]);


    //funciones--------------------------------------------------------------

    const handleCloseModal = () => {
        setModalIsOpen(false);

        setNuevoGasto({
            fecha: '',
            categoriaId: '',
            monto: ''
        });
      
    };

    
  
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevoGasto((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const manejarEnvioGasto = async (e) => {
        e.preventDefault();

        // Verifica si estamos editando un gasto y si el idGasto existe
        const metodo = gastoSeleccionado ? EditarGasto : CrearrGasto; // Usa las funciones del apiClient
        try {
            const response = await metodo(nuevoGasto); // Llama a la función correspondiente (editar o crear)
            if (response) {
                const mensaje = gastoSeleccionado ? '¡Gasto editado exitosamente!' : '¡Gasto creado exitosamente!';
                window.alert(mensaje);
                setModalIsOpen(false);
                setNuevoGasto({
                    fecha: '',
                    categoriaId: '',
                    monto: ''
                });
              
            }
        } catch (error) {
            console.error(gastoSeleccionado ? 'Error al editar gasto:' : 'Error al crear gasto:', error);
        }
    };

    const handleEdit = (idGasto) => {
        const gasto = gastos.find(g => g.idGasto === idGasto);
        if (gasto) {
            setGastoSeleccionado(gasto); // Guarda el gasto seleccionado para edición
            setNuevoGasto({
                "idGasto": gasto.idGasto,
                fecha: gasto.fecha,
                categoriaId: gasto.categoriaId,
                monto: gasto.monto
            });
            setModalIsOpen(true); // Abre el modal de edición
        }
    };

    const handleDelete = async (idGasto) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este gasto?');
        if (confirmDelete) {
            try {
                await EliminarGasto(idGasto);
                window.alert('Gasto eliminado exitosamente.');
                setGastos(gastos.filter(g => g.idGasto !== idGasto)); // Elimina el gasto de la vista
            } catch (error) {
                console.error('Error al eliminar el gasto:', error);
                window.alert('Hubo un error al eliminar el gasto.');
            }
        }
    };

    const columns = [
        {
            name: 'Fecha',
            selector: row => row.fecha,
            sortable: true
        },
        {
            name: 'Categoria',
            selector: row => row.categoriaId,
            sortable: true
        },
        {
            name: 'Monto',
            selector: row => row.monto,
            sortable: true
        },
        {
            name: 'Acciones',
            cell: (row) => (
                <div className="acciones-container">
                    <button className="gastos-edit-button" onClick={() => handleEdit(row.idGasto)}>
                        <FontAwesomeIcon icon={faEdit} /> {/* Icono de editar */}
                    </button>
                    <button className="gastos-delete-button" onClick={() => handleDelete(row.idGasto)}>
                        <FontAwesomeIcon icon={faTrash} /> {/* Icono de eliminar */}
                    </button>
                </div>
            )
        }
    ];

    const cargarCategorias = async () => {
        try {
            const categoriasData = await ObtenerCategorias();
            setCategorias(categoriasData.data); // Asume que `data` contiene las categorías
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const filtrarGastos = (fecha) => {
        setFechaFiltro(fecha);
        if (fecha) {
            let filtrados = gastos.filter((item) => item.fecha == fecha);
            
            if (filtrados.length>0) {
                setGastosVis(filtrados);
                console.log(filtrados);
                setMensaje('');
            } else {
                setGastosVis([]);
                setMensaje('No hay gastos registrados');

            }
        } else {
            setGastosVis(gastos);
        }        
    }

    const back = () => {
        console.log("Back");
        let fechaBase = new Date(fechaCon);
        fechaBase.setMonth(fechaBase.getMonth() - 1);     
        setFechaCon(fechaBase);  
        setFechaFiltro('');
    }

    const next = () => {
        console.log("Next");
        let fechaBase = new Date(fechaCon);
        fechaBase.setMonth(fechaBase.getMonth() + 1);
        setFechaCon(fechaBase);         
        setFechaFiltro('');
    }

    //useEffects----------------------------------------------------------------------------


    useEffect(() => {       
        cargarCategorias();        
    }, []);

    useEffect(() => {
        
        const cargarGastos = async () => {
            const gastosData = await ObtenerGasto(fechaCon.getFullYear(), fechaCon.getMonth() + 1);
            if (gastosData.status == 200) {
                setGastos(gastosData.data);
                setGastosVis(gastosData.data);
                setMensaje('');
            } else {
                setGastos([]);
                setGastosVis([]);
                setMensaje(gastosData);
            }            
            console.log(gastosData);
        }
        cargarGastos();
    }, [fechaCon]);  

  

    return (
        <div className="gastos-container">       
            <div className="content-wrapper">
                <div className="gastos-content">
                    <h1 className="gastos-title">Gestion de Gastos</h1>                                 

                    <div className="gastos-main-buttons">
                        <button
                            className="gastos-add-btn"
                            onClick={() => setModalIsOpen(true)}
                        >
                            Agregar Gasto
                        </button>
                    </div>

                    <div className="gastos-filtro">
                        <div className="back" onClick={back}><label> {"<"} </label></div>
                        <div className="next" onClick={next}><label>{">"}</label></div>  

                        <label>Hacer filtrado por fecha</label>
                        <input
                            type="date"
                            value={fechaFiltro}
                            onChange={(e) => filtrarGastos(e.target.value)}
                        />
                    </div>


                    <div className="gastos-data-table-wrapper">
                        <DataTable
                            columns={columns}
                            data={gastosVis}
                            noDataComponent={mensaje}
                            pagination
                            paginationComponentOptions={{
                                rowsPerPageText: 'Filas por página:',
                                rangeSeparatorText: 'de',
                                noRowsPerPage: false,
                                selectAllRowsItem: true,
                                selectAllRowsItemText: 'Todos',
                            }}
                            highlightOnHover
                            fixedHeader
                            responsive
                        />
                    </div>

                    {/* Modal para editar o agregar gasto */}
                    {modalIsOpen && (
                        <div
                            className="gastos-modal-overlay"
                            onClick={() => handleCloseModal()}
                        >
                            <div className="gastos-modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="gastos-modal-header">
                                    <h2>{gastoSeleccionado ? 'Editar Gasto' : 'Agregar Nuevo Gasto'}</h2>
                                </div>
                                <form onSubmit={manejarEnvioGasto} className="gastos-form">
                                    <div className="gastos-form-section">
                                        <div className="gastos-form-group">
                                            <label className="gastos-label">Fecha</label>
                                            <input
                                                type="date"
                                                name="fecha"
                                                value={nuevoGasto.fecha}
                                                onChange={manejarCambio}
                                                required
                                            />
                                        </div>
                                        <div className="gastos-form-group">
                                            <label className="gastos-label">Categoria</label>
                                            <select
                                                name="categoriaId"
                                                value={nuevoGasto.categoriaId}
                                                onChange={manejarCambio}
                                                required
                                            >
                                                <option value="">Seleccione una categoria</option>
                                                {categorias.map((categoria) => (
                                                    <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                                        {categoria.nombreCategoria}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="gastos-form-group">
                                            <label className="gastos-label">Monto</label>
                                            <input
                                                type="number"
                                                name="monto"
                                                value={nuevoGasto.monto}
                                                onChange={manejarCambio}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit">{gastoSeleccionado ? 'Guardar Cambios' : 'Guardar'}</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
 
            </div>
        </div>
    );
};

export default Gastos;

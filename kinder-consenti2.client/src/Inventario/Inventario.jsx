import React, { useState, useEffect } from 'react';
import axios from '../axios';

import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import './Inventario.css';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Inventario = () => {
    const [searchText, setSearchText] = useState(''); // Estado para el texto de b�squeda
    const [filteredData, setFilteredData] = useState([]); // Datos filtrados
    const [inventario, setInventario] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [nuevoInventario, setNuevoInventario] = useState({
        descripcion: '',
        categoriaId: '',
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [inventarioSeleccionado, setInventarioSeleccionado] = useState(null);

    const cargarDatos = async () => {
        try {
            const inventarioResponse = await axios.get('https://localhost:44369/Inventario/ObtenerInventario');
            setInventario(inventarioResponse.data);
            setFilteredData(inventarioResponse.data);

            const categoriasResponse = await axios.get('https://localhost:44369/Categoria/ObtenerCategorias');
            setCategorias(categoriasResponse.data);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    };

    // Manejar el cambio del texto de b�squeda
    const manejarBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setSearchText(texto);

        if (texto === '') {
            // Si el campo est� vac�o, muestra todo el inventario
            setFilteredData(inventario);
        } else {
            // Filtrar datos seg�n la b�squeda
            const datosFiltrados = inventario.filter((item) =>
                item.descripcion.toLowerCase().includes(texto) ||
                item.categoriaId.toString().includes(texto) ||
                item.cantidad.toString().includes(texto)
            );
            setFilteredData(datosFiltrados);
        }
    };


    
    useEffect(() => {
        cargarDatos();
    }, []);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevoInventario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const manejarEnvioCrear = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:44369/Inventario/CrearInventario', nuevoInventario);
            if (response.data) {
                toast.success('Inventario creado exitosamente!');
                setInventario([...inventario, response.data]);
                handleCloseModal();
                cargarDatos();
            }
        } catch (error) {
            toast.error(error.response?.data || 'Error al crear inventario.');
            console.error('Error al crear inventario:', error);
        }
    };

    const manejarEnvioEditar = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('https://localhost:44369/Inventario/EditarInventario', nuevoInventario);
            if (response.data) {
                toast.success('Inventario editado correctamente!');
                handleCloseModal();
                cargarDatos();
                
            }

        } catch (error) {
            toast.error(error.response?.data || 'Error al editar inventario.');
            console.error('Error al editar inventario:', error);
        }
    };

    const manejarEliminar = (idInventario) => {
        toast(
            ({ closeToast }) => (
                <div>
                    <p>Estas seguro de que deseas eliminar este producto?</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            style={{ marginRight: '10px', color: 'white', backgroundColor: 'red' }}
                            onClick={() => {
                                confirmarEliminar(idInventario);
                                closeToast();
                            }}
                        >
                            Si
                        </button>
                        <button
                            style={{ color: 'white', backgroundColor: 'gray' }}
                            onClick={closeToast}
                        >
                            no
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    const confirmarEliminar = async (idInventario) => {
        try {
            await axios.delete(`https://localhost:44369/Inventario/EliminarInventario/${idInventario}`);
            setInventario((prev) => prev.filter((item) => item.idInventario !== idInventario));
            toast.success('Inventario eliminado correctamente!');
        } catch (error) {
            toast.error('Error al eliminar inventario.');
            console.error('Error al eliminar inventario:', error);
        }
    };


    //const handleCloseModal = () => {
    //    setModalIsOpen(false);
    //    setInventarioSeleccionado(null);
    //    setNuevoInventario({
            
    //        descripcion: '',
    //        categoriaId: '',
    //    });
    //};

    const columns = [
        {
            name: 'Descripcion',
            selector: (row) => row.descripcion,
            sortable: true,
        },
        /*
        {
            name: 'CategoriaId',
            selector: (row) => row.categoriaId,
            sortable: true,
        },
        */
        {
            name: 'Categoria',
            selector: (row) => row.categoria.nombreCategoria,
            sortable: true,
        },
        {
            name: 'Cantidad',
            selector: (row) => row.cantidad,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: (row) => (
                <div className="acciones-container">
                    <button
                        className="inventario-edit-btn"
                        onClick={() => {
                            setInventarioSeleccionado(row);
                            setNuevoInventario({
                                idInventario: row.idInventario,
                                descripcion: row.descripcion,
                                categoriaId: row.categoriaId,
                                cantidad: row.cantidad
                            });
                            setModalIsOpen(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        className="inventario-delete-btn"
                        onClick={() => manejarEliminar(row.idInventario)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>

                    <button
                        className="accionInventario-boton"
                        onClick={() => {
                            setMovimiento({
                                ...movimiento,
                                inventarioId: row.idInventario,
                            });
                            setModalMovimientoIsOpen(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faExchangeAlt} />
                    </button>


                </div>
            ),
        },
    ];

    /**MOVIMIENTOS */
    const [movimiento, setMovimiento] = useState({
        inventarioId: '',
        cantidad: '',
        responsable: '',
        movimiento: true // true para Ingreso, false para Salida
    });
    const [modalMovimientoIsOpen, setModalMovimientoIsOpen] = useState(false);

    const handleMovimientoChange = (e) => {
        const { name, value } = e.target;
        setMovimiento((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const manejarMovimiento = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:44369/MovimientoInventario/CrearMovimiento', {
                fecha: new Date().toISOString().split('T')[0],
                ...movimiento,
            });
            if (response.data) {
                handleCloseModal();
                cargarDatos();
                toast.success('Movimiento realizado de manera correcta');
            }
        } catch (error) {
            console.error('Error al registrar movimiento:', error);
            toast.error('Error al registrar movimiento.');
        }
    };
    /** */

    /**
     */
    const [nuevoCategoria, setNuevoCategoria] = useState({
        nombreCategoria: '',
    });
    const [modalCategoriaIsOpen, setModalCategoriaIsOpen] = useState(false);

    const manejarCambioCategoria = (e) => {
        const { name, value } = e.target;
        setNuevoCategoria((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const manejarEnvioCategoria = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:44369/Categoria/CrearCategoria', {
                nombreCategoria: nuevoCategoria.nombreCategoria,
            });
            if (response.data) {
                toast.success('Categoria creada exitosamente!');
                handleCloseModal();
                // Recargar categor�as
                const categoriasResponse = await axios.get('https://localhost:44369/Categoria/ObtenerCategorias');
                setCategorias(categoriasResponse.data);
            }
        } catch (error) {
            console.error('Error al crear categor�a:', error);
            toast.error('Error al crear categoria.');
        }
    };

    // Modificar handleCloseModal para incluir reseteo de categor�a
    const handleCloseModal = () => {
        setModalIsOpen(false);
        setModalMovimientoIsOpen(false);
        setModalCategoriaIsOpen(false);
        setInventarioSeleccionado(null);
        setNuevoInventario({
            descripcion: '',
            categoriaId: '',
        });
        setNuevoCategoria({
            nombreCategoria: '',
        });
        setMovimiento({
            inventarioId: '',
            cantidad: '',
            responsable: '',
            movimiento: true
        });
    };

    /** */

    return (
        <div className="inventario-container">
            <Navbar />

            <div className="content-wrapper">
                <div className="inventario-content">
                    <h1 className="inventario-title">Gestion de Inventario</h1>

                    <div className="inventario-main-buttons">
                    <button className="inventario-add-btn" onClick={() => setModalIsOpen(true)}>
                        Agregar Inventario
                    </button>

                    <button
                        className="inventario-add-btn"
                        onClick={() => setModalCategoriaIsOpen(true)}
                    >
                        Agregar Categor�a
                        </button>
                    </div>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchText}
                            onChange={manejarBusqueda}
                            className="search-input"
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        highlightOnHover
                        responsive
                    />

                    {modalIsOpen && (
                        <div className="inventario-modal-overlay" onClick={() => handleCloseModal()}>
                            <div className="inventario-modal-content" onClick={(e) => e.stopPropagation()}>
                                <form
                                    onSubmit={inventarioSeleccionado ? manejarEnvioEditar : manejarEnvioCrear}
                                    className="inventario-form"
                                >
                                    <h2>{inventarioSeleccionado ? 'Editar Inventario' : 'Agregar Inventario'}</h2>
                                    <input
                                        type="text"
                                        name="descripcion"
                                        value={nuevoInventario.descripcion}
                                        onChange={manejarCambio}
                                        placeholder="Descripci�n"
                                        required
                                    />
                                    <select
                                        name="categoriaId"
                                        value={nuevoInventario.categoriaId}
                                        onChange={manejarCambio}
                                        required
                                    >
                                        <option value="">Seleccione una categor�a</option>
                                        {categorias.map((cat) => (
                                            <option key={cat.idCategoria} value={cat.idCategoria}>
                                                {cat.nombreCategoria}
                                            </option>
                                        ))}
                                    </select>
                                    <button type="submit">{inventarioSeleccionado ? 'Guardar Cambios' : 'Guardar'}</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {modalMovimientoIsOpen && (
                        <div className="inventario-modal-overlay" onClick={() => handleCloseModal()}>
                            <div className="inventario-modal-content" onClick={(e) => e.stopPropagation()}>
                                <form onSubmit={manejarMovimiento} className="inventario-form">
                                    <h2>Realizar Movimiento de Inventario</h2>
                                    <input
                                        type="number"
                                        name="cantidad"
                                        value={movimiento.cantidad}
                                        onChange={handleMovimientoChange}
                                        placeholder="Cantidad"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="responsable"
                                        value={movimiento.responsable}
                                        onChange={handleMovimientoChange}
                                        placeholder="Responsable"
                                        required
                                    />
                                    <select
                                        name="movimiento"
                                        value={movimiento.movimiento}
                                        onChange={(e) => handleMovimientoChange({
                                            target: {
                                                name: 'movimiento',
                                                value: e.target.value === 'true'
                                            }
                                        })}
                                        required
                                    >
                                        <option value={true}>Ingreso</option>
                                        <option value={false}>Salida</option>
                                    </select>
                                    <button type="submit">Realizar Movimiento</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {modalCategoriaIsOpen && (
                        <div className="inventario-modal-overlay" onClick={() => handleCloseModal()}>
                            <div className="inventario-modal-content" onClick={(e) => e.stopPropagation()}>
                                <form onSubmit={manejarEnvioCategoria} className="inventario-form">
                                    <h2>Agregar Nueva Categor�a</h2>
                                    <input
                                        type="text"
                                        name="nombreCategoria"
                                        value={nuevoCategoria.nombreCategoria}
                                        onChange={manejarCambioCategoria}
                                        placeholder="Nombre de la Categor�a"
                                        required
                                    />
                                    <button type="submit">Guardar</button>
                                </form>
                            </div>
                        </div>
                    )}


                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Inventario;

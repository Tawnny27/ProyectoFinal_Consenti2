import React, { useState, useEffect } from 'react';
import axios from '../axios';

import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import './Gastos.css';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos

const Gastos = () => {
    const [gastos, setGastos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [nuevoGasto, setNuevoGasto] = useState({
        fecha: '',
        categoriaId: '',
        monto: ''
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [gastoSeleccionado, setGastoSeleccionado] = useState(null);
    const [fechaFiltro, setFechaFiltro] = useState('');

    const handleCloseModal = () => {
        setModalIsOpen(false);
    

        setNuevoGasto({
            fecha: '',
            categoriaId: '',
            monto: ''
        });
      
    };

    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const categoriasResponse = await axios.get('https://localhost:44369/Categoria/ObtenerCategorias');
                setCategorias(categoriasResponse.data);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        };
        cargarCategorias();
    }, []);

    const cargarGastosPorFecha = async () => {
        if (fechaFiltro) {
            try {
                const gastosResponse = await axios.get(`https://localhost:44369/Gasto/BuscarGastoxFecha/${fechaFiltro}`);
                setGastos(gastosResponse.data);
            } catch (error) {
                console.error('Error al cargar los gastos:', error);
            }
        }
    };

    useEffect(() => {
        cargarGastosPorFecha();
    }, [fechaFiltro]);

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
        const url = gastoSeleccionado ? `https://localhost:44369/Gasto/EditarGasto` : 'https://localhost:44369/Gasto/CrearGasto';
        const metodo = gastoSeleccionado ? 'put' : 'post'; // PUT si estamos editando, POST si estamos creando un gasto

        try {
            const response = await axios({
                method: metodo,
                url: url,
                data: nuevoGasto
            });

            if (response.data) {
                const mensaje = gastoSeleccionado ? '¡Gasto editado exitosamente!' : '¡Gasto creado exitosamente!';
                window.alert(mensaje);
                setModalIsOpen(false);
                setNuevoGasto({
                    fecha: '',
                    categoriaId: '',
                    monto: ''
                });
                cargarGastosPorFecha();  // Recargar los gastos
            }
        } catch (error) {
            console.error(gastoSeleccionado ? 'Error al editar gasto:' : 'Error al crear gasto:', error);
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
                    <button className="gastos-edit-button"  onClick={() => handleEdit(row.idGasto)}>
                        <FontAwesomeIcon icon={faEdit} /> {/* Icono de editar */}
                    </button>
                    <button className="gastos-delete-button" onClick={() => handleDelete(row.idGasto)}>
                        <FontAwesomeIcon icon={faTrash} /> {/* Icono de eliminar */}
                    </button>
                </div>
            )
        }
    ];


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

    const handleDelete = (idGasto) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este gasto?");
        if (confirmDelete) {
            axios.delete(`https://localhost:44369/Gasto/EliminarGasto/${idGasto}`)
                .then(() => {
                    window.alert('Gasto eliminado exitosamente.');
                    setGastos(gastos.filter(g => g.idGasto !== idGasto)); // Elimina el gasto de la vista
                })
                .catch(error => {
                    console.error("Error al eliminar el gasto:", error);
                    window.alert('Hubo un error al eliminar el gasto.');
                });
        }
    };



    return (
        <div className="gastos-container">
            <Navbar />
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
                        <label>Hacer filtrado por fecha</label>
                        <input
                            type="date"
                            value={fechaFiltro}
                            onChange={(e) => setFechaFiltro(e.target.value)}
                        />
                    </div>


                    <div className="gastos-data-table-wrapper">
                        <DataTable
                            columns={columns}
                            data={gastos}
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
                <Footer />
            </div>
        </div>
    );
};

export default Gastos;

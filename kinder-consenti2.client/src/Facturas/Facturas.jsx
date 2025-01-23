import React, { useState, useEffect } from 'react';
import axios from '../axios';
import DataTable from 'react-data-table-component';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import './Factura.css';

const FacturaMaintenance = () => {
    const [facturas, setFacturas] = useState([]);
    const [facturasFiltradas, setFacturasFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroUsuarioId, setFiltroUsuarioId] = useState(''); // Filtro por Usuario ID
    const [filtroEstado, setFiltroEstado] = useState(''); // Filtro por Estado
    const [modalOpen, setModalOpen] = useState(false);
    const [imagenSeleccionada, setImagenSeleccionada] = useState('');

    // Función para obtener facturas desde la API
    const fetchFacturas = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://localhost:44369/EncabezadoFactura/ObtenerFacturasPendientes');
            if (response.status === 200) {
                setFacturas(response.data);
                setFacturasFiltradas(response.data); // Inicializar facturas filtradas con todas las facturas
            }
        } catch (error) {
            console.error('Error al obtener las facturas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar facturas por Usuario ID y Estado
    useEffect(() => {
        let facturasFiltradas = facturas;

        // Filtrar por Usuario ID
        if (filtroUsuarioId.trim() !== '') {
            facturasFiltradas = facturasFiltradas.filter((factura) =>
                factura.usuarioId.toString().includes(filtroUsuarioId)
            );
        }

        // Filtrar por Estado
        if (filtroEstado !== '') {
            facturasFiltradas = facturasFiltradas.filter(
                (factura) => factura.status.toString() === filtroEstado
            );
        }

        setFacturasFiltradas(facturasFiltradas);
    }, [filtroUsuarioId, filtroEstado, facturas]);

    const actualizarEstado = async (idFactura, nuevoEstado) => {
        try {
            const response = await axios.put(`https://localhost:44369/EncabezadoFactura/DarAltaFactura/${idFactura}&${nuevoEstado}`);
            if (response.status === 200) {
                setFacturas((prevFacturas) =>
                    prevFacturas.map((factura) =>
                        factura.idFactura === idFactura ? { ...factura, status: nuevoEstado } : factura
                    )
                );
                alert('Estado actualizado correctamente');
            }
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
            alert('Hubo un error al actualizar el estado');
        }
    };

    const abrirModal = (imagen) => {
        const partesRuta = imagen.split('/');
        const directorio = partesRuta.slice(0, -1).join('/');
        const nombreArchivo = partesRuta.slice(-1)[0];
        const nombreCompleto = `Comprobante_${nombreArchivo}`;
        const rutaCompleta = `${directorio}/${nombreCompleto}`;

        setImagenSeleccionada(rutaCompleta);
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setImagenSeleccionada('');
    };

    useEffect(() => {
        fetchFacturas();
    }, []);

    // Configuración de columnas para la tabla
    const columns = [
        {
            name: 'ID Factura',
            selector: (row) => row.idFactura,
            sortable: true,
        },
        {
            name: 'Usuario ID',
            selector: (row) => row.usuarioId,
        },
        {
            name: 'Fecha',
            selector: (row) => (row.fecha ? row.fecha.split('T')[0] : 'Sin fecha'),
        },
        {
            name: 'Método de Pago',
            selector: (row) => row.metodoPago || 'Sin método',
        },
        {
            name: 'Referencia',
            selector: (row) => row.referencia || 'Sin referencia',
        },
        {
            name: 'Total',
            selector: (row) => (row.total !== undefined ? `₡ ${row.total.toFixed(2)}` : 'Sin total'),
        },
        {
            name: 'Estado',
            cell: (row) => (
                <select
                    value={row.status}
                    onChange={(e) => actualizarEstado(row.idFactura, e.target.value)}
                >
                    <option value="1">Pagado</option>
                    <option value="0">Pendiente</option>
                    <option value="2">No Pagado</option>
                </select>
            ),
        },
        {
            name: 'Comprobante de Pago',
            cell: (row) => (
                <button
                    className="ver-factura-button"
                    onClick={() => abrirModal(row.imagenPago)}
                >
                    Ver Factura
                </button>
            ),
        },
    ];

    return (
        <div className="Fact-maintenance-container">
            <Navbar />
            <h2>Mantenimiento de Facturas</h2>

            {/* Filtros */}
            <div className="filtros-container">
                <input
                    type="text"
                    placeholder="Buscar por Usuario ID"
                    value={filtroUsuarioId}
                    onChange={(e) => setFiltroUsuarioId(e.target.value)}
                    className="buscador-input"
                />
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="filtro-estado"
                >
                    <option value="">Todos los Estados</option>
                    <option value="1">Pagado</option>
                    <option value="0">Pendiente</option>
                    <option value="2">No Pagado</option>
                </select>
            </div>

            <div className="data-table-wrapper">
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={facturasFiltradas} // Mostrar facturas filtradas
                        pagination
                        highlightOnHover
                        fixedHeader
                        responsive
                        paginationComponentOptions={{
                            rowsPerPageText: 'Filas por página:',
                            rangeSeparatorText: 'de',
                            selectAllRowsItem: true,
                            selectAllRowsItemText: 'Todos',
                        }}
                    />
                )}
            </div>

            {modalOpen && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target.className === 'modal-overlay') {
                            cerrarModal();
                        }
                    }}
                >
                    <div className="modal-content">
                        <img
                            src={imagenSeleccionada}
                            alt="Comprobante de Pago"
                            className="factura-imagen"
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default FacturaMaintenance;

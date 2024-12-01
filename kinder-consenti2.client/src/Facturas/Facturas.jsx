import React, { useState, useEffect } from 'react';
import axios from '../axios';
import DataTable from 'react-data-table-component';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import './Factura.css';

const FacturaMaintenance = () => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para obtener facturas desde la API
    const fetchFacturas = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://localhost:44369/EncabezadoFactura/ObtenerFacturasPendientes');
            if (response.status === 200) {
                setFacturas(response.data); 
            }
        } catch (error) {
            console.error('Error al obtener las facturas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar el estado de una factura
    const actualizarEstado = async (idFactura, nuevoEstado) => {
        try {
            const response = await axios.put(`https://localhost:44369/EncabezadoFactura/DarAltaFactura/${idFactura}&${nuevoEstado}`);
            if (response.status === 200) {
                // Actualizar el estado localmente
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
            selector: (row) => row.fecha ? row.fecha.split('T')[0] : 'Sin fecha', // Validación de fecha
        },
        {
            name: 'Método de Pago',
            selector: (row) => row.metodoPago || 'Sin método', // Manejo de valores vacíos
        },
        {
            name: 'Referencia',
            selector: (row) => row.referencia || 'Sin referencia', // Manejo de valores vacíos
        },
        {
            name: 'Total',
            selector: (row) => (row.total !== undefined ? `$${row.total.toFixed(2)}` : 'Sin total'), // Validación de total
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
    ];


    return (
        <div className="Fact-maintenance-container">
            <Navbar />
            <h2>Mantenimiento de Facturas</h2>
            <div className="data-table-wrapper">
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={facturas}
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
            <Footer />
        </div>
    );
};

export default FacturaMaintenance;

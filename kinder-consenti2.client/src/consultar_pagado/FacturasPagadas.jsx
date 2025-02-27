import React, { useState, useEffect, useCallback } from 'react';

import DataTable from 'react-data-table-component';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import { format } from 'date-fns';
import './consulta_pagado.css';

const FacturasPagadas = () => {
    const [facturasPagadas, setFacturasPagadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [imagenSeleccionada, setImagenSeleccionada] = useState('');
    const [facturaDetalles, setFacturaDetalles] = useState(null);

    const fetchFacturasPagadas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://localhost:44369/api/EncabezadoFactura/ObtenerFacturasPagadas');
            if (response.status === 200) {
                setFacturasPagadas(response.data);
            }
        } catch (error) {
            console.error('Error al obtener las facturas pagadas:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFacturasPagadas();
    }, [fetchFacturasPagadas]);

    // ... (resto del código sin cambios significativos)

    const abrirModalDetalles = async (idFactura) => {
        try {
            const response = await axios.get(`https://localhost:44369/api/EncabezadoFactura/BuscarFactura/${idFactura}`);
            if (response.status === 200) {
                setFacturaDetalles(response.data);
            } else {
                alert('Error al cargar los detalles de la factura. Por favor, inténtalo de nuevo más tarde.');
            }
        } catch (error) {
            console.error('Error al cargar los detalles de la factura:', error);
            alert('Ha ocurrido un error inesperado. Por favor, contacta al administrador.');
        }
    };

    // Renderizado del modal de detalles
    {
        modalOpen && facturaDetalles && (
            <div className="modal-overlay">
                {/* ... */}
                <div className="modal-content">
                    <h3>Detalles de la Factura</h3>
                    {/* ... */}
                    <h4>Detalles:</h4>
                    {facturaDetalles.detalleFacturas && facturaDetalles.detalleFacturas.length > 0 ? (
                        <ul>
                            {facturaDetalles.detalleFacturas.map((detalle, index) => (
                                <li key={index}>
                                    Producto ID: {detalle.productoId}, Monto: ? {detalle.monto.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay detalles disponibles para esta factura.</p>
                    )}
                </div>
            </div>
        )
    }

    // ... (resto del código sin cambios significativos)
};

export default FacturasPagadas;

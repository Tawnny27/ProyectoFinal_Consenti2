// PaymentRegistrationForm.jsx
import React from 'react';
import './GenerarRecibo.css';

const GeneradorRecibos = () => {
    return (
        <div className="receipt-container">
           
            {/* Formulario de recibo */}
            <div className="receipt-card">
                <h2>Generador de Recibos de Pago</h2>

                <form>
                    <div className="select-group">
                        <label>Seleccionar Usuario:</label>
                        <select defaultValue="">
                            <option value="" disabled>Usuario: 1</option>
                            <option value="1">Usuario: 1</option>
                            <option value="2">Usuario: 2</option>
                            <option value="3">Usuario: 3</option>
                        </select>
                    </div>

                    <div className="info-group">
                        <div className="info-row">
                            <label>Nombre:</label>
                            <span>Juan</span>
                        </div>

                        <div className="info-row">
                            <label>Apellido:</label>
                            <span>Pérez</span>
                        </div>

                        <div className="info-row">
                            <label>Monto:</label>
                            <span>1000</span>
                        </div>

                        <div className="info-row">
                            <label>Concepto:</label>
                            <span>Pago</span>
                        </div>
                    </div>

                    <div className="button-container">
                        <button type="button" className="btn-export">
                            Exportar como PDF
                        </button>
                        <button type="button" className="btn-cancel">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GeneradorRecibos;
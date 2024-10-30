import React, { useState } from 'react';
import './matricula.css';

const EnrollmentForm = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [proofOfPayment, setProofOfPayment] = useState(null);
    const [parentName, setParentName] = useState('');
    const [parentID, setParentID] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [childName, setChildName] = useState('');
    const [period, setPeriod] = useState('4 meses');
    const [totalAmount, setTotalAmount] = useState(0);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleProofOfPaymentChange = (e) => {
        setProofOfPayment(e.target.files[0]);
    };

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
        setTotalAmount(e.target.value === 'Anual' ? 1000 : 300); // Ajusta los valores seg�n las tarifas reales
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Matr�cula realizada');
    };

    return (
        <div className="enrollment-form-container">
            <div className="enrollment-form">
                <h2>Formulario de Matr�cula</h2>
                <form onSubmit={handleSubmit}>
                    <div className="payment-section">
                        <h3>Opciones de Pago</h3>
                        <label>
                            <input
                                type="radio"
                                value="SINPE"
                                checked={paymentMethod === 'SINPE'}
                                onChange={handlePaymentMethodChange}
                            />
                            SINPE
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Efectivo"
                                checked={paymentMethod === 'Efectivo'}
                                onChange={handlePaymentMethodChange}
                            />
                            Efectivo
                        </label>
                        <div className="proof-of-payment">
                            <label>Agregar comprobante de pago:</label>
                            <input type="file" onChange={handleProofOfPaymentChange} />
                        </div>
                    </div>

                    <div className="parent-info">
                        <h3>Informaci�n del Padre</h3>
                        <label>Nombre del Padre:</label>
                        <input
                            type="text"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            required
                        />
                        <label>C�dula:</label>
                        <input
                            type="text"
                            value={parentID}
                            onChange={(e) => setParentID(e.target.value)}
                            required
                        />
                        <label>Tel�fono:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <label>Direcci�n:</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>

                    <div className="child-info">
                        <h3>Nombre del Ni�o(s) a Matricular</h3>
                        <input
                            type="text"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            required
                        />
                        <label>Per�odo de Matr�cula:</label>
                        <select value={period} onChange={handlePeriodChange}>
                            <option value="4 meses">4 meses</option>
                            <option value="Anual">Anual</option>
                        </select>
                        <p>Total a pagar: {totalAmount} XXX</p>
                    </div>

                    <div className="buttons">
                        <button type="submit" className="submit-m-button">Realizar Matr�cula</button>
                        <button type="button" className="cancel-m-button" onClick={() => window.location.href = '/main'}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnrollmentForm;

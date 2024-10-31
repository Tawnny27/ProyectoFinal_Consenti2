// PaymentRegistrationForm.jsx
import React from 'react';
import './RegistroPago.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

const FormularioRegistroPago = () => {
    return (
        <div className="fondo">
      
      
      
   
        
           {/* <Navbar />*/}
            {/* Formulario */}
            <div className="form-card">
                <h2>Registro de pago</h2>

                <form>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input type="text" />
                    </div>

                    <div className="form-group">
                        <label>Apellido:</label>
                        <input type="text" />
                    </div>

                    <div className="form-group">
                        <label>Cédula:</label>
                        <input type="text" />
                    </div>

                    <div className="form-group">
                        <label>Subir factura de pago (Solo PDF):</label>
                        <div className="file-input-wrapper">
                            <input type="file" id="file-input" accept=".pdf" />
                            <label htmlFor="file-input" className="file-label">
                                Seleccionar archivo
                            </label>
                        </div>
                    </div>

                    <div className="button-group">
                        <button type="submit" className="btn-submit">Enviar</button>
                        <button type="button" className="btn-cancel">Cancelar</button>
                    </div>
                </form>
            </div>
           
     
           {/* <Footer />*/}
            </div>

    );
};

export default FormularioRegistroPago;
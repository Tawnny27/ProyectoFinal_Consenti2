import React, { useState } from "react";
import "./comunicaciones.css";
import Footer from "../componentes/footer";
import Navbar from "../componentes/navbar";

const ComunicacionesMejorado = () => {
    const [formData, setFormData] = useState({
        destinatario: "",  // Cambiado a "destinatario" en lugar de "destinatarios"
        asunto: "",
        mensaje: "",
        archivo: null,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type.split('/')[0]; // Tipo de archivo (imagen, pdf, etc.)
            const fileSize = file.size; // Tamaño del archivo en bytes

            // Validación de tipo de archivo
            if (fileType !== 'image' && fileType !== 'application') {
                setError("Solo se permiten archivos de tipo imagen o documento.");
                return;
            }

            // Validación de tamaño máximo de archivo (por ejemplo, 5MB)
            if (fileSize > 5 * 1024 * 1024) {
                setError("El archivo debe ser menor a 5MB.");
                return;
            }

            setFormData({ ...formData, archivo: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSending) return;

        // Validaciones de campos obligatorios
        if (!formData.destinatario || !formData.asunto || !formData.mensaje) {
            setError("Error: Por favor complete los siguientes campos obligatorios.");
            return;
        }

        setError("");
        setSuccess("Enviando mensaje...");
        setIsSending(true);

        // Simula la llamada a la API (aquí es donde integrarías la llamada real)
        setTimeout(() => {
            setIsSending(false);
            setSuccess("El mensaje ha sido enviado exitosamente.");
            setFormData({
                destinatario: "",
                asunto: "",
                mensaje: "",
                archivo: null,
            });
        }, 2000); // Simula un retraso de 2 segundos
    };

    return (
        <div className="user-maintenance-container">
            <Navbar/>
            <div className="comunicacion_container">
                <h1 className="comunicacion_title">Sección de Mensajería</h1>
                <form className="comunicacion_form" onSubmit={handleSubmit}>
                    <label className="comunicacion_label">
                        Destinatario:
                        <input
                            type="text"
                            name="destinatario"  // Cambiado de "destinatarios" a "destinatario"
                            className="comunicacion_input"
                            placeholder="Ej. juanperez@email.com"
                            value={formData.destinatario}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className="comunicacion_label">
                        Asunto:
                        <input
                            type="text"
                            name="asunto"
                            className="comunicacion_input"
                            placeholder="Ej. Progreso académico"
                            value={formData.asunto}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className="comunicacion_label">
                        Mensaje:
                        <textarea
                            name="mensaje"
                            className="comunicacion_textarea"
                            placeholder="Escribe tu mensaje aquí..."
                            value={formData.mensaje}
                            onChange={handleInputChange}
                        ></textarea>
                    </label>
                    <label className="comunicacion_label">
                        Adjuntar archivo:
                        <input
                            type="file"
                            name="archivo"
                            className="comunicacion_file"
                            onChange={handleFileChange}
                        />
                        {formData.archivo && <p>{formData.archivo.name}</p>} {/* Muestra el nombre del archivo */}
                    </label>
                    {error && <p className="comunicacion_error">{error}</p>}
                    {success && <p className="comunicacion_success">{success}</p>}
                    <button type="submit" className="comunicacion_button" disabled={isSending}>
                        {isSending ? "Enviando..." : "Enviar"}
                    </button>
                </form>

                {/* Vista previa del mensaje */}
                {formData.destinatario || formData.asunto || formData.mensaje || formData.archivo ? (
                    <div className="comunicacion_preview">
                        <h3>Vista previa:</h3>
                        <p><strong>Asunto:</strong> {formData.asunto}</p>
                        <p><strong>Destinatario:</strong> {formData.destinatario}</p>
                        <p><strong>Mensaje:</strong> {formData.mensaje}</p>
                        {formData.archivo && <p><strong>Archivo adjunto:</strong> {formData.archivo.name}</p>}
                    </div>
                ) : null}
            </div>
            <Footer/>
        </div>
        
    );
};

export default ComunicacionesMejorado;

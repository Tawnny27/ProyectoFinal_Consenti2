import React, { useState } from "react";
import "./ActivityForm.css";
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

const ActivityForm = () => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [additional, setAdditional] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !date || !description) {
            setError("Todos los campos marcados con * son obligatorios.");
            setSuccess(false);
            return;
        }
        setError("");
        setSuccess(true);
        // Aquí puedes enviar los datos a la API o manejarlos como prefieras
        console.log({ title, date, image, description, additional });
        setTitle("");
        setDate("");
        setImage(null);
        setDescription("");
        setAdditional("");
    };

    return (
        <div className="user-maintenance-container">
            <Navbar />
            <div className="activity-form-container">
                <h2 className="activity-form-title">Agregar Nueva Actividad</h2>
                <form className="activity-form" onSubmit={handleSubmit}>
                    <label className="activity-form-label">
                        Título: *
                        <input
                            type="text"
                            className="activity-form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                    <label className="activity-form-label">
                        Fecha: *
                        <input
                            type="date"
                            className="activity-form-input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                    <label className="activity-form-label">
                        Imagen:
                        <input
                            type="file"
                            className="activity-form-input"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </label>
                    <label className="activity-form-label">
                        Descripción: *
                        <textarea
                            className="activity-form-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label className="activity-form-label">
                        Requisitos adicionales:
                        <input
                            type="text"
                            className="activity-form-input"
                            value={additional}
                            onChange={(e) => setAdditional(e.target.value)}
                        />
                    </label>
                    {error && <p className="activity-form-error">{error}</p>}
                    {success && <p className="activity-form-success">Actividad registrada correctamente.</p>}
                    <button type="submit" className="activity-form-submit">Registrar Actividad</button>
                </form>
            </div>
            < Footer/>
        </div>
    );
};

export default ActivityForm;

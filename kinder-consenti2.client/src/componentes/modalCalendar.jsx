import React from 'react';
import './estilos.css';



function ModalCalendar ({ showCalendarModal, handleDateSubmit, importantDate, setImportantDate, activityDescription, setActivityDescription, handleModalClose }) {
    return (
        showCalendarModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Registrar Actividad</h2>
                    <form onSubmit={handleDateSubmit}>
                        <label>
                            Fecha:
                            <input
                                className="date-input"
                                type="date"
                                value={importantDate}
                                onChange={(e) => setImportantDate(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Descripción de la Actividad:
                            <textarea
                                className="activity-textarea"
                                value={activityDescription}
                                onChange={(e) => setActivityDescription(e.target.value)}
                                required
                                rows="1"
                            />
                        </label>
                        <div className="modal-buttons">
                            <button type="submit" className="submit-button">Registrar</button>
                            <button type="button" onClick={handleModalClose} className="close-button">Cerrar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}

export default ModalCalendar;

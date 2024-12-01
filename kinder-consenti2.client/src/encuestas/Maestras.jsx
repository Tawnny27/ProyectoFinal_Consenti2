import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import ReactStars from 'react-rating-stars-component'; // Importar la librería de estrellas
import './encuestas.css';

const MaestrasFeedback = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    useEffect(() => {
        const fetchTeachersAndAvatars = async () => {
            try {
                // Obtener maestras de la API
                const response = await axios.get('https://localhost:44369/Usuarios/ObtenerUsuarios');
                const filteredTeachers = response.data.filter((user) => user.rolId === 2);

                // Obtener avatares de la API
                const avatarPromises = filteredTeachers.map(async (teacher) => {
                    const avatarResponse = await axios.get('https://avatar.iran.liara.run/public/girl', {
                        responseType: 'arraybuffer', // Asegura la respuesta como un blob
                    });
                    const avatarUrl = URL.createObjectURL(new Blob([avatarResponse.data]));
                    return { ...teacher, avatar: avatarUrl };
                });

                // Asignar avatares dinámicamente
                const teachersWithAvatars = await Promise.all(avatarPromises);
                setTeachers(teachersWithAvatars);
            } catch (error) {
                console.error('Error al obtener maestras o avatares:', error);
            }
        };

        fetchTeachersAndAvatars();
    }, []);

    const handleTeacherSelect = (teacher) => {
        setSelectedTeacher(teacher);
        setRating(0);
        setComment('');
    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleSubmitFeedback = async () => {
        if (rating && comment && selectedTeacher) {
            try {
                await axios.post('https://localhost:44369/Feedback/EnviarCalificacion', {
                    teacherId: selectedTeacher.idUsuario,
                    rating,
                    comment,
                });
                alert('¡Gracias por tu calificación!');
                setSelectedTeacher(null);
            } catch  {
                alert('Error al enviar la calificación:', error);
            }
        }
    };

    return (
        <div className="teachers-feedback-container">
            <Navbar />
            <div className="feedback-form-container" style={{ marginTop: '100px' }}>
                <h2 className="feedback-title">Retroalimentación y Calificación de Maestras</h2>

                {mensajeExito && <div className="success-message">{mensajeExito}</div>}

                <div className="cards-container">
                    {teachers.map((teacher) => (
                        <div
                            className={`card ${selectedTeacher?.idUsuario === teacher.idUsuario ? 'selected' : ''}`}
                            key={teacher.idUsuario}
                            onClick={() => handleTeacherSelect(teacher)}
                        >
                            <img src={teacher.avatar} alt={teacher.nombreUsuario} className="teacher-photo" />
                            <h4 className="teacher-name">{teacher.nombreUsuario}</h4>
                        </div>
                    ))}
                </div>

                {selectedTeacher && (
                    <div className="rating-form">
                        <h3 className="rating-title">Califica a {selectedTeacher.nombreUsuario}</h3>
                        <ReactStars
                            count={5}
                            size={30}
                            required
                            activeColor="#ffd700"
                            value={rating}
                            onChange={handleRatingChange}
                        />
                        <textarea
                            required
                            className="feedback-textarea"
                            placeholder="Escribe un comentario..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button type="submit"  className="feedback-submit-button" onClick={handleSubmitFeedback}>
                            Enviar Calificación
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>

    );
};

export default MaestrasFeedback;

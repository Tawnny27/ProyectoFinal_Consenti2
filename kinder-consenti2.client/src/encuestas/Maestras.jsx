import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactStars from 'react-rating-stars-component'; // Importar la librería de estrellas*/
import './encuestas.css';
import { ObtenerUsuarios, CrearEvaluacionDocente } from '../apiClient';
import axios from 'axios';

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
                const response = await ObtenerUsuarios();
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
        // Validación de los datos antes de enviarlos
        if (rating <= 0) {
            toast.error('Por favor, califica a la maestra con estrellas.');
            return; // Detiene la ejecución si no hay calificación
        }

        if (comment.trim() === '') {
            toast.error('Por favor, escribe un comentario.');
            return; // Detiene la ejecución si no hay comentario
        }


        try {
            const evaluacionDocente = {
                fecha: new Date().toISOString().split('T')[0],
                UsuarioId: selectedTeacher.idUsuario,
                Puntos: rating,
                Comentarios: comment
            };

            // Agrega un log para ver los datos antes de enviarlos
            console.log('Datos enviados:', evaluacionDocente);

            // Enviar la evaluación docente al servidor
            const response = await CrearEvaluacionDocente(evaluacionDocente);

            // Verifica la respuesta del servidor
            console.log('Respuesta del servidor:', response.data);

            toast.success('¡Gracias por tu calificación!');
            setSelectedTeacher(null);
            setRating(0);
            setComment('');
        } catch (error) {
            console.error('Error al enviar la calificación:', error);
            toast.error('Error al enviar la calificación');
        }
    };


    return (
        <div className="teachers-feedback-container">
       
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
                            <h4 className="teacher-name">{teacher.nombreUsuario} {teacher.apellidosUsuario}</h4>
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
                            
                            className="feedback-textarea"
                            placeholder="Escribe un comentario..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <button type="submit" className="submit-button" onClick={handleSubmitFeedback}>
                            Enviar Calificación
                        </button>
                    </div>
                )}
            </div>
   
        </div>

    );
};

export default MaestrasFeedback;

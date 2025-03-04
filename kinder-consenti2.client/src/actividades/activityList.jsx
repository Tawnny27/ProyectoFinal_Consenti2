﻿import React from 'react';
import { useEffect, useState } from "react";
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import Sidebar from "../componentes/Sidebar";
import "./activityList.css";
import { CrearEvento, ObtenerEventosActivos} from '../apiClient'; // Importar las funciones desde apiClient.js
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../UserContext'; // Importar el hook del contexto


const ListaActividades = () => {

    const [listaAct, setListaAct] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const { user } = useUserContext();
    //--------------------------------------------------------------------

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const fileInputRef = useState(null);
    const [imageError, setImageError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const [hover, setHover] = useState(false);   
    const [selectedFile, setSelectedFile] = useState(null);


    const envioEvento = {
        nombreEvento: title,
        descripcionEvento: description,
        fotoEvento: image,
        fecha: date,
    }

    const agregarEvento = async () => {
        console.log(envioEvento);   
        const createEventoResponse = await CrearEvento(envioEvento);
        if (createEventoResponse.data && selectedFile) {                   
            setearDatos();
        }       
        cargarLista();
    }

    //-----------------------------------------------------------------------------------------

    const validateImage = (file) => {
        if (!file) {
            throw new Error('Por favor seleccione una imagen');
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            throw new Error('Formato no permitido. Use JPG, PNG');
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error('La imagen excede el tamaño máximo de 5MB');
        }
        return true;
    };


    //------------------------------------------------------------------------------------------


    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const base64Image = async (file) => {
        const base64 = await convertToBase64(file);
        return base64;
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setImageError('');
        try {
            if (validateImage(file)) {
                setSelectedFile(file);
                const base64 = await base64Image(file);
                // Crear URL temporal para vista previa
                const previewURL = URL.createObjectURL(file);
                setPreviewUrl(previewURL);
                setImage(base64);
            } else {
                setImage('');
            }
        } catch (error) {
            setImageError(error.message);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    //-------------------------------------------------------------------------------------------
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
        agregarEvento();        
    }


    //----------------------------------------------------------------------------
    useEffect(() => {
        cargarLista();
    }, []);    

    const cargarLista = async () => {
        try {          
            const response = await ObtenerEventosActivos();
            setListaAct(response.data);

        } catch (error) {
            console.error("Error al cargar las actividades:", error);
        }
    }

    //--------------------------------------------------------------------------------
    const setearDatos = () => {
        setTitle("");
        setDate("");
        setImage(null);
        setDescription("");
        setSelectedFile(null);
        setPreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setModalVisible(false)
    }

    //-------------------------------------------------------------------------------

    const TextoConSaltosDeLinea = (texto) => {
        const textoConSaltosDeLinea = texto.split('\n').map((linea, index) => (
            <React.Fragment key={index}>
                {linea}
                <br />
            </React.Fragment>
        ));
        return textoConSaltosDeLinea
    }

    return (
        <div>
            <Navbar />
            <div className="content-container">
                <Sidebar />
                <main className="main-content">

                <div className="act-container">
                        <h1 className="act-header"> Lista de Actividades</h1>
                        <div className="add-container">
                            {user.rolId != 3 && (
                                <button onClick={() => setModalVisible(true)} className="button-agregar">
                                    Agregar Actividad
                                </button>
                            )}
                        </div>
                        <div className="contenedor">
                            
                    <div className="cards-container">                        
                        {listaAct.map((act) => (
                            <div key={act.idEventos} className="act-card">
                                <h4>{act.nombreEvento}</h4>
                                <p>{act.fecha}</p>

                                <div className="image-container"
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)} >

                                    <img className="card-imagen" src={act.fotoEvento} alt=""></img>
                                    {hover && (
                                        <div className="hover-info">{TextoConSaltosDeLinea(act.descripcionEvento)}</div>
                                    )}
                                </div>

                            </div>
                        ))
                        }
                            </div>
                    </div>

                    {modalVisible && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={setearDatos}>&times;</span>
                                <h2 className="activity-form-title">Agregar Nueva Actividad</h2>
                                <form className="activity-form" onSubmit={handleSubmit}>
                                    <label className="activity-form-label">
                                        Título:
                                        <input
                                            type="text"
                                            className="activity-form-input"
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </label>
                                    <label className="activity-form-label">
                                        Fecha:
                                        <input
                                            type="date"
                                            className="activity-form-input"
                                            required
                                            value={date}
                                            onChange={(e) => setDate(e.target.value) }
                                        />
                                    </label>

                                    { /****************************************************************************/}
                                    <div className="form-group">
                                        <label className="activity-form-label">
                                            Imagen:
                                        </label>
                                        <input
                                            type="file"
                                            className="activity-form-input"
                                            required
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept=".jpg,.jpeg,.png"
                                        />
                                        {previewUrl && (
                                            <div className="image-preview-container">
                                                <img
                                                    src={previewUrl}
                                                    alt="Vista previa"
                                                    className="image-preview"
                                                    style={{ maxWidth: '200px', marginTop: '10px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedFile(null);
                                                        setPreviewUrl('');
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = '';
                                                        }
                                                    }}
                                                    className="remove-image-btn"
                                                >
                                                    Eliminar imagen
                                                </button>
                                            </div>
                                        )}
                                        {imageError && (
                                            <div className="error-message" style={{ color: 'red', marginTop: '5px' }}>
                                                {imageError}
                                            </div>
                                        )}
                                        <div className="image-info"
                                            style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                            Formatos permitidos: JPG, PNG. Tamano maximo: 5MB
                                        </div>
                                    </div>
                                    { /****************************************************************************/}

                                    <label className="activity-form-label">
                                        Descripción:
                                        <textarea
                                            className="activity-form-input"
                                            value={description}
                                            required
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </label>

                                    {error && <p className="activity-form-error">{error}</p>}
                                    {success && <p className="activity-form-success">Actividad registrada correctamente.</p>}
                                    <button type="submit" className="activity-form-submit">Registrar Actividad</button>
                                </form>
                                { /*
                                    </div>
                                */}

                            </div>
                        </div>
                    )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>

    );
};

export default ListaActividades;
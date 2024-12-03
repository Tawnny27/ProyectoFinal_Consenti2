import React, { useEffect, useState } from "react";
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import "./materiales.css";

const MaterialesDidacticos = () => {
    const [materiales, setMateriales] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [nuevoMaterial, setNuevoMaterial] = useState({
        nombre: "",
        descripcion: "",
        documento: null,
        aula: "",  // Nuevo campo para aula
    });
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

    useEffect(() => {
        const cargarMateriales = () => {
            // Datos de ejemplo
            const materialesEjemplo = [
                {
                    id: 1,
                    nombre: "Guía de Matemáticas Básicas",
                    descripcion: "Una guía completa para aprender las operaciones básicas.",
                    documento: "guia_matematicas.pdf",
                    aula: "Aula 1"
                },
                {
                    id: 2,
                    nombre: "Cuentos Infantiles",
                    descripcion: "Una colección de cuentos para incentivar la lectura.",
                    documento: "cuentos_infantiles.pdf",
                    aula: "Aula 2"
                },
                {
                    id: 3,
                    nombre: "Manual de Ciencias Naturales",
                    descripcion: "Aprende sobre el medio ambiente con este manual ilustrado.",
                    documento: "manual_ciencias.pdf",
                    aula: "Aula 3"
                },
            ];

            // Simulación de carga
            setTimeout(() => {
                setMateriales(materialesEjemplo);
                setIsLoading(false);
            }, 1000); // Simula un retraso de 1 segundo
        };

        cargarMateriales();
    }, []);

    const agregarMaterial = () => {
        if (!nuevoMaterial.nombre || !nuevoMaterial.descripcion || !nuevoMaterial.documento || !nuevoMaterial.aula) {
            alert("Por favor, completa todos los campos.");
            return;
        }
        const nuevoId = materiales.length > 0 ? materiales[materiales.length - 1].id + 1 : 1;
        setMateriales([...materiales, { id: nuevoId, ...nuevoMaterial }]);
        setNuevoMaterial({ nombre: "", descripcion: "", documento: null, aula: "" });
        setModalVisible(false); // Cierra el modal al agregar el material
    };

    const descargarMaterial = (id, nombre) => {
        alert(`Se ha descargado el material: ${nombre}`);
    };

    const handleFileChange = (e) => {
        setNuevoMaterial({ ...nuevoMaterial, documento: e.target.files[0] });
    };

    const handleChange = (e) => {
        setNuevoMaterial({ ...nuevoMaterial, [e.target.name]: e.target.value });
    };

    const volverAPrincipal = () => {
        window.location.href = "/main";
    };

    return (
        <>
            <Navbar />
            <div className="materiales-container">
                <h2 className="materiales-header">Material Didáctico</h2>
                {isLoading ? (
                    <p className="materiales-loading">Cargando materiales...</p>
                ) : (
                    <div className="cards-container">
                        {materiales.map((material) => (
                            <div key={material.id} className="material-card">
                                <h4>{material.nombre}</h4>
                                <p className="material-description">{material.descripcion}</p>
                                <p>Aula: {material.aula}</p>
                                <p>Documento: {material.documento}</p>
                                <button
                                    onClick={() => descargarMaterial(material.id, material.nombre)}
                                    className="materiales-button"
                                >
                                    Descargar
                                </button>
                            </div>
                        ))}
                            <button onClick={() => setModalVisible(true)} className="button-agregar">
                                Agregar Nuevo Material
                            </button>
                    </div>
                )}

                {/* Modal para agregar nuevo material */}
                {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
                            <h3>Agregar Nuevo Material</h3>
                            <select
                                name="aula"
                                value={nuevoMaterial.aula}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar Aula</option>
                                <option value="Aula 1">Aula 1</option>
                                <option value="Aula 2">Aula 2</option>
                                <option value="Aula 3">Aula 3</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Título"
                                value={nuevoMaterial.nombre}
                                onChange={handleChange}
                                name="nombre"
                            />
                            <textarea
                                placeholder="Descripción"
                                value={nuevoMaterial.descripcion}
                                onChange={handleChange}
                                name="descripcion"
                            />
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                            />
                            
                            <button onClick={agregarMaterial} className="button-adjuntar">
                                Agregar Material
                            </button>
                        </div>
                    </div>
                )}

                {mensaje && (
                    <div className="materiales-empty">
                        <p>{mensaje}</p>
                        <button onClick={volverAPrincipal} className="button">
                            Volver a la página principal
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default MaterialesDidacticos;

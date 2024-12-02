import React, { useEffect, useState } from "react";
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

const MaterialesDidacticos = () => {
    const [materiales, setMateriales] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const cargarMateriales = async () => {
            try {
                setIsLoading(true);
                // Llamada a una API para obtener los materiales
                const response = await fetch("/api/materiales-didacticos");
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setMateriales(data);
                    } else {
                        setMensaje("Próximamente habrá más materiales.");
                    }
                } else {
                    setMensaje("Error al cargar los materiales. Inténtelo más tarde.");
                }
            } catch (error) {
                setMensaje("Hubo un error al obtener los materiales.");
            } finally {
                setIsLoading(false);
            }
        };

        cargarMateriales();
    }, []);

    const descargarMaterial = (id, nombre) => {
        // Simulación de descarga (se puede implementar con API de descarga real)
        alert(`Se ha descargado el material: ${nombre}`);
    };

    const volverAPrincipal = () => {
        // Navegar a la página principal (ajustar según la estructura de tu aplicación)
        window.location.href = "/main";
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Roboto, sans-serif" }}>
            <Navbar />
            <h2 style={{ color: "#48C9B0" }}>Material Didáctico</h2>
            {isLoading ? (
                <p>Cargando materiales...</p>
            ) : materiales.length > 0 ? (
                <div>
                    {materiales.map((material) => (
                        <div
                            key={material.id}
                            style={{
                                border: "1px solid #A569BD",
                                borderRadius: "8px",
                                marginBottom: "15px",
                                padding: "15px",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <h3 style={{ color: "#A569BD" }}>{material.nombre}</h3>
                            <p>{material.descripcion}</p>
                            <button
                                onClick={() => descargarMaterial(material.id, material.nombre)}
                                style={{
                                    padding: "10px 15px",
                                    backgroundColor: "#3498DB",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Descargar
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: "center" }}>
                    <p>{mensaje}</p>
                    <button
                        onClick={volverAPrincipal}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#A569BD",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "20px",
                        }}
                    >
                        Volver a la página principal
                    </button>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default MaterialesDidacticos;

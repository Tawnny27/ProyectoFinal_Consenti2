import React, { useEffect, useState } from "react";
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';

const FotosPorCarpeta = ({ rol, idUsuario }) => {
    const [carpetas, setCarpetas] = useState([]);
    const [nuevaCarpeta, setNuevaCarpeta] = useState("");
    const [idAlumno, setIdAlumno] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const cargarCarpetas = async () => {
            setIsLoading(true);
            try {
                let url = "/api/fotos/todas";
                if (rol === 3) {
                    url = `/api/fotos/porPadre/${idUsuario}`;
                }

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setCarpetas(data);
                } else {
                    setMensaje("Error al cargar las carpetas.");
                }
            } catch (error) {
                setMensaje("Hubo un error al obtener las carpetas.");
            } finally {
                setIsLoading(false);
            }
        };

        cargarCarpetas();
    }, [rol, idUsuario]);

    const agregarCarpeta = async () => {
        if (!nuevaCarpeta || !idAlumno) {
            setMensaje("Debe completar el nombre de la carpeta y el ID del alumno.");
            return;
        }

        try {
            const response = await fetch("/api/fotos/agregarCarpeta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: nuevaCarpeta, idAlumno }),
            });

            if (response.ok) {
                setMensaje("Carpeta agregada exitosamente.");
                setNuevaCarpeta("");
                setIdAlumno("");
                // Recargar carpetas
                const updatedCarpetas = await response.json();
                setCarpetas(updatedCarpetas);
            } else {
                setMensaje("Error al agregar la carpeta.");
            }
        } catch (error) {
            setMensaje("Hubo un error al agregar la carpeta.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Roboto, sans-serif" }}>
            <Navbar />
            <h2 style={{ color: "#48C9B0" }}>Fotos por Carpeta</h2>
            {isLoading ? (
                <p>Cargando carpetas...</p>
            ) : (
                <div>
                    {rol === 1 || rol === 2 ? (
                        <div style={{ marginBottom: "20px" }}>
                            <h3>Agregar nueva carpeta</h3>
                            <input
                                type="text"
                                placeholder="Nombre de la carpeta"
                                value={nuevaCarpeta}
                                onChange={(e) => setNuevaCarpeta(e.target.value)}
                                style={{ marginRight: "10px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                            />
                            <input
                                type="text"
                                placeholder="ID del alumno"
                                value={idAlumno}
                                onChange={(e) => setIdAlumno(e.target.value)}
                                style={{ marginRight: "10px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                            />
                            <button
                                onClick={agregarCarpeta}
                                style={{
                                    padding: "10px 15px",
                                    backgroundColor: "#3498DB",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Agregar Carpeta
                            </button>
                        </div>
                    ) : null}
                    <div>
                        {carpetas.length > 0 ? (
                            carpetas.map((carpeta) => (
                                <div
                                    key={carpeta.id}
                                    style={{
                                        border: "1px solid #A569BD",
                                        borderRadius: "8px",
                                        marginBottom: "15px",
                                        padding: "15px",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    <h3 style={{ color: "#A569BD" }}>{carpeta.nombre}</h3>
                                    <ul>
                                        {carpeta.fotos.map((foto, index) => (
                                            <li key={index}>
                                                <a href={foto.url} target="_blank" rel="noopener noreferrer">
                                                    {foto.nombre}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p>No hay carpetas disponibles.</p>
                        )}
                    </div>
                </div>
            )}
            {mensaje && <p style={{ color: "#e74c3c" }}>{mensaje}</p>}
            <Footer />
        </div>
    );
};

export default FotosPorCarpeta;

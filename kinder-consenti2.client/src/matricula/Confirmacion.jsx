import PropTypes from "prop-types";

export const Confirmacion = ({ cerrar, envioDatos, nombreAlumno, nombreRubro,  usSelect, matricula, subtotal, total }) => {

    // **Definición de PropTypes**
    Confirmacion.propTypes = {
        cerrar: PropTypes.func.isRequired,
        envioDatos: PropTypes.func.isRequired,
        nombreAlumno: PropTypes.func.isRequired,
        nombreRubro: PropTypes.func.isRequired,
        usSelect: PropTypes.shape({
            nombreUsuario: PropTypes.string.isRequired,
            apellidosUsuario: PropTypes.string.isRequired,
        }).isRequired,
        matricula: PropTypes.shape({
            detalles: PropTypes.arrayOf(
                PropTypes.shape({
                    alumnoId: PropTypes.string.isRequired,
                    productoId: PropTypes.string.isRequired,
                    monto: PropTypes.string.isRequired,
                })
            ).isRequired,
        }).isRequired,
        subtotal: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    };


    return (
        <div>
           
            <div className="enrollment-form">
                <h4 style={{ textAlign: "center"}}>Este es el desglose, ¿deseas continuar?</h4>
                <div>
                    <output>
                        Cliente: {usSelect.nombreUsuario + " " + usSelect.apellidosUsuario}
                    </output>
                </div>
                <br></br>

                <div>
                    <label>Detalles:</label>
                    {/* Encabezados */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr 1fr", // Define las columnas (proporción)
                        border: "1px solid #ccc", // Bordes alrededor de toda la tabla
                        width: "100%",
                        textAlign: "center",
                    }}>
                        <div
                            style={{
                                backgroundColor: "#f0f0f0",
                                padding: "10px",
                                borderBottom: "1px solid #ccc",
                                fontWeight: "bold", // Negrita para los encabezados
                            }}
                        >
                            Alumno
                        </div>
                        <div
                            style={{
                                backgroundColor: "#f0f0f0",
                                padding: "10px",
                                borderBottom: "1px solid #ccc",
                                fontWeight: "bold",
                            }}
                        >
                            Rubro
                        </div>
                        <div
                            style={{
                                backgroundColor: "#f0f0f0",
                                padding: "10px",
                                borderBottom: "1px solid #ccc",
                                fontWeight: "bold",
                            }}
                        >
                            Monto
                        </div>
                    </div>

                    {matricula.detalles.map((item, index) => (
                        <div key={index} style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2fr 1fr", // Define las columnas (proporción)
                            border: "1px solid #ccc", // Bordes alrededor de toda la tabla
                            width: "100%",
                            textAlign: "center",
                        }}
                        >
                            <input type="text" value={nombreAlumno(item.alumnoId)} readOnly />
                            <input type="text" value={nombreRubro(item.productoId)} readOnly />
                            <input type="text" value={"¢" + item.monto} readOnly />
                        </div>

                    ))}
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column", // Los elementos estarán uno debajo del otro
                        alignItems: "flex-end",  // Todo el contenido alineado al lado derecho
                        marginRight: "20px"     // Separación del borde derecho del contenedor
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                        <label style={{ width: "100px", textAlign: "left" }}>Subtotal:</label>
                        <output style={{ marginLeft: "10px" }}>¢{subtotal}</output>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                        <label style={{ width: "100px", textAlign: "left" }}>IVA:</label>
                        <output style={{ marginLeft: "10px" }}>¢{(subtotal * 0.13)}</output>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                        <label style={{ width: "100px", textAlign: "left" }}>Total:</label>
                        <output style={{ marginLeft: "10px" }}>¢{total}</output>
                    </div>
                </div>


                <div className="botones">
                    <button className="submit-m-button" onClick={() => { envioDatos(); cerrar(); }}>Aceptar</button>
                    <button className="cancel-m-button" onClick={cerrar}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};



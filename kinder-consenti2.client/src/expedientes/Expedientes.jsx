import React, { useState, useEffect } from 'react';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import DataTable from 'react-data-table-component';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import './expedientes.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar autotable si est�s utilizando esta extensi�n para tablas
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const Expedientes = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [filtro, setFiltro] = useState({ nombre: '', cedula: '' });
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // Obtener alumnos desde el endpoint
    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                const response = await axios.get('https://localhost:44369/Alumnos/ObtenerAlumnos');
                setAlumnos(response.data);
                setLoading(false);
                console.error('alumnos:', data);
            } catch (error) {
                console.error('Error al obtener los alumnos:', error);
                setLoading(false);
            }
        };

        fetchAlumnos();
    }, []);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltro((prev) => ({ ...prev, [name]: value }));
    };

    const handleExportarPDF = () => {
        if (!alumnoSeleccionado) return; // Aseg�rate de que haya un alumno seleccionado

        const doc = new jsPDF();

        // Agregar t�tulo del documento
        doc.setFontSize(16);
        doc.text('Expediente del Alumno', 105, 20, { align: 'center' });

        // Agregar tabla de informaci�n personal
        const datosPersonales = [
            ['Nombre', alumnoSeleccionado.nombreAlumno],
            ['Apellidos', alumnoSeleccionado.apellidosAlumno],
            ['C�dula', alumnoSeleccionado.cedulaAlumno],
            ['Fecha de Nacimiento', new Date(alumnoSeleccionado.fechaNacimiento).toLocaleDateString()],
            ['Edad', calcularEdad(alumnoSeleccionado.fechaNacimiento)],
            ['G�nero', alumnoSeleccionado.generoAlumno],
            ['Direcci�n', alumnoSeleccionado.direccionAlumno],
            ['Informaci�n Adicional', alumnoSeleccionado.informacionAdicional || 'No disponible'],
        ];
        doc.autoTable({
            startY: 30,
            head: [['Campo', 'Valor']],
            body: datosPersonales,
            theme: 'grid',
        });

        // Agregar tabla de contacto autorizado
        const contactoAutorizado = [
            ['Nombre', alumnoSeleccionado.nombreCompAutorizado],
            ['C�dula', alumnoSeleccionado.cedulaAutorizado],
            ['Relaci�n', alumnoSeleccionado.relacionAutorizado],
            ['Tel�fono', alumnoSeleccionado.telefonoAutorizado],
        ];
        doc.text('Contacto Autorizado', 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Campo', 'Valor']],
            body: contactoAutorizado,
            theme: 'grid',
        });

        // Agregar tabla de contacto de emergencia
        const contactoEmergencia = [
            ['Nombre', alumnoSeleccionado.nombreCompContacto],
            ['C�dula', alumnoSeleccionado.cedulaContacto],
            ['Relaci�n', alumnoSeleccionado.relacionContacto],
            ['Tel�fono', alumnoSeleccionado.telefonoContacto],
        ];
        doc.text('Contacto de Emergencia', 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Campo', 'Valor']],
            body: contactoEmergencia,
            theme: 'grid',
        });

        // Guardar el documento
        doc.save(`${alumnoSeleccionado.nombreAlumno}_expediente.pdf`);
        toast.success("Expediente exportado con �xito!");
    };



    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };


    const alumnosFiltrados = alumnos.filter((alumno) =>
        (alumno.nombreAlumno?.toLowerCase() || '').includes(filtro.nombre.toLowerCase()) &&
        (alumno.cedulaAlumno || '').includes(filtro.cedula)
    );

    console.log(alumnos); // Verifica el contenido de la lista de alumnos


    return (
        <div className="user-maintenance-container">
            {<Navbar />}
            <h2>Expedientes de Alumnos</h2>
            <div className="form-group">
                <input
                    type="text"
                    name="nombre"
                    placeholder="Buscar por nombre"
                    value={filtro.nombre}
                    onChange={handleFiltroChange}
                    className="form-control"
                />
                <input
                    type="text"
                    name="cedula"
                    placeholder="Buscar por c�dula"
                    value={filtro.cedula}
                    onChange={handleFiltroChange}
                    className="form-control"
                />
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>C�dula</th>
                            <th>Edad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                        <tbody>
                            {alumnosFiltrados.map((alumno) => (
                                <tr key={alumno.idAlumno}>
                                    <td>{alumno.nombreAlumno}</td>
                                    <td>{alumno.apellidosAlumno}</td>
                                    <td>{alumno.cedulaAlumno}</td>
                                    <td>{calcularEdad(alumno.fechaNacimiento)}</td> {/* Calcula la edad */}
                                    <td>
                                        <button
                                            className="submit-m-button"
                                            onClick={() => {
                                                setAlumnoSeleccionado(alumno);
                                                setModalVisible(true);
                                            }}
                                        >
                                            Expediente
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                </table>
            )}

            

            {modalVisible && alumnoSeleccionado && (
                <div className="expedientes-modal">
                    <div className="modal-content">
                        <h3>Detalles del Alumno</h3>
                        <p>Nombre: {alumnoSeleccionado.nombreAlumno}</p>
                        <p>Apellidos: {alumnoSeleccionado.apellidosAlumno}</p>
                        <p>C�dula: {alumnoSeleccionado.cedulaAlumno}</p>
                        <p>Fecha de Nacimiento: {new Date(alumnoSeleccionado.fechaNacimiento).toLocaleDateString()}</p>
                        <p>Edad: {calcularEdad(alumnoSeleccionado.fechaNacimiento)}</p>
                        <p>G�nero: {alumnoSeleccionado.generoAlumno}</p>
                        <p>Direcci�n: {alumnoSeleccionado.direccionAlumno}</p>
                        <p>Informaci�n Adicional: {alumnoSeleccionado.informacionAdicional || "No disponible"}</p>
                        <h4>Contacto Autorizado</h4>
                        <p>Nombre: {alumnoSeleccionado.nombreCompAutorizado}</p>
                        <p>C�dula: {alumnoSeleccionado.cedulaAutorizado}</p>
                        <p>Relaci�n: {alumnoSeleccionado.relacionAutorizado}</p>
                        <p>Tel�fono: {alumnoSeleccionado.telefonoAutorizado}</p>
                        <h4>Contacto de Emergencia</h4>
                        <p>Nombre: {alumnoSeleccionado.nombreCompContacto}</p>
                        <p>C�dula: {alumnoSeleccionado.cedulaContacto}</p>
                        <p>Relaci�n: {alumnoSeleccionado.relacionContacto}</p>
                        <p>Tel�fono: {alumnoSeleccionado.telefonoContacto}</p>
                        <button className="btn-primary" onClick={handleExportarPDF}>
                            Exportar a PDF
                        </button>
                        <button onClick={() => setModalVisible(false)} className="btn-secondary">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Expedientes;

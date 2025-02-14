
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlumnoMaintenance from './Alumnos/consultasA';
import LoginForm from './login/loginForm';
import EditarUsuario from './usuarios/EditarUsuarios';
import EditarAlumno from './Alumnos/EditarAlumno';
import MainLayout from './menu/mainLayout';
import UserMaintenance from './consultar_usuarios/consultas';
import ResetPassword from './login/resetPassword';
import ChangePassword from './login/changePassword';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistroUsuario from './usuarios/RegistroUsuario';
import RegistroPago from './Pagos/Registropago';
import GeneradorRecibos from './Pagos/GenerarRecibo';
import Matricula from './matricula/Matricula';
import Reportes from './Reportes/Reportes';
import ActivityPanel from './actividades/activityPanel';
import FacturaMaintenance from './Facturas/Facturas';
import Encuesta from './encuestas/Encuesta';
import MaestrasFeedback from './encuestas/Maestras';
import MaterialesDidacticos from './materiales/Materiales';
import FotosPorCarpeta from './materiales/Fotos';
import AttendancePanel from './asistencia/attendancePanel';
import ActivityForm from './actividades/activityForm';
import Inventario from './Inventario/Inventario';
import Gastos from './Gastos/Gastos';
import Comunicacion from './comunicaciones/comunicaciones';
import Expedientes from './expedientes/Expedientes';
import MonitoreoAlumno from './monitoreo/monitoreo';
import ComportamientoAlumno from './comportamiento/Comportamiento';
import ListaActividades from './actividades/activityList';
import ComunicacionMensajes from './comunicaciones/comunicacionesMensajes';
import Grupos from './Grupos/Grupos';
import FacturasPagadas from './consultar_pagado/FacturasPagadas.jsx';


function App() {
    return (
        <Router>
            <div>
                {/* Componente ToastContainer para notificaciones */}
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
                    <Route path="/editar-alumno/:id" element={<EditarAlumno />} />
                    <Route path="/main" element={<MainLayout />} />
                    <Route path="/user-maintenance" element={<UserMaintenance />} />
                    <Route path="/alumno-maintenance" element={<AlumnoMaintenance />} />
                    <Route path="/registrar-usuario" element={<RegistroUsuario />} /> {/* Nueva ruta */}                  
                    <Route path="/registrar-pago" element={<RegistroPago />} /> { /* eddy*/}
                    <Route path="/GenerarRecibo" element={<GeneradorRecibos />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/matricula" element={<Matricula />} />
                    <Route path="/expedientes" element={<Expedientes />} />
                    <Route path="/reportes" element={<Reportes />} />
                    <Route path="/activity-panel" element={<ActivityPanel />} />
                    <Route path="/activity-form" element={<ActivityForm />} />
                    <Route path="/attendance-panel" element={<AttendancePanel />} />
                    <Route path="/Factura-maintenance" element={<FacturaMaintenance />} />
                    <Route path="/registrar-encuesta" element={<Encuesta />} />
                    <Route path="/evalua-maestra" element={<MaestrasFeedback />} />
                    <Route path="/comunicacion" element={<Comunicacion />} />
                    <Route path="/comportamiento" element={<ComportamientoAlumno />} />
                    <Route path="/materiales" element={<MaterialesDidacticos />} />
                    <Route path="/fotos" element={<FotosPorCarpeta />} />
                    <Route path="/inventario" element={<Inventario />} />
                    <Route path="/Gastos" element={<Gastos />} />
                    <Route path="/monitoreo" element={<MonitoreoAlumno />} />
                    <Route path="/Lista-actividades" element={<ListaActividades />} />                   
                    <Route path="/GenerarRecibo" element={<GeneradorRecibos />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/matricula" element={<Matricula />} />
                    <Route path="/expedientes" element={<Expedientes />} />
                    <Route path="/reportes" element={<Reportes />} />
                    <Route path="/activity-panel" element={<ActivityPanel />} />
                    <Route path="/activity-form" element={<ActivityForm />} />
                    <Route path="/attendance-panel" element={<AttendancePanel />} />
                    <Route path="/Factura-maintenance" element={<FacturaMaintenance />} />
                    <Route path="/registrar-encuesta" element={<Encuesta />} />
                    <Route path="/evalua-maestra" element={<MaestrasFeedback />} />
                    <Route path="/comunicacion" element={<Comunicacion />} />
                    <Route path="/comunicacion-mensajes" element={<ComunicacionMensajes />} />
                    <Route path="/materiales" element={<MaterialesDidacticos />} />
                    <Route path="/fotos" element={<FotosPorCarpeta />} />
                    <Route path="/inventario" element={<Inventario />} />                    
                    <Route path="/Grupos" element={<Grupos />} />
                    <Route path="/facturas-pagadas" element={<FacturasPagadas />} />


                </Routes>
            </div>
        </Router>
    );

}

export default App;
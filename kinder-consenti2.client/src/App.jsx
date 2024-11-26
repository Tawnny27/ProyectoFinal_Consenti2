
import React from 'react';
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
import FormularioRegistroPago from './Pagos/Registropago'; 
import GeneradorRecibos from './Pagos/GenerarRecibo';
import Matricula from './matricula/Matricula';
import Reportes from './Reportes/Reportes';
import ActivityPanel from './actividades/activityPanel';
import FacturaMaintenance from './Facturas/Facturas';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
                <Route path="/editar-alumno/:id" element={<EditarAlumno />} />
                <Route path="/main" element={<MainLayout />} />
                <Route path="/user-maintenance" element={<UserMaintenance />} /> 
                <Route path="/alumno-maintenance" element={<AlumnoMaintenance />} /> 
                <Route path="/registrar-usuario" element={<RegistroUsuario />} /> {/* Nueva ruta */}
                <Route path="/registrar-pago" element={<FormularioRegistroPago />} /> 
                <Route path="/GenerarRecibo" element={<GeneradorRecibos />} /> 
                <Route path="/reset-password" element={<ResetPassword />} /> 
                <Route path="/change-password" element={<ChangePassword />} /> 
                <Route path="/matricula" element={<Matricula />} /> 
                <Route path="/reportes" element={<Reportes />} /> 
                <Route path="/activity-panel" element={<ActivityPanel />} /> 
                <Route path="/Factura-maintenance" element={<FacturaMaintenance />} /> 
            </Routes>
                
        </Router>
    );
    
}

export default App;
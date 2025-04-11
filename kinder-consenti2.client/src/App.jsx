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
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegistroUsuario from './usuarios/RegistroUsuario';
import RegistroPago from './Pagos/Registropago';
import GeneradorRecibos from './Pagos/GenerarRecibo';
import Matricula from './matricula/Matricula';
import {Matricula2} from './matricula/Matricula2';
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
import { VistaPrincipal } from './VistaPrincipal';

const router = createBrowserRouter(
    [
        { path: '/', element: <LoginForm /> },
        {
            path: '/pages',
            element: <VistaPrincipal />,
            children: [
                { index: true, element: <MainLayout /> },
                { path: 'main', element: < MainLayout /> },
                { path: 'editar-usuario/:id', element: <EditarUsuario /> },
                { path: 'editar-alumno/:id', element: <EditarAlumno /> },
                { path: 'user-maintenance', element: <UserMaintenance /> },
                { path: 'alumno-maintenance', element: <AlumnoMaintenance /> },
                { path: 'registrar-usuario', element: <RegistroUsuario /> },
                { path: 'registrar-pago', element: <RegistroPago /> },
                { path: 'GenerarRecibo', element: <GeneradorRecibos /> },                            
                { path: 'matricula', element: <Matricula /> },
                { path: 'matricula2', element: <Matricula2 /> },
                { path: 'expedientes', element: <Expedientes /> },
                { path: 'reportes', element: <Reportes /> },
                { path: 'activity-panel', element: <ActivityPanel /> },
                { path: 'activity-form', element: <ActivityForm /> },
                { path: 'attendance-panel', element: <AttendancePanel /> },
                { path: 'Factura-maintenance', element: <FacturaMaintenance /> },
                { path: 'registrar-encuesta', element: <Encuesta /> },
                { path: 'evalua-maestra', element: <MaestrasFeedback /> },
                { path: 'comunicacion', element: <Comunicacion /> },
                { path: 'comportamiento', element: <ComportamientoAlumno /> },
                { path: 'materiales', element: <MaterialesDidacticos /> },
                { path: 'fotos', element: <FotosPorCarpeta /> },
                { path: 'inventario', element: <Inventario /> },
                { path: 'Gastos', element: <Gastos /> },
                { path: 'monitoreo', element: <MonitoreoAlumno /> },
                { path: 'Lista-actividades', element: <ListaActividades /> },
                { path: 'comunicacion-mensajes', element: <ComunicacionMensajes /> },
                { path: 'Grupos', element: <Grupos /> },
           
            ]
        },
        { path: 'change-password', element: <ChangePassword /> },
        { path: 'reset-password', element: <ResetPassword /> },  
       
    ],
    {
        future: {
            v7_relativeSplatPath: true,
        },
    }
);

function App() {
    return (
        <RouterProvider router={router}>
            <div>
                {/* Componente ToastContainer para notificaciones */}
                <ToastContainer />
            </div>
        </RouterProvider>
    );
}

export default App;

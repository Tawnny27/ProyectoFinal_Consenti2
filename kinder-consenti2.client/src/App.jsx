
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginForm from './login/loginForm';
import EditarUsuario from './usuarios/EditarUsuarios';
import MainLayout from './menu/mainLayout';
import UserMaintenance from './consultar_usuarios/consultas';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistroUsuario from './usuarios/RegistroUsuario'; // Importar el nuevo componente de registro

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
                <Route path="/main" element={<MainLayout />} />
                <Route path="/user-maintenance" element={<UserMaintenance />} /> 
                <Route path="/registrar-usuario" element={<RegistroUsuario />} /> {/* Nueva ruta */}
            </Routes>
                
        </Router>
    );
    
}

export default App;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginForm from './login/loginForm';
import EditarUsuario from './usuarios/EditarUsuarios';
import MainLayout from './menu/mainLayout';
import UserMaintenance from './consultar_usuarios/consultas';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
                <Route path="/main" element={<MainLayout />} />
                <Route path="/user-maintenance" element={<UserMaintenance />} /> 
            </Routes>
                
        </Router>
    );
    
}

export default App;
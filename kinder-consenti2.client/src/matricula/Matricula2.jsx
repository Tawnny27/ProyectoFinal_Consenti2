import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './matricula.css';
import { useUserContext } from '../UserContext';
import { BuscarUsuarios, ObtenerUsuarios, ObtenerProductosfijos, ObtenerProductosMensuales, CrearMatricula, } from '../apiClient'; // Importar las funciones desde apiClient.js

export const Matricula2 = () => {
  
    const { user } = useUserContext();

    return (
        <div className="content-container">   
            <main className="main-content">
                <h1> Hello World</h1>   
                <div className="content-matricula">
                    <div className="enrollment-form">
                        <h2>Formulario de Matrícula</h2>
                    </div>
                </div>
            </main>
        </div>
    );
}
//-------------------------------------------------------------------------------------------------------------




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
                <div className="content-matricula">
                    <div className="enrollment-form">
                        <h2>Formulario de Matrícula</h2>
                        <form>
                            {user.rolId === 1 ? (
                                <div>
                                    <label> Seleccione un Padre</label>
                                    <select value="">
                                        <option>Padre1</option>
                                        <option>Padre2</option>
                                    </select>
                                </div>
                            ):(
                            <div>
                                <label>Padre</label>
                                <input type="text" />
                            </div>
                            )}
                            
                            
                            <div>
                                <label>Hijos</label>
                                <input type="text" />
                            </div>
                            <div>
                                <label>Opcional</label>
                                <input type="text" />
                            </div>
                            <div>
                                <label>Opcional</label>
                                <input type="text" />
                            </div>
                            <div>
                                <label>Opcional</label>
                                <input type="text" />
                            </div>
                            <div className="botones">
                                <button type="submit" className="submit-m-button"> Enviar</button>
                                <button type="reset" className="cancel-m-button"> Borrar</button>
                            </div>
                        </form>
                    </div>
                </div >
            </main >
        </div >
    );
}
//-------------------------------------------------------------------------------------------------------------




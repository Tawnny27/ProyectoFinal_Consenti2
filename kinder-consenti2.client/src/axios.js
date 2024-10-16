// src/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://localhost:44369/Usuarios/CrearUsuario/', // Asegúrate de que esta URL apunte a tu backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;

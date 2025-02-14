import axios from 'axios';

// Configurar Axios con la base URL de tu API
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Aquí usamos la variable de entorno
});

//*************************************************Usuario**********************************************/

// Función para acceder al sistema
export const accesoUsuarios = async (email, password) => {
    try {
        const response = await apiClient.post('api/AccesoUsuario2', {
            correo: email,
            contrasenna: password
        });
        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error.response?.data || error.message);
        return (error.response?.data || 'Error en el inicio de sesión. Revisa tus credenciales.');
    }
};



// Función para agregar un producto (POST)
export const addProducto = async (producto) => {
    try {
        const response = await apiClient.post('/productos', producto);
        return response.data;
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        throw error;
    }
};

// Función para actualizar un producto (PUT)
export const updateProducto = async (id, producto) => {
    try {
        await apiClient.put(`/productos/${id}`, producto);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        throw error;
    }
};

// Función para eliminar un producto (DELETE)
export const deleteProducto = async (id) => {
    try {
        await apiClient.delete(`/productos/${id}`);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        throw error;
    }
};

/********************************************Factura**************************************/

export const DetallesApagar = async (id) => {
    try {
        const response = await apiClient.get(`api/DetallesApagar/${id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

export const BuscarUsuarios = async (id) => {
    try {
        const response = await apiClient.get(`api/BuscarUsuarios/${id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};


export const obtenerPadres = async () => {
    try {
        const response = await apiClient.get('api/obtenerPadres');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
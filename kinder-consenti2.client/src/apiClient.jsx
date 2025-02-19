import axios from 'axios';

// Configurar Axios con la base URL de tu API
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Aquí usamos la variable de entorno
});

//*************************************************Usuario**********************************************

// Función para acceder al sistema (Correo y contraseña)
export const AccesoUsuarios = async (email, password) => {
    try {
        const response = await apiClient.post('api/AccesoUsuario', {
            correo: email,
            contrasenna: password
        });
        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error.response?.data || error.message);
        return (error.response?.data || 'Error en el inicio de sesión. Revisa tus credenciales.');
    }
};
// Función para buscar un usuario por Id
export const BuscarUsuarios = async (id) => {
    try {
        const response = await apiClient.get(`api/BuscarUsuarios/${id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
// Función para optener lo usuarios padres registrados
export const ObtenerPadres = async () => {
    try {
        const response = await apiClient.get('api/ObtenerPadres');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerUsuarios = async (filters) => {
    try {
        const response = await apiClient.get('api/ObtenerUsuarios', { params: filters });
        return response;
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerMaestros = async () => {
    try {
        const response = await apiClient.get('api/ObtenerMaestros');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearUsuario = async (usuario) => {
    try {
        const response = await apiClient.post('api/CrearUsuario', usuario);
        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error.response?.data || error.message);
        return (error.response?.data || 'Error en el inicio de sesión. Revisa tus credenciales.');
    }
};
export const CambiarContrasena = async (email, newPassword, confirmPassword) => {
    try {
        const response = await apiClient.put('api/CambiarContrasena', {
            correo: email,
            contrasenna: newPassword,
            contrasennaValidacion: confirmPassword
        });
        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error.response?.data || error.message);
        return (error.response?.data || 'Error en el inicio de sesión. Revisa tus credenciales.');
    }
};
export const RecuperarContrasena = async (email) => {
    try {
        const response = await apiClient.put('api/RecuperarContrasena', { correo: email });
        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error.response?.data || error.message);
        return (error.response?.data || 'Error en el inicio de sesión. Revisa tus credenciales.');
    }
};
export const EditarUsuario = async (usuario) => {
    try {
        const response = await apiClient.put('api/RecuperarContrasena', usuario);
        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error.response?.data || error.message);
        return (error.response?.data || 'Error en el inicio de sesión. Revisa tus credenciales.');
    }
};
export const EliminarUsuario = async (id) => {
    try {
        const response = await apiClient.delete(`api/EliminarUsuario/${id}`);
        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error.response?.data || error.message);
        return (error.response?.data || 'Error en el inicio de sesión. Revisa tus credenciales.');
    }
};

/*
--ObtenerUsuarios
--ObtenerMaestros
--CrearUsuario(usuario)
--CambiarContrasena(Acceso)
--RecuperarContrasena(Acceso{correo})
--EditarUsuario(usuario)
--EliminarUsuario/{id}
*/

//********************************************Factura**************************************

export const DetallesApagar = async (id) => {
    try {
        const response = await apiClient.get(`api/DetallesApagar/${id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearPago = async (DatosPago) => {
    try {
        const response = await apiClient.post('api/CrearPago', DatosPago, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerFacturas = async () => {
    try {
        const response = await apiClient.get('api/ObtenerFacturas');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerFacturasPendientes = async () => {
    try {
        const response = await apiClient.get('api/ObtenerFacturasPendientes');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const DarAltaFactura = async (idfact, status) => {
    try {
        const response = await apiClient.put(`api/DarAltaFactura/${idfact}&${status}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarFactura = async (id) => {
    try {
        const response = await apiClient.get(`api/BuscarFactura/${id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearMatricula = async (DatosMatricula) => {
    try {
        const response = await apiClient.post('api/CrearMatricula', DatosMatricula, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarDetallesFactura = async (idEncabezado) => {
    try {
        const response = await apiClient.get(`api/BuscarDetallesFactura/${idEncabezado}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
--DetallesApagar/{idEncabezado}
--CrearPago(DatosMatricula)
--ObtenerFacturas
--ObtenerFacturasPendientes
--DarAltaFactura/{idfact}&{status}
--BuscarFactura/{id}
--CrearMatricula(DatosMatricula)
--BuscarDetallesFactura
 
*/
//********************************************Actividades**************************************

//Baño###############

export const ObtenerActividadBannos = async (gruposId, fecha) => {
    try {
        const response = await apiClient.get(`api/ObtenerActividadBannos/${gruposId}&${fecha}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarActividadBannos = async (idAlumno) => {
    try {
        const response = await apiClient.get(`api/BuscarActividadBannos/${idAlumno}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearActividadBanno = async (ListaActividadBanno) => {
    try {
        const response = await apiClient.post('api/CrearActividadBanno', ListaActividadBanno, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarActividadBanno = async (ActividadBanno) => {
    try {
        const response = await apiClient.put('api/EditarActividadBanno', ActividadBanno, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

//Comidas###############

export const ObtenerActividadComidas = async (gruposId, fecha) => {
    try {
        const response = await apiClient.get(`api/ObtenerActividadComidas/${gruposId}&${fecha}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarActividadComidas = async (idAlumno) => {
    try {
        const response = await apiClient.get(`api/BuscarActividadComidas/${idAlumno}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearActividadComidas = async (ListaActividadComidas) => {
    try {
        const response = await apiClient.post('api/CrearActividadComidas', ListaActividadComidas, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarActividadComida = async (ActividadComida) => {
    try {
        const response = await apiClient.put('api/EditarActividadComida', ActividadComida, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

//Dormir###############

export const ObtenerActividadDormirs = async (gruposId, fecha) => {
    try {
        const response = await apiClient.get(`api/ObtenerActividadDormirs/${gruposId}&${fecha}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarActividadDormirs = async (idAlumno) => {
    try {
        const response = await apiClient.get(`api/BuscarActividadDormirs/${idAlumno}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearActividadDormir = async (ListaActividadDormir) => {
    try {
        const response = await apiClient.post('api/CrearActividadDormir', ListaActividadDormir, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarActividadDormir = async (ActividaDormir) => {
    try {
        const response = await apiClient.put('api/EditarActividadDormir', ActividaDormir, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

//Huerta###############

export const ObtenerActividadHuertas = async (gruposId, fecha) => {
    try {
        const response = await apiClient.get(`api/ObtenerActividadHuertas/${gruposId}&${fecha}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarActividadHuertas = async (idAlumno) => {
    try {
        const response = await apiClient.get(`api/BuscarActividadHuertas/${idAlumno}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearActividadHuerta = async (ListaActividadHuerta) => {
    try {
        const response = await apiClient.post('api/CrearActividadHuerta', ListaActividadHuerta, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarActividadHuerta = async (ActividaHuerta) => {
    try {
        const response = await apiClient.put('api/EditarActividadHuerta', ActividaHuerta, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
/* 
    --ObtenerActividadBannos/{gruposId}&{fecha}
    --BuscarActividadBannos/{idAlumno}
    --CrearActividadBanno(List<ActividadBanno> )
    --EditarActividadBanno(ActividadBanno)

    --ObtenerActividadComidas/{gruposId}&{fecha}
    --BuscarActividadComidas/{idAlumno}
    --CrearActividadComidas(List<ActividadComida>)
    --EditarActividadComida(ActividadComida)

    --ObtenerActividadDormirs/{gruposId}&{fecha}
    --BuscarActividadDormirs/{idAlumno}
    --CrearActividadDormir(List<ActividadDormir>)
    --EditarActividadDormir(ActividadDormir)

    --ObtenerActividadHuertas/{gruposId}&{fecha}
    --BuscarActividadHuertas/{idAlumno}
    --CrearActividadHuerta(List<ActividadHuerta>)
    --EditarActividadHuerta(ActividadHuerta)
*/

//********************************************Alumnos**************************************

export const ObtenerAlumnos = async () => {
    try {
        const response = await apiClient.get('api/ObtenerAlumnos');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarAlumno = async (IdAlumno) => {
    try {
        const response = await apiClient.get(`api/BuscarAlumno/${IdAlumno}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearAlumno = async (alumno) => {
    try {
        const response = await apiClient.post('api/CrearAlumno', alumno, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarAlumnoo = async (alumno) => {
    try {
        const response = await apiClient.put('api/EditarAlumno', alumno, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EliminarAlumno = async (IdAlumno) => {
    try {
        const response = await apiClient.delete(`api/EliminarAlumno/${IdAlumno}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
/*
    --ObtenerAlumnos
    --BuscarAlumno/{id}
    --CrearAlumno(Alumno)
    --EditarAlumno(Alumno)
    --EliminarAlumno/{id}
*/

//********************************************Categorias**************************************

export const ObtenerCategorias = async () => {
    try {
        const response = await apiClient.get('api/ObtenerCategorias');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarCategorias = async (Id) => {
    try {
        const response = await apiClient.get(`api/BuscarCategorias/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearCategoria = async (categoria) => {
    try {
        const response = await apiClient.post('api/CrearCategoria', categoria, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarCategoria = async (categoria) => {
    try {
        const response = await apiClient.put('api/EditarCategoria', categoria, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EliminarCategoria = async (Id) => {
    try {
        const response = await apiClient.delete(`api/EliminarCategoria/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
    --ObtenerCategorias
    --BuscarCategorias/{id}
    --CrearCategoria(Categoria)
    --EditarCategoria(Categoria)
    --EliminarCategoria/{id}
*/

//********************************************Evaluacion docente**************************************

export const ObtenerEvaluacionesDocente = async (idDocente, fechaInicio, fechaFin) => {
    try {
        const response = await apiClient.get(`api/ObtenerEvaluacionesDocente/${idDocente}&${fechaInicio}&${fechaFin}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerEvalaucionDocente = async (Id) => {
    try {
        const response = await apiClient.get(`api/ObtenerEvalaucionDocente/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearEvaluacionDocente = async (EvaluacionDocente) => {
    try {
        const response = await apiClient.post('api/CrearEvaluacionDocente', EvaluacionDocente, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
    ObtenerEvaluacionesDocente/{idDocente}&{fechaInicio}&{fechaFin}
    ObtenerEvalaucionDocente/{id}
    CrearEvaluacionDocente(EvaluacionDocente)
*/

//********************************************Evaluacion Kinder**************************************

export const ObtenerEvaluaciones = async (fechaInicio, fechaFin) => {
    try {
        const response = await apiClient.get(`api/ObtenerEvaluaciones/${fechaInicio}&${fechaFin}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerEvaluacion = async (Id) => {
    try {
        const response = await apiClient.get(`api/ObtenerEvaluacion/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearEvaluacionKinder = async (EvaluacionKinder) => {
    try {
        const response = await apiClient.post('api/CrearEvaluacionDocente', EvaluacionKinder, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
    ObtenerEvaluaciones/{fechaInicio}&{FechaFin}
    ObtenerEvaluacion/{id}
    CrearEvaluacionKinder(EvaluacionKinder)
*/

//********************************************Eventos************************************************
export const ObtenerEventos = async () => {
    try {
        const response = await apiClient.get('api/ObtenerEventos');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerEventosActivos = async () => {
    try {
        const response = await apiClient.get('api/ObtenerEventosActivos');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerEventosInactivos = async () => {
    try {
        const response = await apiClient.get('api/ObtenerEventosInactivos');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearEvento = async (evento) => {
    try {
        const response = await apiClient.post('api/CrearEvento', evento, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarEvento = async (evento) => {
    try {
        const response = await apiClient.put('api/EditarEvento', evento, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
   --ObtenerEventos
   --ObtenerEventosActivos
   --ObtenerEventosInactivos
   --ObtenerEvento/{id}
   --CrearEvento(Eventos)
   --EditarEvento(Eventos)
   
*/

//********************************************Expediente************************************************

export const ObtenerExpediente = async (idAlumno) => {
    try {
        const response = await apiClient.get(`api/ObtenerExpediente/${idAlumno}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerExpedienteId = async (Id) => {
    try {
        const response = await apiClient.get(`api/ObtenerExpedienteId/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearExpediente = async (expediente) => {
    try {
        const response = await apiClient.post('api/CrearExpediente', expediente, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarExpediente = async (expediente) => {
    try {
        const response = await apiClient.put('api/EditarExpediente', expediente, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
   --ObtenerExpediente/{idAlumno}
   --ObtenerExpedienteId/{id}
   --CrearExpediente(Expediente)
   --EditarExpediente(Expediente)   
*/

//********************************************FotosAlumno************************************************
export const ObtenerFotosAlumnos = async () => {
    try {
        const response = await apiClient.get('api/ObtenerFotosAlumno');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerFotosAlumno = async (idAlumno) => {
    try {
        const response = await apiClient.get(`api/ObtenerFotosAlumno/${idAlumno}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearFotosAlumno = async (FotoAlumno) => {
    try {
        const response = await apiClient.post('api/CrearFotosAlumno', FotoAlumno, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarFotosAlumno = async (FotoAlumno) => {
    try {
        const response = await apiClient.put('api/EditarFotosAlumno', FotoAlumno, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EliminarFotosAlumno = async (Id) => {
    try {
        const response = await apiClient.delete(`api/EliminarFotosAlumno/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
   ObtenerFotosAlumno
   ObtenerFotosAlumno/{AlumnoId}
   EditarFotosAlumno(FotoAlumno)
   CrearFotosAlumno(FotoAlumno)
   EliminarFotosAlumno/{id}
*/

//********************************************Gastos****************************************************
export const ObtenerGastos = async (anno, mes) => {
    try {
        const response = await apiClient.get(`api/ObtenerGastos/${anno}&${mes}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarGastoxFecha = async (fecha) => {
    try {
        const response = await apiClient.get(`api/BuscarGastoxFecha/${fecha}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearGasto = async (gasto) => {
    try {
        const response = await apiClient.post('api/CrearGasto', gasto, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarGasto = async (gasto) => {
    try {
        const response = await apiClient.put('api/EditarGasto', gasto, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EliminarGasto = async (Id) => {
    try {
        const response = await apiClient.delete(`api/EliminarGasto/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
    --ObtenerGastos/{año}&{mes}
    --BuscarGastoxFecha/{fecha}
    --CrearGasto(Gasto)
    --EditarGasto(Gasto)
    --EliminarGasto/{id}
*/

//********************************************GruposAlumnos**********************************************
export const ObtenerGrupoAlumnos = async (idGrupo) => {
    try {
        const response = await apiClient.get(`api/ObtenerGrupoAlumnos/${idGrupo}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerGrupoAlumnosXmaesto = async (idMaestro) => {
    try {
        const response = await apiClient.get(`api/ObtenerGrupoAlumnosXmaesto/${idMaestro}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarGruposAlumno = async (idAlumno) => {
    try {
        const response = await apiClient.get(`api/BuscarGruposAlumno/${idAlumno}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearGruposAlumno = async (GruposAlumnos) => {
    try {
        const response = await apiClient.post('api/CrearGruposAlumno', GruposAlumnos, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EliminarGruposAlumno = async (Id) => {
    try {
        const response = await apiClient.delete(`api/EliminarGruposAlumno/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
/*
   ObtenerGrupoAlumnos/{idGrupo}
   ObtenerGrupoAlumnosXmaesto/{idMaestro}
   BuscarGruposAlumno/{idAlumno}
   CrearGruposAlumno(GruposAlumnos)
   EliminarGruposAlumno/{id}
*/

//********************************************Grupos*****************************************************

export const ObtenerGrupos = async () => {
    try {
        const response = await apiClient.get('api/ObtenerGrupos');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarGrupo = async (Id) => {
    try {
        const response = await apiClient.get(`api/BuscarGrupo/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearGrupo = async (Grupo) => {
    try {
        const response = await apiClient.post('api/CrearGrupo', Grupo, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarGrupos = async (Grupo) => {
    try {
        const response = await apiClient.put('api/EditarGrupos', Grupo, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EliminarGrupos = async (Id) => {
    try {
        const response = await apiClient.delete(`api/EliminarGrupos/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
/*
   ObtenerGrupos
   BuscarGrupo/{id}
   CrearGrupo(Grupos)
   EditarGrupos(Grupos)
   EliminarGrupos/{id}
*/

//********************************************Imagenes************************************************

export const GuardarMaterialDidacticoPdf = async (FileImage) => {
    try {
        const response = await apiClient.post('api/GuardarMaterialDidacticoPdf', FileImage, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const GuardarImagenPago = async (FileImage) => {
    try {
        const response = await apiClient.post('api/GuardarImagenPago', FileImage, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const GuardarFotosNinno = async (FileImage) => {
    try {
        const response = await apiClient.post('api/GuardarFotosNino', FileImage, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const GuardarImagenEvento = async (FileImage) => {
    try {
        const response = await apiClient.post('api/GuardarImagenEvento', FileImage, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
    GuardarMaterialDidacticoPdf(IFormFile)
    --GuardarImagenPago(IFormFile)
    GuardarFotosNiño(IFormFile)   
    GuardarImagenEvento(IFormFile)

*/

//********************************************Inventario************************************************
export const ObtenerInventario = async () => {
    try {
        const response = await apiClient.get('api/ObtenerInventario');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarInventario = async (Id) => {
    try {
        const response = await apiClient.get(`api/BuscarInventario/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearInventario = async (inventario) => {
    try {
        const response = await apiClient.post('api/CrearInventario', inventario, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarInventario = async (inventario) => {
    try {
        const response = await apiClient.put('api/EditarInventario', inventario, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EliminarInventario = async (Id) => {
    try {
        const response = await apiClient.delete(`api/EliminarInventario/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
    ObtenerInventario
    BuscarInventario/{id}
    CrearInventario(Inventario)
    EditarInventario(Inventario)
    EliminarInventario/{id}
*/

//********************************************Lista de asistencia************************************************

export const ObtenerListaAsistencia = async (gruposId, fecha) => {
    try {
        const response = await apiClient.get(`api/ObtenerListaAsistencia/${gruposId}&${fecha}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerListaAsistenciaAlumno = async (idAlumno) => {
    try {
        const response = await apiClient.get(`api/ObtenerListaAsistenciaAlumno/${idAlumno}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearListaAsistencia = async (ListaAsistencia) => {
    try {
        const response = await apiClient.post('api/CrearListaAsistencia', ListaAsistencia, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ActualizarAsistencia = async (ListaAsistencia) => {
    try {
        const response = await apiClient.put('api/ActualizarAsistencia', ListaAsistencia, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
/*
    ObtenerListaAsistencia/{gruposId}&{fecha}
    ObtenerListaAsistenciaAlumno/{idAlumno}
    ActualizarAsistencia(ListaAsistencia)
    CrearListaAsistencia(List<ListaAsistencia>)
*/


//********************************************Movimiento Inventario********************************************

export const ObtenerMovimientos = async () => {
    try {
        const response = await apiClient.get('api/ObtenerMovimientos');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarMovimiento = async (Id) => {
    try {
        const response = await apiClient.get(`api/BuscarMovimiento/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearMovimiento = async (MovimientosInventario) => {
    try {
        const response = await apiClient.post('api/CrearMovimiento', MovimientosInventario, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarMovimiento = async (MovimientosInventario) => {
    try {
        const response = await apiClient.put('api/EditarMovimiento', MovimientosInventario, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EliminarMovimiento = async (Id) => {
    try {
        const response = await apiClient.delete(`api/EliminarMovimiento/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
    ObtenerMovimientos
    BuscarMovimiento/{id}
    CrearMovimiento(MovimientosInventario)
    EditarMovimiento(MovimientosInventario)
    EliminarMovimiento/{id}
*/

//********************************************Materia Didactico************************************************
export const ObtenerMaterialesDidacticos = async () => {
    try {
        const response = await apiClient.get('api/ObtenerMaterialesDidacticos');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerMaterialesDidacticosAct = async () => {
    try {
        const response = await apiClient.get('api/ObtenerMaterialesDidacticosAct');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerMaterialesDidacticosInact = async () => {
    try {
        const response = await apiClient.get('api/ObtenerMaterialesDidacticosInact');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerMaterialesDidacticosPadre = async (idPadre) => {
    try {
        const response = await apiClient.get(`api/ObtenerMaterialesDidacticosPadre/${idPadre}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerMaterialDidactico = async (Id) => {
    try {
        const response = await apiClient.get(`api/ObtenerMaterialDidactico/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const ObtenerMaterialDidacticoGrupo = async (idGrupo) => {
    try {
        const response = await apiClient.get(`api/ObtenerMaterialDidacticoGrupo/${idGrupo}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const InactivarMaterialDidactico = async (Id) => {
    try {
        const response = await apiClient.put(`api/InactivarMaterialDidactico/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearMaterialDidactico = async (MaterialDidactico) => {
    try {
        const response = await apiClient.post('api/CrearMaterialDidactico', MaterialDidactico, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarMaterialDidactico = async (MaterialDidactico) => {
    try {
        const response = await apiClient.put('api/EditarMaterialDidactico', MaterialDidactico, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EliminarMaterialDidactico = async (Id) => {
    try {
        const response = await apiClient.delete(`api/EliminarMaterialDidactico/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
/*
    ObtenerMaterialesDidacticos
    ObtenerMaterialesDidacticosAct
    ObtenerMaterialesDidacticosInact
    ObtenerMaterialesDidacticosPadre/{idPadre}
    ObtenerMaterialDidactico/{id}
    ObtenerMaterialDidacticoGrupo/{idGrupo}
    InactivarMaterialDidactico/{id}      
    CrearMaterialDidactico(MaterialDidactico)
    EditarMaterialDidactico(MaterialDidactico)  
    EliminarMaterialDidactico/{id}
*/

//********************************************Roles************************************************************
//se creo este por que el ObtenerRoles normal estaba dando problemas, y para no afectar su funcionamiento en otros lugares no se modifico
export const ObtenerRolesRegistro = async () => {
    try {
        const response = await apiClient.get('api/ObtenerRoles');
        return response.data;  // Regresamos solo los datos
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        return [];
    }
};

export const ObtenerRoles = async () => {
    try {
        const response = await apiClient.get('api/ObtenerRoles');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const BuscarRol = async (Id) => {
    try {
        const response = await apiClient.get(`api/BuscarRol/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const CrearRol = async (Rol) => {
    try {
        const response = await apiClient.post('api/CrearRol', Rol, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EditarRol = async (Rol) => {
    try {
        const response = await apiClient.put('api/EditarRol', Rol, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
export const EliminarRol = async (Id) => {
    try {
        const response = await apiClient.delete(`api/EliminarRol/${Id}`);
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

/*
    ObtenerRoles
    BuscarRol/{id}
    CrearRol(Rol)
    EditarRol(Rol)
    EliminarRol/{id}
*/
//

//********************************************Productos************************************************************
export const ObtenerProductosfijos = async () => {
    try {
        const response = await apiClient.get('api/ObtenerProductosfijos');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};

export const ObtenerProductosMensuales = async () => {
    try {
        const response = await apiClient.get('api/ObtenerProductosMensuales');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};


export const ObtenerAlimentacion = async () => {
    try {
        const response = await apiClient.get('api/ObtenerAlimentacion');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};
//

//ALUMNOS
export const GuardarImagenPerfilAlumno = async (file, fileName) => {
    try {
        const imageFormData = new FormData();
        imageFormData.append('file', file);
        imageFormData.append('fileName', fileName); // Nombre único generado para la imagen

        const response = await apiClient.post('api/GuardarImagenPerfilAluno', imageFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    } catch (error) {
        console.error("Error al guardar imagen del alumno:", error);
        throw error;
    }
};

export const ActualizarEstadoFactura = async (idFactura, nuevoEstado) => {
    try {
        const response = await apiClient.put(`api/DarAltaFactura/${idFactura}&${nuevoEstado}`);
        return response;
    } catch (error) {
        console.error('Error al actualizar el estado de la factura:', error);
        return ('Validar los datos:', error.response?.data);
    }
};

export const ObtenerUsuarioPorId = async (usuarioId) => {
    try {
        const response = await apiClient.get(`api/BuscarUsuarios/${usuarioId}`);
        return response;
    } catch (error) {
        console.error('Error al obtener el usuario por ID:', error);
        return ('Validar los datos:', error.response?.data);
    }
};

// Obtener gastos por fecha
export const ObtenerGastosPorFecha = async (fechaFiltro) => {
    try {
        const response = await apiClient.get(`api/BuscarGastoxFecha/${fechaFiltro}`);
        return response;
    } catch (error) {
        console.error('Error al cargar los gastos:', error);
        return 'Validar los datos:', error.response?.data;
    }
};

// Crear un gasto
export const CrearrGasto = async (nuevoGasto) => {
    try {
        const response = await apiClient.post('api/CrearGasto', nuevoGasto);
        return response;
    } catch (error) {
        console.error('Error al crear el gasto:', error);
        return 'Validar los datos:', error.response?.data;
    }
};












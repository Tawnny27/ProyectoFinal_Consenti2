import axios from 'axios';

// Configurar Axios con la base URL de tu API
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Aquí usamos la variable de entorno
});

//*************************************************Usuario**********************************************

// Función para acceder al sistema (Correo y contraseña)
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
export const obtenerPadres = async () => {
    try {
        const response = await apiClient.get('api/obtenerPadres');
        return (response);
    } catch (error) {
        console.error('Error al cargar los datos :', error);
        return ('Validar los datos:', error.response?.data);
    }
};



/*
ObtenerUsuarios
ObtenerMaestros
CrearUsuario(usuario)
CambiarContrasena(Acceso)
RecuperarContrasena(Acceso{correo})
EditarUsuario(usuario)
EliminarUsuario/{id}
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
        /*
        ObtenerFacturas
        ObtenerFacturasPendientes
        DarAltaFactura/{idfact}&{status}
        "BuscarFactura/{id}
        CrearMatricula(DatosMatricula)
        CrearPago(DatosMatricula)
        BuscarDeallesFactura/{idEncabezado}
        CrearDetallesFactura
        
        */

//********************************************Actividades**************************************

/* 
    ObtenerActividadBannos/{gruposId}&{fecha}
    BuscarActividadBannos/{idAlumno}
    CrearActividadBanno(List<ActividadBanno> )
    EditarActividadBanno(ActividadBanno)

    ObtenerActividadComidas/{gruposId}&{fecha}
    BuscarActividadComidas/{idAlumno}
    CrearActividadComidas(List<ActividadComida>)
    EditarActividadComida(ActividadComida)

    ObtenerActividadDormirs/{gruposId}&{fecha}
    BuscarActividadDormirs/{idAlumno}
    CrearActividadDormir(List<ActividadDormir>)
    EditarActividadDormir(ActividadDormir)

    ObtenerActividadHuertas/{gruposId}&{fecha}
    BuscarActividadHuertas/{idAlumno}
    CrearActividadHuerta(List<ActividadHuerta>)
    EditarActividadHuerta(ActividadHuerta)
*/

//********************************************Alumnos**************************************

/*
    ObtenerAlumnos
    BuscarAlumno/{id}
    CrearAlumno(Alumno)
    EditarAlumno(Alumno)
    "EliminarAlumno/{id}
*/

//********************************************Categorias**************************************
/*
    ObtenerCategorias
    BuscarCategorias/{id}
    CrearCategoria(Categoria)
    EditarCategoria(Categoria)
    EliminarCategoria/{id}
*/

//********************************************Evaluacion docente**************************************
/*
    ObtenerEvaluacionesDocente/{idDocente}&{fechaInicio}&{fechaFin}
    ObtenerEvalaucionDocente/{id}
    CrearEvaluacionDocente(EvaluacionDocente)
*/

//********************************************Evaluacion Kinder**************************************
/*
    ObtenerEvaluaciones/{fechaInicio}&{FechaFin}
    ObtenerEvaluacion/{id}
    CrearEvaluacionKinder(EvaluacionKinder)
*/

//********************************************Eventos************************************************
/*
   ObtenerEventos
   ObtenerEventosActivos
   ObtenerEventosInactivos
   ObtenerEvento/{id}
   EditarEvento(Eventos)
   CrearEvento(Eventos)
*/

//********************************************Expediente************************************************
/*
   ObtenerExpediente/{idAlumno}
   ObtenerExpedienteId/{id}
   EditarExpediente(Expediente)
   CrearExpediente(Expediente)
*/

//********************************************FotosAlumno************************************************
/*
   ObtenerFotosAlumno
   ObtenerFotosAlumno/{AlumnoId}
   EditarFotosAlumno(FotoAlumno)
   CrearFotosAlumno(FotoAlumno)
   EliminarFotosAlumno/{id}
*/

//********************************************Gastos************************************************
/*
    ObtenerGastos/{año}&{mes}
    BuscarGastoxFecha/{fecha}
    CrearGasto(Gasto)
    EditarGasto(Gasto)
    EliminarGasto/{id}
*/

//********************************************GruposAlumnos************************************************
/*
   ObtenerGrupoAlumnos/{idGrupo}
   ObtenerGrupoAlumnosXmaesto/{idMaestro}
   BuscarGruposAlumno/{idAlumno}
   CrearGruposAlumno(GruposAlumnos)
   EliminarGruposAlumno/{id}
*/

//********************************************Grupos*******************************************************
/*
   ObtenerGrupos
   BuscarGrupo/{id}
   CrearGrupo(Grupos)
   EditarGrupos(Grupos)
   EliminarGrupos/{id}
*/

//********************************************Imagenes************************************************
/*
    GuardarMaterialDidacticoPdf(IFormFile)
    GuardarImagenPago(IFormFile)
    GuardarFotosNiño(IFormFile)
    GuardarMaterialDidacticoPdf(IFormFile)
    GuardarImagenEvento(IFormFile)

*/

//********************************************Inventario************************************************
/*
    ObtenerInventario
    BuscarInventario/{id}
    CrearInventario(Inventario)
    EditarInventario(Inventario)
    EliminarInventario/{id}
*/

//********************************************Lista de asistencia************************************************
/*
    ObtenerListaAsistencia/{gruposId}&{fecha}
    ObtenerListaAsistenciaAlumno/{idAlumno}
    ActualizarAsistencia(ListaAsistencia)
    CrearListaAsistencia(List<ListaAsistencia>)
*/

//********************************************Inventario************************************************
/*
    ObtenerListaAsistencia/{gruposId}&{fecha}
    ObtenerListaAsistenciaAlumno/{idAlumno}
    ActualizarAsistencia(ListaAsistencia)
    CrearListaAsistencia(List<ListaAsistencia>)
*/

//
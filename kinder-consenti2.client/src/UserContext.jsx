import { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
const UserProvider = ({ children }) => {
     const [user, setUser] = useState(()=>{
         const valorGuardado = localStorage.getItem('miContextDatos');
         return valorGuardado ? JSON.parse(valorGuardado) : {};
     });    

    useEffect(() => {
        // Guardar el valor en localStorage cuando cambie
        localStorage.setItem('miContextDatos', JSON.stringify(user));
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
     );
    
};
// Hook para usar el contexto 
const useUserContext = () => {
    return useContext(UserContext);
};
export { UserProvider, useUserContext };


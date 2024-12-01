import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const UserContext = createContext();


// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook para usar el contexto fácilmente
export const useUser = () => useContext(UserContext);

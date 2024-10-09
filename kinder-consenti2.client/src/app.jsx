import React from "react";
import FormularioUsuarioInterno from "./components/FormularioUsuarioInterno"; // Importa el formulario

const App = () => {
  return (
    <div className="App">
      <header>
        <h1>Registro de Usuario Interno</h1>
      </header>
      <main>
        <FormularioUsuarioInterno /> {/* Renderiza el formulario */}
      </main>
    </div>
  );
};

export default App;

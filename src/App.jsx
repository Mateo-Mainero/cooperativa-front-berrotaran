import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login"; // Componente Login
import AdminPanel from "./AdminPanel"; // Componente del Panel de Administrador
import UserPanel from "./UserPanel"; // Cambia la importación aquí


// Componente de protección de rutas (requiere autenticación)
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("authToken");
  return token ? element : <Navigate to="/" />;
};


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Ruta principal (login) */}
          <Route path="/admin" element={<AdminPanel />} /> {/* Ruta para el panel de administrador */}
          <Route path="/users" element={<UserPanel />} /> {/* Cambia la ruta aquí */}
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;




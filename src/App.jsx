import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login"; // Componente Login
import AdminPanel from "./AdminPanel"; // Componente del Panel de Administrador
import TurnosPanel from "./TurnosPanel"; // Cambia la importación aquí
import MenuPrincipal from "./Components/MenuPrincipal/MenuPrincipal";
import PagoServicios from "./Components/PagoServicios/PagoServicios";


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
          <Route path="/panel-usuarios" element={<TurnosPanel />} /> {/* Cambia la ruta aquí */}
          <Route path="/menu" element={<MenuPrincipal />} />
          <Route path="/servicios" element={<PagoServicios />} />
        <Route path="/mesa-de-entrada" element={<div>Mesa de Entrada</div>} />
        <Route path="/cobranzas" element={<div>Cobranzas</div>} />
        <Route path="/servicios-sociales" element={<div>Servicios Sociales</div>} />
        <Route path="/otros-facturacion" element={<div>Otros/Facturación</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




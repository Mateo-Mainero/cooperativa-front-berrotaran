import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"; // Componente Login


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Ruta principal (login) */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;




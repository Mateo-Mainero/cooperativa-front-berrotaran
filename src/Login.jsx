import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para manejar redirecciones
import axios from "axios";
import Avatar from "@mui/material/Avatar"; // Importamos el Avatar de Material UI
import "./styles/login.css";
import { jwtDecode } from "jwt-decode"; // Asegúrate de usar la importación correcta

function Login() {
    const [formData, setFormData] = useState({
      usuario: "",
      password: "",
    });
  
    const navigate = useNavigate(); // Hook para redirecciones
  
    const handleChange = (event) => {
      const { id, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log("Datos ingresados:", formData);
  
      try {
        const response = await axios.post("http://localhost:3000/auth/login", formData);
        console.log("Respuesta del servidor:", response.data);
  
        if (response.data.success) {
          const token = response.data.detalles; // Accediendo al token
          console.log("Token recibido:", token);
          const decodedToken = jwtDecode(token); // Decodificar el token
          console.log("Token decodificado:", decodedToken);
  
          // Guardar el token en el almacenamiento local
          localStorage.setItem("authToken", token);
  
          // Redirección basada en el idrol
          switch (decodedToken.idrol) {
            case 1:
              navigate("/admin"); // Redirige a la ruta de administrador
              break;
            case 2:
              navigate("/ruta-a-definir"); // Redirige a una ruta pendiente de definir
              break;
            default:
              navigate("/login"); // Redirige al login por defecto
              break;
          }
        } else {
          alert("Inicio de sesión fallido.");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor: " + error.message);
      }
    };
  
    return (
      <div className="login-container">
        <a href="/contact" className="contact-link">Contactanos</a>
        <div className="login-box">
          <div className="avatar-container">
            <Avatar
              alt="Foto de perfil"
              src="" // Aquí puedes agregar un enlace de imagen si lo deseas
              sx={{
                width: 100,
                height: 100,
                margin: "0 auto",
                marginBottom: "20px",
              }}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="usuario">Usuario:</label>
              <input
                type="text"
                id="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
              />
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    );
  }
  
  export default Login;
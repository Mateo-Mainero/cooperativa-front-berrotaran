import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import styles from './login.module.scss';
import { jwtDecode } from "jwt-decode";

function Login() {
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const checkTokenExpiration = (token) => {
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    return currentTime >= expirationTime;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Datos ingresados:", formData);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", formData);
      console.log("Respuesta del servidor:", response.data);

      if (response.data.success) {
        const token = response.data.detalles;
        console.log("Token recibido:", token);

        if (checkTokenExpiration(token)) {
          alert("El token ha expirado. Inicia sesión nuevamente.");
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }

        localStorage.setItem("authToken", token);
        const decodedToken = jwtDecode(token);
        console.log("Token decodificado:", decodedToken);

        switch (decodedToken.idrol) {
          case 1:
            navigate("/admin");
            break;
          case 2:
            navigate("/caja-1");
            break;
          case 3:
            navigate("/caja-2");
            break;
          case 4:
            navigate("/mesa-entrada-1");
            break;
          case 5:
            navigate("/mesa-entrada-2");
            break;
          case 6:
            navigate("/mesa-entrada-3");
            break;
          case 7:
            navigate("/cobranzas");
            break;
          case 8:
            navigate("/servicios-sociales");
            break;
          default:
            navigate("/login");
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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && checkTokenExpiration(token)) {
      alert("El token ha expirado. Inicia sesión nuevamente.");
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className={styles.loginContainer}>
      <a href="/contact" className={styles.contactLink}>Contactanos</a>
      <div className={styles.loginBox}>
        <div className="avatar-container">
          <Avatar
            alt="Foto de perfil"
            src=""
            sx={{ width: 100, height: 100, margin: "0 auto", marginBottom: "20px" }}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="usuario">Usuario:</label>
            <input
              type="text"
              id="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
            />
          </div>
          <div className={styles.formGroup}>
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



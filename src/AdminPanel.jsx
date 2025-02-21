import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import './AdminPanel.css'; // Archivo de estilos CSS

const socket = io("http://localhost:3000"); // Conectar al servidor de Socket.IO

function AdminPanel() {
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState({
    username: "",
    email: "",
    avatarUrl: "",  // Para el avatar
  });
  const [users, setUsers] = useState([]);
  const [liveTurns, setLiveTurns] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Cargar usuarios, turnos y perfil del administrador al iniciar
  useEffect(() => {
    fetchUsers();
    fetchLiveTurns();
    fetchAdminProfile();
    socket.on("turn-update", (data) => {
      setLiveTurns(data);
    });
    return () => socket.disconnect(); // Desconectar Socket.IO al desmontar
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchLiveTurns = async () => {
    try {
      const response = await axios.get("http://localhost:3000/live-turns", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setLiveTurns(response.data);
    } catch (error) {
      console.error("Error fetching live turns:", error);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setAdminProfile(response.data);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put("http://localhost:3000/profile", adminProfile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setIsEditing(false); // Finalizar la edición
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (e) => {
    setAdminProfile({
      ...adminProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/"); // Redirigir al inicio
  };

  return (
    <div className="admin-panel">
      {/* Barra superior */}
      <AppBar position="sticky" className="navbar">
        <Toolbar>
          <img src="../src/assets/logo1.png" height="10%" width="10%" alt="Logo de la Empresa" className="navbar-logo" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <div className="main-content">
        <Box mt={4}>
          <Grid container spacing={3}>
            {/* Información del perfil */}
            <Grid item xs={12} sm={4}>
              <Box className="profile-box">
                <Avatar src={adminProfile.avatarUrl} alt={adminProfile.username} sx={{ width: 100, height: 100, marginBottom: 2 }} />
                <Typography variant="h6">{adminProfile.username}</Typography>
                <Typography variant="body2">{adminProfile.email}</Typography>
                {isEditing ? (
                  <>
                    <TextField
                      label="Nombre de Usuario"
                      variant="outlined"
                      fullWidth
                      name="username"
                      value={adminProfile.username}
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="Correo Electrónico"
                      variant="outlined"
                      fullWidth
                      name="email"
                      value={adminProfile.email}
                      onChange={handleInputChange}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateProfile}
                      style={{ marginTop: 10 }}
                    >
                      Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setIsEditing(true)}
                    style={{ marginTop: 10 }}
                  >
                    Editar Perfil
                  </Button>
                )}
              </Box>
            </Grid>

            {/* Usuarios en Vivo */}
            <Grid item xs={12} sm={8}>
              <Typography variant="h5" gutterBottom>
                Turnos en Vivo
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {liveTurns.map((turn) => (
                      <TableRow key={turn.id}>
                        <TableCell>{turn.id}</TableCell>
                        <TableCell>{turn.description}</TableCell>
                        <TableCell>{turn.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Lista de usuarios */}
              <Typography variant="h5" gutterBottom mt={4}>
                Usuarios del Sistema
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Rol</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </div>

      {/* Barra lateral con cerrar sesión al final */}
      <div className="sidebar">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          className="logout-button"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}

export default AdminPanel;






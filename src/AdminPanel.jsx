import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import {
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Box,
  Grid,
} from "@mui/material";
import "./AdminPanel.module.css"; // Archivo de estilos CSS

const socket = io("http://localhost:3000"); // Conectar al servidor de Socket.IO

function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [liveTurns, setLiveTurns] = useState([]);
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [adminProfile, setAdminProfile] = useState({
    username: "",
    email: "",
  });

  // Cargar usuarios y perfil del administrador al iniciar
  useEffect(() => {
    fetchUsers();
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

  const handleCreateUser = async () => {
    try {
      await axios.post("http://localhost:3000/users", newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      fetchUsers(); // Recargar la lista de usuarios
      setOpenCreateUser(false); // Cerrar el diálogo
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put("http://localhost:3000/profile", adminProfile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setOpenEditProfile(false); // Cerrar el diálogo
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="admin-panel">
      {/* Barra lateral */}
      <div className="sidebar">
        <div className="logo">AdminPanel</div>
        <ul className="menu">
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Usuarios</a></li>
          <li><a href="#">Turnos</a></li>
          <li><a href="#" onClick={handleLogout}>Cerrar Sesión</a></li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <AppBar position="static" className="navbar">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Panel de Administrador
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Toolbar>
        </AppBar>

        <Box mt={4}>
          <Grid container spacing={3}>
            {/* Botones principales */}
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setOpenCreateUser(true)}
                className="button-create"
              >
                Crear Usuario
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => setOpenEditProfile(true)}
                className="button-edit"
              >
                Modificar Perfil
              </Button>
            </Grid>
          </Grid>

          {/* Lista de usuarios */}
          <Typography variant="h5" gutterBottom mt={4}>
            Usuarios del Sistema
          </Typography>
          <TableContainer component={Paper} className="table-container">
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

          {/* Turnos en vivo */}
          <Typography variant="h5" gutterBottom mt={4}>
            Turnos en Vivo
          </Typography>
          <TableContainer component={Paper} className="table-container">
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
        </Box>
      </div>

      {/* Diálogos para crear usuario y modificar perfil */}
      {/* ... (El código del diálogo sigue igual) */}
    </div>
  );
}

export default AdminPanel;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Typography,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import './AdminPanel.scss';

const socket = io("http://localhost:3000");

function AdminPanel() {
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState({ username: "", email: "", avatarUrl: "" });
  const [users, setUsers] = useState([]);
  const [liveTurns, setLiveTurns] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.idrol !== 1) {
        navigate("/login");
        return;
      }
      setIsAuthenticated(true);
      fetchData();
      socket.on("turn-update", (data) => setLiveTurns(data));
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [userRes, turnsRes, profileRes] = await Promise.all([
        axios.get("http://localhost:3000/users", { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }),
        axios.get("http://localhost:3000/live-turns", { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }),
        axios.get("http://localhost:3000/profile", { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } })
      ]);
      setUsers(userRes.data);
      setLiveTurns(turnsRes.data);
      setAdminProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="admin-panel">


      <div className="sidebar">
        <Avatar src={adminProfile.avatarUrl} alt="Admin" sx={{ width: 80, height: 80 }} />
        
        <Typography variant="h6">Panel de Administración</Typography>
     
        <Typography variant="h6">{adminProfile.username}</Typography>
        <Typography variant="body2">{adminProfile.email}</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>

      <main className="content">
        <Typography variant="h5">Turnos en Vivo</Typography>
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
      </main>
    </div>
  );
}

export default AdminPanel;







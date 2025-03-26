import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import  "./LlamadorTurnos.module.scss";
//import notificacionAudio from "./notificacion.mp3";
import logo1 from "/src/assets/logo1.png"; // Mueve las imágenes a /src/assets/
import logo2 from "/src/assets/logo2.png";
import logo3 from "/src/assets/logo3.jpg";

const TurnosTable = () => {
  const [turnos, setTurnos] = useState([
    { numero: "0001", estado: "LLAMANDO", area: "CAJA 1" },
    { numero: "0002", estado: "LLAMANDO", area: "CAJA 2" },
    { numero: "0003", estado: "LLAMANDO", area: "MESA DE ENTRADA 1" },
    { numero: "0004", estado: "LLAMANDO", area: "CUENTAS CORRIENTES" },
    { numero: "0005", estado: "ESPERA", area: "MESA DE ENTRADA 2" },
    { numero: "0006", estado: "ESPERA", area: "MESA DE ENTRADA 1" },
  ]);

  useEffect(() => {
    const interval = setInterval(avanzarTurno, 10000);
    return () => clearInterval(interval);
  }, [turnos]);

  const avanzarTurno = () => {
    let turnoLlamado = false;
    const nuevosTurnos = turnos.map((turno) => {
      if (turno.estado === "LLAMANDO") {
        return { ...turno, estado: "ESPERA" };
      } else if (turno.estado === "ESPERA" && !turnoLlamado) {
        turnoLlamado = true;
        new Audio(notificacionAudio).play();
        mostrarSweetAlert(turno.numero, turno.area);
        return { ...turno, estado: "LLAMANDO" };
      }
      return turno;
    });
    setTurnos(nuevosTurnos);
  };

  const mostrarSweetAlert = (turno, area) => {
    Swal.fire({
      title: `Llamando al Turno ${turno}`,
      text: `Área: ${area}`,
      imageUrl: logo1,
      imageWidth: 100,
      imageHeight: 100,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      backdrop: true,
    });
  };

  return (
    <div className="tablet-container text-center">
      <img src={logo3} alt="Logo" className="logo" />
      <table className="table table-bordered table-striped text-center">
        <thead className="table-primary">
          <tr>
            <th>NUMERO</th>
            <th>ESTADO</th>
            <th>ÁREA</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno, index) => (
            <tr
              key={index}
              className={turno.estado === "LLAMANDO" ? "highlight" : ""}
            >
              <td>{turno.numero}</td>
              <td className={turno.estado === "LLAMANDO" ? "text-danger fw-bold" : "text-success fw-bold"}>
                {turno.estado}
              </td>
              <td>{turno.area}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="image-public">
        <img src={logo2} alt="Publicidad" />
      </div>
      <p className="footer-text">© E&M Systems. Todos los derechos reservados</p>
    </div>
  );
};

export default TurnosTable;

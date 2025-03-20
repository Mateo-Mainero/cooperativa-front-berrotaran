import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./VisualizadorTickets.module.scss";
import logo1 from "../../assets/logo1.png";
import logo2 from "../../assets/logo2.png";

const socket = io("http://localhost:4000"); // Asegúrate de que el backend corre en este puerto

const VisualizadorTickets = () => {
  const [ticketNumber, setTicketNumber] = useState("0001");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("updateTicket", (newTicket) => {
      setTicketNumber(newTicket);

      // Enviar ticket a la impresora térmica con Axios
      axios
        .post("http://localhost:4000/print-ticket", { ticketNumber: newTicket })
        .then(() => console.log("Ticket enviado a la impresora"))
        .catch((error) => console.error("Error al imprimir el ticket:", error));

      // Después de 3 segundos, volver al menú
      setTimeout(() => {
        navigate("/menu");
      }, 3000);
    });

    return () => {
      socket.off("updateTicket");
    };
  }, [navigate]);

  return (
    <div className={styles["tablet-container"]}>
      <div className={styles["logo-container"]}>
        <img src={logo1} alt="Logo" className={styles["logo"]} />
      </div>

      <div className={styles["text-one"]}>
        <h1>PAGO DE SERVICIOS</h1>
      </div>

      <div className={styles["ticket-number"]}>
        TU NÚMERO DE TICKET ES: N° {ticketNumber}
      </div>

      <div className={styles["image-public"]}>
        <img src={logo2} alt="Publicidad" />
      </div>

      <div className={styles["footer-text"]}>
        E&M Systems. Todos los derechos reservados.
      </div>
    </div>
  );
};

export default VisualizadorTickets;



import PropTypes from "prop-types";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import logo from "../assets/logoEstudio.png"; // Asegúrate de que la ruta a tu imagen de logo es correcta
import whatsappIcon from "/whatsapp.png"; // Asegúrate de que la ruta a tu imagen de WhatsApp es correcta
import "../styles/NavBar.css"; // Asegúrate de que el camino al CSS es correcto
import { obtenerFechaActual } from "../utilities/fechaActual.js";

export const NavBar = ({ user }) => {
  const [showContact, setShowContact] = useState(true);
  const [showDate, setShowDate] = useState(true); // Estado para mostrar la fecha actual

  const handleContactClick = () => {
    setShowContact(false); // Oculta el botón de contacto
    setShowDate(false); // Oculta la fecha

    setTimeout(() => {
      setShowContact(true);
      setShowDate(true); // Muestra la fecha
    }, 10000);
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log("Logout exitoso");
    }).catch((error) => {
      console.error("Error al cerrar sesión", error);
    });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg justify-content-center">
        <span className="navbar-brand">
          <img src={logo} className="d-inline-block align-top" alt="logo" />
        </span>

        <ul className="navbar-nav">
          {showContact ? (
            <li className="nav-item">
              <span className="boton-navbar" onClick={handleContactClick}>
                CONTACTO
              </span>
            </li>
          ) : (
            <li className="nav-item">
              <img
                src={whatsappIcon}
                alt="whatsapp"
                className="whatsapp-icon"
              />
              <span className="telefono">(+54 9 388) 4781336</span>
            </li>
          )}
        </ul>

        {showDate && (
          <span className="fecha-actual"> {obtenerFechaActual()}</span>
        )}

        {/* Botón de Logout solo visible cuando el usuario está logueado */}
        {user && (
          <button className="btn btn-danger ml-auto" onClick={handleLogout}>
            LOGOUT
          </button>
        )}
      </nav>
    </>
  );
};

NavBar.propTypes = {
  user: PropTypes.object,
};


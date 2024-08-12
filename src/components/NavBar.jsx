import { useState } from "react";
import logo from "../assets/logoEstudio.png"; // Asegúrate de que la ruta a tu imagen de logo es correcta
import whatsappIcon from "/whatsapp.png"; // Asegúrate de que la ruta a tu imagen de WhatsApp es correcta
import "../styles/NavBar.css"; // Asegúrate de que el camino al CSS es correcto
import { obtenerFechaActual } from "../utilities/fechaActual.js";

export const NavBar = () => {
  // Estado para controlar la visibilidad del botón y del elemento de contacto
  // `true` significa que el botón de contacto se mostrará inicialmente
  const [showContact, setShowContact] = useState(true);
  const [showDate, setShowDate] = useState(true); // Estado para mostrar la fecha actual

  // Función para manejar el clic en el botón de contacto
  const handleContactClick = () => {
    setShowContact(false); // Oculta el botón de contacto
    setShowDate(false); // Oculta la fecha

    // Después de 10 segundos, cambia el estado de nuevo para mostrar el botón de contacto y la fecha
    setTimeout(() => {
      setShowContact(true);
      setShowDate(true); // Muestra la fecha
    }, 10000);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg justify-content-center">
        {/* Logo del estudio */}
        <span className="navbar-brand">
          <img src={logo} className="d-inline-block align-top" alt="logo" />
        </span>

        {/* Lista de elementos de navegación */}
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
        {/* Condicional para mostrar u ocultar la fecha */}
        {showDate && (
          <span className="fecha-actual"> {obtenerFechaActual()}</span>
        )}
      </nav>
    </>
  );
};

import { useState } from "react";
import logo from "../assets/logoEstudio.png"; // Asegúrate de que la ruta a tu imagen de logo es correcta
import whatsappIcon from "/whatsapp.png"; // Asegúrate de que la ruta a tu imagen de WhatsApp es correcta
import "../styles/NavBar.css"; // Asegúrate de que el camino al CSS es correcto

export const NavBar = () => {
  // Estado para controlar la visibilidad del botón y del elemento de contacto
  // `true` significa que el botón de contacto se mostrará inicialmente
  const [showContact, setShowContact] = useState(true);

  // Función para manejar el clic en el botón de contacto
  const handleContactClick = () => {
    console.log(
      "Botón de contacto clickeado. Ocultar contacto y mostrar WhatsApp"
    );

    // Cambia el estado para ocultar el botón de contacto
    setShowContact(false);

    // Después de 10 segundos, cambia el estado de nuevo para mostrar el botón de contacto
    setTimeout(() => {
      console.log(
        "10 segundos después. Mostrar botón de contacto y ocultar WhatsApp"
      );
      setShowContact(true);
    }, 10000); // 10000 milisegundos = 10 segundos
  };

  console.log("Renderizado del componente NavBar, showContact:", showContact); // Muestra el estado actual en la consola

  return (
    <div>
      <nav className="navbar navbar-expand-lg justify-content-center">
        {/* Logo del estudio */}
        <span className="navbar-brand">
          <img src={logo} className="d-inline-block align-top" alt="logo" />
        </span>

        {/* Lista de elementos de navegación */}
        <ul className="navbar-nav">
          {/* Condicional que verifica si `showContact` es verdadero para mostrar el botón de contacto */}
          {showContact ? (
            <li className="nav-item">
              {/* El botón de contacto. `onClick` llama a `handleContactClick` al hacer clic. */}
              {/* Se usa un `span` en lugar de `a` para evitar recarga de la página */}
              <span className="boton-navbar" onClick={handleContactClick}>
                CONTACTO
              </span>
            </li>
          ) : (
            // De lo contrario, muestra el elemento de contacto de WhatsApp
            <li className="nav-item ">
              <img
                src={whatsappIcon}
                alt="whatsapp"
                className="whatsapp-icon"
              />
              <span className="telefono">(+54 9 388) 4781336</span>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

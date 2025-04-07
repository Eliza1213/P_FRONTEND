import React, { useEffect, useState } from "react";
import { 
  FaFacebook, FaTwitter, FaInstagram, 
  FaLinkedin, FaGlobe 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../style/Footer.css"; // Reutilizamos los mismos estilos

const FooterUser = () => {
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    fetch("https://mi-proyecto-virid.vercel.app/api/contactos")
      .then((response) => response.json())
      .then((data) => setContactos(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const getSocialIcon = (nombre) => {
    switch (nombre.toLowerCase()) {
      case "facebook": return <FaFacebook />;
      case "twitter": return <FaTwitter />;
      case "instagram": return <FaInstagram />;
      case "linkedin": return <FaLinkedin />;
      default: return <FaGlobe />;
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Enlaces adaptados para usuario */}
        <ul className="footer-links">
          <li><Link to="/usuario/contacto">Contacto</Link></li>
          <li><Link to="/usuario/mision">Misión</Link></li>
          <li><Link to="/usuario/vision">Visión</Link></li>
          <li><Link to="/usuario/politicas">Políticas</Link></li>
          <li><Link to="/usuario/terminos">Términos</Link></li>
          <li><Link to="/usuario/preguntas">Preguntas</Link></li>
        </ul>

        {/* Redes sociales (igual al público) */}
        <div className="footer-social">
          {contactos[0]?.redes_sociales?.map((red, index) => (
            <a
              key={index}
              href={red.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
            >
              {getSocialIcon(red.nombre)}
            </a>
          ))}
        </div>

        {/* Contacto (igual al público) */}
        <div className="footer-contact">
          {contactos[0] ? (
            <>
              <p>Email: {contactos[0].email}</p>
              <p>Tel: {contactos[0].telefono}</p>
            </>
          ) : (
            <>
              <p>Email: info@tortu-terra.com</p>
              <p>Tel: +52 123 456 7890</p>
            </>
          )}
        </div>

        <p className="footer-text">
          &copy; {new Date().getFullYear()} TortuTerra (Área de usuario)
        </p>
      </div>
    </footer>
  );
};

export default FooterUser;
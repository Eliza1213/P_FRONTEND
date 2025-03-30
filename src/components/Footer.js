import React, { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../style/Footer.css";

const Footer = () => {
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/contactos") // Llamada al backend
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos:", data); // Verificar datos en consola
        setContactos(data);
      })
      .catch((error) => console.error("Error al obtener contactos:", error));
  }, []);

  const getSocialIcon = (nombre) => {
    switch (nombre.toLowerCase()) {
      case "facebook":
        return <FaFacebook />;
      case "twitter":
        return <FaTwitter />;
      case "instagram":
        return <FaInstagram />;
      case "linkedin":
        return <FaLinkedin />;
      default:
        return <FaGlobe />;
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <ul className="footer-links">
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/mision">Misión</Link></li>
            <li><Link to="/vision">Visión</Link></li>
            <li><Link to="/politicas">Políticas</Link></li>
            <li><Link to="/terminos">Términos</Link></li>
        </ul>

        {/* Redes sociales dinámicas */}
        <div className="footer-social">
          {contactos.length > 0 && contactos[0].redes_sociales ? (
            contactos[0].redes_sociales.map((red, index) => (
              <a
                key={index}
                href={red.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                {getSocialIcon(red.nombre)}
              </a>
            ))
          ) : (
            <p>No hay redes sociales disponibles</p>
          )}
        </div>

        {/* Información de contacto dinámica */}
        <div className="footer-contact">
          {contactos.length > 0 ? (
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

        <p className="footer-text">&copy; {new Date().getFullYear()} Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Globe, 
  MapPin, 
  Mail, 
  Phone 
} from "lucide-react";
import LeafletMap from "./LeafletMap";
import "../style/contactoPublica.css";

const ContactoVisualizar = () => {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeo de iconos de redes sociales
  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    default: Globe
  };

  // Obtener ícono de red social
  const getSocialIcon = (nombre) => {
    const IconComponent = socialIcons[nombre.toLowerCase()] || socialIcons.default;
    return <IconComponent size={20} />;
  };

  // Fetch de contactos con useCallback para optimización
  const fetchContactos = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/api/contactos");
      if (!response.ok) {
        throw new Error("Error al obtener contactos");
      }
      const data = await response.json();
      setContactos(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener contactos:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContactos();
  }, [fetchContactos]);

  // Variantes de animación para las tarjetas
  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    },
    hover: { 
      scale: 1.03,
      transition: { 
        duration: 0.3 
      }
    }
  };

  // Renderizado condicional de estados
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="contactos-container">
      <motion.h2 
        className="contactos-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Nuestros Contactos
      </motion.h2>

      {contactos.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div 
          className="contactos-grid"
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {contactos.map((contacto) => (
              <motion.div 
                key={contacto._id}
                className="contacto-card"
                variants={cardVariants}
                whileHover="hover"
                layout
              >
                <div className="contacto-info-header">
                  <div className="contacto-email">
                    <Mail size={24} color="#2980b9" />
                    <span>{contacto.email || "No disponible"}</span>
                  </div>
                  <div className="contacto-telefono">
                    <Phone size={24} color="#2980b9" />
                    <span>{contacto.telefono || "No disponible"}</span>
                  </div>
                </div>

                {/* Ubicación */}
                {contacto.ubicacion && (
                  <div className="contacto-ubicacion">
                    <div className="ubicacion-header">
                      <MapPin size={24} color="#2980b9" />
                      <strong>Ubicación</strong>
                    </div>
                    <p>{contacto.ubicacion.direccion || "No disponible"}</p>
                    {contacto.ubicacion.lat && contacto.ubicacion.lng ? (
                      <div className="mapa-container">
                        <LeafletMap 
                          lat={contacto.ubicacion.lat} 
                          lng={contacto.ubicacion.lng} 
                        />
                      </div>
                    ) : (
                      <p>Mapa no disponible</p>
                    )}
                  </div>
                )}

                {/* Redes Sociales */}
                {contacto.redes_sociales && contacto.redes_sociales.length > 0 ? (
                  <div className="redes-sociales">
                    <h4>Redes Sociales</h4>
                    <div className="redes-icons">
                      {contacto.redes_sociales.map((red, index) => (
                        <motion.a
                          key={index}
                          href={red.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="red-social"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {getSocialIcon(red.nombre)}
                          <span>{red.nombre}</span>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="sin-redes">No hay redes sociales disponibles</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

// Estados de carga, error y sin contactos
const LoadingState = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Cargando contactos...</p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="error-container">
    <h2>Ups! Algo salió mal</h2>
    <p>{message}</p>
    <button onClick={() => window.location.reload()}>
      Reintentar
    </button>
  </div>
);

const EmptyState = () => (
  <div className="empty-container">
    <h3>No hay contactos disponibles</h3>
    <p>Estamos trabajando en actualizar nuestra información de contacto.</p>
  </div>
);

export default ContactoVisualizar;
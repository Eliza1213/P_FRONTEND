import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clipboard, BookOpen } from "lucide-react";
import '../style/terminosPublica.css';

const TerminosVisualizar = () => {
  const [terminos, setTerminos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Iconos para los términos
  const terminosIcons = [FileText, Clipboard, BookOpen];

  // Fetch de términos con useCallback para optimización
  const fetchTerminos = useCallback(async () => {
    try {
      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/terminos");
      if (!response.ok) {
        throw new Error("Error al obtener términos");
      }
      const data = await response.json();
      setTerminos(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener términos:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTerminos();
  }, [fetchTerminos]);

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
    <div className="terminos-container">
      <motion.h2 
        className="terminos-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Términos y Condiciones
      </motion.h2>

      {terminos.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div 
          className="terminos-grid"
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {terminos.map((termino, index) => {
              const IconComponent = terminosIcons[index % terminosIcons.length];
              return (
                <motion.div 
                  key={termino._id}
                  className="termino-card"
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                >
                  <div className="termino-icon">
                    <IconComponent size={40} color="#6a1b9a" />
                  </div>
                  <h3 className="termino-titulo">{termino.titulo}</h3>
                  <p className="termino-descripcion">{termino.descripcion}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

// Estados de carga, error y sin términos
const LoadingState = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Cargando términos y condiciones...</p>
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
    <h3>No hay términos disponibles</h3>
    <p>Estamos trabajando en actualizar nuestros términos y condiciones.</p>
  </div>
);

export default TerminosVisualizar;
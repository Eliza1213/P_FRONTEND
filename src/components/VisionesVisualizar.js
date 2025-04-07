import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Globe, Compass } from "lucide-react";
import '../style/visionesPublica.css';

const VisionesVisualizar = () => {
  const [visiones, setVisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Iconos para las visiones
  const visionIcons = [Eye, Globe, Compass];

  // Fetch de visiones con useCallback para optimización
  const fetchVisiones = useCallback(async () => {
    try {
      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/visiones");
      if (!response.ok) {
        throw new Error("Error al obtener visiones");
      }
      const data = await response.json();
      setVisiones(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener visiones:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisiones();
  }, [fetchVisiones]);

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
      scale: 1.05,
      transition: { 
        duration: 0.3 
      }
    }
  };

  // Renderizado condicional de estados
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="visiones-container">
      <motion.h2 
        className="visiones-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Nuestra Visión
      </motion.h2>

      {visiones.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div 
          className="visiones-grid"
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {visiones.map((vision, index) => {
              const IconComponent = visionIcons[index % visionIcons.length];
              return (
                <motion.div 
                  key={vision._id}
                  className="vision-card"
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                >
                  <div className="vision-icon">
                    <IconComponent size={40} color="#2c3e50" />
                  </div>
                  <h3 className="vision-titulo">{vision.titulo}</h3>
                  <p className="vision-descripcion">{vision.descripcion}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

// Estados de carga, error y sin visiones
const LoadingState = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Cargando visiones...</p>
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
    <h3>No hay visiones disponibles</h3>
    <p>Estamos trabajando en definir nuestra visión.</p>
  </div>
);

export default VisionesVisualizar;
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Rocket, Award } from "lucide-react";
import '../style/misionesPublica.css';

const MisionesVisualizar = () => {
  const [misiones, setMisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Iconos para las misiones
  const misionIcons = [Target, Rocket, Award];

  // Fetch de misiones con useCallback para optimización
  const fetchMisiones = useCallback(async () => {
    try {
      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/misiones");
      if (!response.ok) {
        throw new Error("Error al obtener misiones");
      }
      const data = await response.json();
      setMisiones(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener misiones:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMisiones();
  }, [fetchMisiones]);

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
    <div className="misiones-container">
      <motion.h2 
        className="misiones-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Nuestra Misión
      </motion.h2>

      {misiones.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div 
          className="misiones-grid"
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {misiones.map((mision, index) => {
              const IconComponent = misionIcons[index % misionIcons.length];
              return (
                <motion.div 
                  key={mision._id}
                  className="mision-card"
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                >
                  <div className="mision-icon">
                    <IconComponent size={40} color="#2c3e50" />
                  </div>
                  <h3 className="mision-titulo">{mision.titulo}</h3>
                  <p className="mision-descripcion">{mision.descripcion}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

// Estados de carga, error y sin misiones
const LoadingState = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Cargando misiones...</p>
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
    <h3>No hay misiones disponibles</h3>
    <p>Estamos trabajando en definir nuevas misiones.</p>
  </div>
);

export default MisionesVisualizar;
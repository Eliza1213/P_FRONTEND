import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileText, Lock } from "lucide-react";
import '../style/politicasPublica.css';

const PoliticasVisualizar = () => {
  const [politicas, setPoliticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Iconos para las políticas
  const politicaIcons = [Shield, FileText, Lock];

  // Fetch de políticas con useCallback para optimización
  const fetchPoliticas = useCallback(async () => {
    try {
      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/politicas");
      if (!response.ok) {
        throw new Error("Error al obtener políticas");
      }
      const data = await response.json();
      setPoliticas(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener políticas:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoliticas();
  }, [fetchPoliticas]);

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
    <div className="politicas-container">
      <motion.h2 
        className="politicas-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Políticas de Privacidad
      </motion.h2>

      {politicas.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div 
          className="politicas-grid"
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {politicas.map((politica, index) => {
              const IconComponent = politicaIcons[index % politicaIcons.length];
              return (
                <motion.div 
                  key={politica._id}
                  className="politica-card"
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                >
                  <div className="politica-icon">
                    <IconComponent size={40} color="#0d47a1" />
                  </div>
                  <h3 className="politica-titulo">{politica.titulo}</h3>
                  <p className="politica-contenido">{politica.contenido}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

// Estados de carga, error y sin políticas
const LoadingState = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Cargando políticas...</p>
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
    <h3>No hay políticas disponibles</h3>
    <p>Estamos trabajando en actualizar nuestras políticas.</p>
  </div>
);

export default PoliticasVisualizar;
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Notebook, Pen } from "lucide-react";
import '../style/preguntasPublica.css';

const PreguntasVisualizar = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  // Iconos para las preguntas
  const preguntasIcons = [HelpCircle, Notebook, Pen];

  // Fetch de preguntas con useCallback para optimización
  const fetchPreguntas = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/api/preguntas");
      if (!response.ok) {
        throw new Error("Error al obtener preguntas");
      }
      const data = await response.json();
      setPreguntas(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener preguntas:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreguntas();
  }, [fetchPreguntas]);

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

  // Toggle para expandir/contraer respuestas
  const togglePregunta = (id) => {
    setPreguntaAbierta(prev => prev === id ? null : id);
  };

  // Renderizado condicional de estados
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="preguntas-container">
      <motion.h2 
        className="preguntas-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Preguntas Frecuentes
      </motion.h2>

      {preguntas.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div 
          className="preguntas-grid"
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {preguntas.map((pregunta, index) => {
              const IconComponent = preguntasIcons[index % preguntasIcons.length];
              const isOpen = preguntaAbierta === pregunta._id;
              
              return (
                <motion.div 
                  key={pregunta._id}
                  className={`pregunta-card ${isOpen ? 'abierta' : ''}`}
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                  onClick={() => togglePregunta(pregunta._id)}
                >
                  <div className="pregunta-header">
                    <div className="pregunta-icon">
                      <IconComponent size={40} color="#2980b9" />
                    </div>
                    <h3 className="pregunta-titulo">{pregunta.pregunta}</h3>
                  </div>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        className="pregunta-respuesta"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ 
                          opacity: 1, 
                          height: 'auto',
                          transition: { 
                            duration: 0.3 
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          height: 0,
                          transition: { 
                            duration: 0.2 
                          }
                        }}
                      >
                        <p>{pregunta.respuesta}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

// Estados de carga, error y sin preguntas
const LoadingState = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Cargando preguntas frecuentes...</p>
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
    <h3>No hay preguntas disponibles</h3>
    <p>Estamos trabajando en agregar más información.</p>
  </div>
);

export default PreguntasVisualizar;
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Thermometer, Droplets, Fish, Info } from "lucide-react";
import '../style/informacionTortuga.css';

const InformacionVisualizar = () => {
  const [informaciones, setInformaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  // Fetch de información con useCallback para optimización
  const fetchInformacion = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/informaciones");
      
      if (!response.ok) {
        throw new Error("Error al obtener información sobre tortugas");
      }
      
      const data = await response.json();
      setInformaciones(data);
      // Establecer la primera especie como activa por defecto
      if (data.length > 0) {
        setActiveTab(data[0]._id);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInformacion();
  }, [fetchInformacion]);

  // Variantes de animación para las tarjetas
  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  // Manejo del cambio de pestaña
  const handleTabChange = (infoId) => {
    setActiveTab(infoId);
  };

  // Obtener la información activa
  const activeInfo = informaciones.find(info => info._id === activeTab);

  // Renderizado condicional de estados
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  
  return (
    <div className="info-container">
      <motion.h2 
        className="info-title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Información sobre Tortugas
      </motion.h2>
      
      {informaciones.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Tabs de navegación */}
          <motion.div 
            className="info-tabs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {informaciones.map((info) => (
              <motion.button
                key={info._id}
                className={`info-tab ${activeTab === info._id ? 'active' : ''}`}
                onClick={() => handleTabChange(info._id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {info.especie}
              </motion.button>
            ))}
          </motion.div>

          {/* Contenido principal */}
          <AnimatePresence mode="wait">
            {activeInfo && (
              <motion.div
                key={activeInfo._id}
                className="info-details"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="info-header">
                  {activeInfo.imagen ? (
                    <div className="info-image-container">
                      <img 
                        src={activeInfo.imagen} 
                        alt={`Imagen de ${activeInfo.especie}`} 
                        className="info-image" 
                      />
                    </div>
                  ) : (
                    <div className="info-image-placeholder">
                      <Leaf size={60} />
                    </div>
                  )}
                  <h3 className="info-species">{activeInfo.especie}</h3>
                </div>

                <div className="info-stats">
                  <motion.div 
                    className="info-stat-card"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Fish size={28} />
                    <h4>Alimentación</h4>
                    <p>{activeInfo.alimentacion}</p>
                  </motion.div>

                  <motion.div 
                    className="info-stat-card"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Thermometer size={28} />
                    <h4>Temperatura</h4>
                    <p>{activeInfo.temperatura_ideal}</p>
                  </motion.div>

                  <motion.div 
                    className="info-stat-card"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Droplets size={28} />
                    <h4>Humedad</h4>
                    <p>{activeInfo.humedad_ideal}</p>
                  </motion.div>
                </div>

                <motion.div 
                  className="info-description-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="info-description-header">
                    <Info size={24} />
                    <h4>Descripción</h4>
                  </div>
                  <p>{activeInfo.descripcion}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

// Estados de carga, error y sin información
const LoadingState = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Cargando información sobre tortugas...</p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="error-container">
    <h2>¡Ups! Algo salió mal</h2>
    <p>{message}</p>
    <button onClick={() => window.location.reload()}>
      Reintentar
    </button>
  </div>
);

const EmptyState = () => (
  <div className="empty-container">
    <h3>No hay información disponible</h3>
    <p>Estamos trabajando en agregar información sobre especies de tortugas.</p>
  </div>
);

export default InformacionVisualizar;
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import "../style/Home.css";
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingCart, 
  Info 
} from "lucide-react";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [indiceCentral, setIndiceCentral] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch de productos con useCallback para optimización
  const fetchProductos = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/api/productos");
      if (!response.ok) {
        throw new Error("Error al obtener productos");
      }
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching productos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Navegación del carrusel con manejo optimizado
  const handleNavegacion = useCallback((direccion) => {
    setIndiceCentral(prev => {
      if (direccion === 'anterior') {
        return prev === 0 ? productos.length - 1 : prev - 1;
      }
      return prev === productos.length - 1 ? 0 : prev + 1;
    });
  }, [productos.length]);

  // Calcular índices de manera más clara
  const getIndice = useCallback((offset) => {
    return (indiceCentral + offset + productos.length) % productos.length;
  }, [indiceCentral, productos.length]);

  // Renderizado condicional con componentes de estado
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (productos.length === 0) return <EmptyState />;

  return (
    <div className="home-container">
      <div className="home-content">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="home-title"
        >
          Bienvenido a TORTUTERRA
        </motion.h1>
        
        <div className="carrusel-container">
          <motion.button 
            className="nav-button"
            onClick={() => handleNavegacion('anterior')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
          
          <div className="carrusel">
            <AnimatePresence>
              {/* Producto izquierdo */}
              <ProductoCard 
                key={`left-${getIndice(-1)}`}
                producto={productos[getIndice(-1)]} 
                esCentral={getIndice(-1) === indiceCentral}
                posicion="lateral izquierdo"
              />

              {/* Producto central */}
              <ProductoCard 
                key={`central-${indiceCentral}`}
                producto={productos[indiceCentral]} 
                esCentral={true}
                posicion="central"
              />

              {/* Producto derecho */}
              <ProductoCard 
                key={`right-${getIndice(1)}`}
                producto={productos[getIndice(1)]} 
                esCentral={getIndice(1) === indiceCentral}
                posicion="lateral derecho"
              />
            </AnimatePresence>
          </div>
          
          <motion.button 
            className="nav-button"
            onClick={() => handleNavegacion('siguiente')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Componente para mostrar cada producto con animaciones
const ProductoCard = ({ producto, esCentral, posicion }) => {
  const variantesProducto = {
    inicial: { 
      scale: posicion === 'central' ? 1 : 0.8, 
      opacity: posicion === 'central' ? 1 : 0.7,
      x: posicion === 'lateral izquierdo' ? -100 : 
         posicion === 'lateral derecho' ? 100 : 0
    },
    animado: { 
      scale: 1, 
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    }
  };

  return (
    <motion.div 
      className={`producto-card ${esCentral ? 'central' : posicion}`}
      variants={variantesProducto}
      initial="inicial"
      animate="animado"
      exit="inicial"
    >
      <img 
        src={producto.imagenes[0]} 
        alt={producto.nombre} 
        className="producto-imagen"
        loading="lazy"
      />
      <h3>{producto.nombre}</h3>
      {esCentral && (
        <motion.div 
          className="detalles"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="descripcion">{producto.descripcion}</p>
          <div className="producto-meta">
            <span className="precio">${producto.precio.toFixed(2)}</span>
            <span className="stock">Stock: {producto.stock}</span>
          </div>
          <div className="producto-acciones">
            <Link 
              to={`/producto/${producto._id}`} 
              className="btn-detalles"
            >
              <Info size={18} /> Detalles
            </Link>
            <button className="btn-comprar">
              <ShoppingCart size={18} /> Comprar
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Estados de carga, error y vacío
const LoadingState = () => (
  <div className="estado-contenedor">
    <div className="spinner"></div>
    <p>Cargando productos...</p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="estado-contenedor error">
    <h2>Ups! Algo salió mal</h2>
    <p>{message}</p>
    <button onClick={() => window.location.reload()}>
      Reintentar
    </button>
  </div>
);

const EmptyState = () => (
  <div className="estado-contenedor">
    <h2>No hay productos disponibles</h2>
    <p>Estamos trabajando en agregar nuevos productos pronto.</p>
  </div>
);

export default Home;
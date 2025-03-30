import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import "../style/Home.css";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [indiceCentral, setIndiceCentral] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
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
    };

    fetchProductos();
  }, []);

  const handleAnterior = () => {
    setIndiceCentral(prev => 
      prev === 0 ? productos.length - 1 : prev - 1
    );
  };

  const handleSiguiente = () => {
    setIndiceCentral(prev => 
      prev === productos.length - 1 ? 0 : prev + 1
    );
  };

  // Calcular índices
  const getIndice = (offset) => {
    return (indiceCentral + offset + productos.length) % productos.length;
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (productos.length === 0) return <div>No hay productos disponibles</div>;

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Bienvenido a TORTU-TERRA</h1>
        
        <div className="carrusel-container">
          <button className="nav-button" onClick={handleAnterior}>&lt;</button>
          
          <div className="carrusel">
            {/* Producto izquierdo */}
            <div className={`producto ${getIndice(-1) === indiceCentral ? 'central' : 'lateral izquierdo'}`}>
              <ProductoCard producto={productos[getIndice(-1)]} esCentral={getIndice(-1) === indiceCentral} />
            </div>

            {/* Producto central */}
            <div className="producto central">
              <ProductoCard producto={productos[indiceCentral]} esCentral={true} />
            </div>

            {/* Producto derecho */}
            <div className={`producto ${getIndice(1) === indiceCentral ? 'central' : 'lateral derecho'}`}>
              <ProductoCard producto={productos[getIndice(1)]} esCentral={getIndice(1) === indiceCentral} />
            </div>
          </div>
          
          <button className="nav-button" onClick={handleSiguiente}>&gt;</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Componente para mostrar cada producto
const ProductoCard = ({ producto, esCentral }) => {
  return (
    <div className={`producto-card ${esCentral ? 'central' : ''}`}>
      <img 
        src={producto.imagenes[0]} 
        alt={producto.nombre} 
        className="producto-imagen"
      />
      <h3>{producto.nombre}</h3>
      {esCentral && (
        <div className="detalles">
          <p>{producto.descripcion}</p>
          <p className="precio">${producto.precio}</p>
          <p>Stock: {producto.stock}</p>
          <button className="comprar-btn">Ver detalles</button>
        </div>
      )}
    </div>
  );
};

export default Home;
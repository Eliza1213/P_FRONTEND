import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarUser from "../components/SidebarUser";
import FooterUser from "../components/FooterUser";
import "../style/userDashboard.css";

const UserDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    if (window.location.pathname === "/usuario") {
      fetch("http://localhost:4000/api/productos")
        .then(res => res.json())
        .then(data => setProductos(data.slice(0, 4))) // Solo 4 productos
        .catch(err => console.error("Error:", err));
    }
  }, []);

  return (
    <div className="user-dashboard">
      {/* Sidebar (mantenemos igual) */}
      <div 
        className="sidebar-control"
        onMouseEnter={() => setSidebarVisible(true)}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        <div className="hamburger-btn">☰</div>
        {sidebarVisible && (
          <div className="sidebar-wrapper">
            <div className="sidebar-content">
              <SidebarUser />
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className={`dashboard-content ${sidebarVisible ? "shifted" : ""}`}>
        {/* Sección de productos (solo en ruta base) */}
        {window.location.pathname === "/usuario" && (
          <div className="productos-destacados">
            <h2>Nuestros Productos Destacados</h2>
            <div className="productos-grid">
              {productos.map(producto => (
                <div 
                  key={producto._id} 
                  className="producto-card"
                  onClick={() => setProductoSeleccionado(producto)}
                >
                  <img 
                    src={producto.imagenes[0]} 
                    alt={producto.nombre} 
                    className="producto-imagen"
                  />
                  <div className="producto-info">
                    <h3>{producto.nombre}</h3>
                    <p className="precio">${producto.precio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de detalles del producto */}
        {productoSeleccionado && (
          <div className="producto-modal">
            <div className="modal-contenido">
              <span 
                className="cerrar-modal"
                onClick={() => setProductoSeleccionado(null)}
              >
                &times;
              </span>
              
              <div className="modal-imagen">
                <img 
                  src={productoSeleccionado.imagenes[0]} 
                  alt={productoSeleccionado.nombre}
                />
              </div>
              
              <div className="modal-detalles">
                <h2>{productoSeleccionado.nombre}</h2>
                <p className="modal-precio">${productoSeleccionado.precio}</p>
                <p className="modal-descripcion">
                  {productoSeleccionado.descripcion}
                </p>
                <p className="modal-stock">
                  Disponibles: {productoSeleccionado.stock} unidades
                </p>
                <button className="comprar-btn">
                  Comprar Ahora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenido de rutas anidadas */}
        <Outlet />
      </div>
      <FooterUser />
    </div>
  );
};

export default UserDashboard;
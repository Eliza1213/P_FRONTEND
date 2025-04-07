// components/UserDashboard.js
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarUser from "../components/SidebarUser";
import FooterUser from "../components/FooterUser";
import Swal from "sweetalert2";
import axios from "axios";
import "../style/userDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Agregamos estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(4);

  // Función para cargar productos
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://mi-proyecto-virid.vercel.app/api/productos");
      setProductos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      setLoading(false);
    }
  };

  // Usar useEffect para monitorear cambios en la ruta
  useEffect(() => {
    // Cargar productos cuando estamos en la ruta /usuario
    if (location.pathname === "/usuario") {
      fetchProductos();
    }
  }, [location.pathname]);

  // Calcular productos actuales basados en la página
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Calcular el número total de páginas
  const totalPages = Math.ceil(productos.length / productsPerPage);

  const handleComprar = async () => {
    // Si es un producto IoT, mostramos advertencia y opción de activación
    if (productoSeleccionado.esIoT) {
      try {
        // Verificar disponibilidad del dispositivo IoT
        const verificacion = await axios.get(
          `https://mi-proyecto-virid.vercel.app/api/dispositivos/verificar-disponibilidad/${productoSeleccionado._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (!verificacion.data.disponible) {
          Swal.fire({
            title: "Producto no disponible",
            text: "Este dispositivo IoT ya está asignado a un usuario.",
            icon: "warning"
          });
          return;
        }

        // Si está disponible, mostramos información sobre activación
        const result = await Swal.fire({
          title: "Dispositivo IoT",
          html: `
            <div class="iot-info">
              <p>Este producto es un dispositivo IoT que requiere activación después de la compra.</p>
              <p>El identificador IoT (MAC) del dispositivo es:</p>
              <div class="mac-container">
                <code>${productoSeleccionado.identificadorIoT}</code>
                <button id="copiarMac" class="btn-copiar">Copiar</button>
              </div>
              <p>¿Deseas continuar con la compra?</p>
            </div>
          `,
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Comprar",
          cancelButtonText: "Cancelar",
          didOpen: () => {
            // Agregar funcionalidad para copiar la MAC
            document.getElementById("copiarMac").addEventListener("click", () => {
              navigator.clipboard.writeText(productoSeleccionado.identificadorIoT);
              Swal.showValidationMessage("MAC copiada al portapapeles");
              setTimeout(() => {
                Swal.resetValidationMessage();
              }, 1500);
            });
          }
        });

        if (result.isConfirmed) {
          // Procesamos la compra (aquí iría la lógica de tu carrito)
          Swal.fire({
            title: "Producto agregado al carrito",
            text: "Recuerda activar tu dispositivo después de recibirlo",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Ir a activar",
            cancelButtonText: "Seguir comprando"
          }).then((result) => {
            if (result.isConfirmed) {
              // Redireccionar a la página de activación con el ID del producto
              navigate(`/usuario/activar-iot/${productoSeleccionado._id}`);
            }
            setProductoSeleccionado(null);
          });
        }
      } catch (error) {
        console.error("Error verificando dispositivo:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al verificar el dispositivo",
          icon: "error"
        });
      }
    } else {
      // Producto normal, simplemente agregamos al carrito
      Swal.fire({
        title: "Producto agregado al carrito",
        icon: "success"
      });
      setProductoSeleccionado(null);
    }
  };

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
        {location.pathname === "/usuario" && (
          <div className="productos-destacados">
            <h2>Nuestros Productos Destacados</h2>
            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : productos.length === 0 ? (
              <div className="no-products">No hay productos disponibles</div>
            ) : (
              <>
                <div className="productos-grid">
                  {currentProducts.map(producto => (
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
                        {producto.esIoT && (
                          <span className="badge-iot">IoT</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      onClick={() => paginate(currentPage - 1)} 
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      &laquo; Anterior
                    </button>
                    
                    <div className="pagination-info">
                      Página {currentPage} de {totalPages}
                    </div>
                    
                    <button 
                      onClick={() => paginate(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Siguiente &raquo;
                    </button>
                  </div>
                )}
              </>
            )}
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
                {productoSeleccionado.esIoT && (
                  <div className="iot-badge-modal">Dispositivo IoT</div>
                )}
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
                {productoSeleccionado.esIoT && (
                  <div className="iot-info-box">
                    <p>Este es un dispositivo IoT que requiere activación después de la compra.</p>
                  </div>
                )}
                <button 
                  className="comprar-btn"
                  onClick={handleComprar}
                  disabled={productoSeleccionado.stock <= 0}
                >
                  {productoSeleccionado.stock > 0 ? "Comprar Ahora" : "Sin Stock"}
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
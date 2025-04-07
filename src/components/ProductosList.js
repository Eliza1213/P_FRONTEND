import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import "../style/productosL.css";

const ProductosList = ({ isUserAuthenticated = false, modo = "publico" }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const productsPerPage = 9; // Mostrar 9 productos por página (3x3)
  const navigate = useNavigate();

  // Fetch de productos con useCallback para optimización
  const fetchProductos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/productos");
      if (!response.ok) {
        throw new Error("Error al obtener productos");
      }
      const data = await response.json();
      // Asegurarse de que data es un array
      if (Array.isArray(data)) {
        setProductos(data);
      } else {
        console.error("La respuesta del servidor no es un array:", data);
        setProductos([]);
        setError("El formato de datos recibido no es válido");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError(err.message);
      setProductos([]); // Asegurarse de que productos sea un array vacío en caso de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los productos. Inténtalo más tarde.",
        confirmButtonColor: "#2a7f68",
      });
      setLoading(false);
    }
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Función para manejar la compra de un producto
  const handleComprarClick = async (producto) => {
    if (!isUserAuthenticated) {
      Swal.fire({
        title: 'Iniciar sesión requerido',
        text: 'Para comprar este producto, debes iniciar sesión primero.',
        icon: 'info',
        confirmButtonColor: '#2a7f68',
        confirmButtonText: 'Iniciar sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    } else {
      // Lógica para usuarios autenticados
      // Si es un producto IoT, verificamos disponibilidad y mostramos información adicional
      if (producto.esIoT) {
        try {
          // Verificar disponibilidad del dispositivo IoT
          const verificacion = await axios.get(
            `https://mi-proyecto-virid.vercel.app/api/dispositivos/verificar-disponibilidad/${producto._id}`,
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
                  <code>${producto.identificadorIoT || "Disponible después de la compra"}</code>
                  ${producto.identificadorIoT ? `<button id="copiarMac" class="btn-copiar">Copiar</button>` : ''}
                </div>
                <p>¿Deseas continuar con la compra?</p>
              </div>
            `,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Comprar",
            cancelButtonText: "Cancelar",
            didOpen: () => {
              // Agregar funcionalidad para copiar la MAC si está disponible
              if (producto.identificadorIoT) {
                document.getElementById("copiarMac").addEventListener("click", () => {
                  navigator.clipboard.writeText(producto.identificadorIoT);
                  Swal.showValidationMessage("MAC copiada al portapapeles");
                  setTimeout(() => {
                    Swal.resetValidationMessage();
                  }, 1500);
                });
              }
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
                navigate(`/usuario/activar-iot/${producto._id}`);
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
          title: 'Producto añadido',
          text: `${producto.nombre} ha sido añadido a tu carrito.`,
          icon: 'success',
          confirmButtonColor: '#2a7f68',
        });
        // Aquí añadirías la lógica para añadir al carrito
      }
    }
  };

  // Abrir modal de detalles del producto
  const abrirDetallesProducto = (producto) => {
    setProductoSeleccionado(producto);
  };

  // Cerrar modal de detalles
  const cerrarDetallesProducto = () => {
    setProductoSeleccionado(null);
  };

  // Obtener categorías únicas de los productos
  const getCategories = () => {
    if (!Array.isArray(productos) || productos.length === 0) return [];
    return [...new Set(productos.filter(p => p && p.categoria).map(producto => producto.categoria))];
  };

  // Filtrar productos por búsqueda y categoría
  const filteredProducts = Array.isArray(productos) 
    ? productos.filter(producto => {
        if (!producto) return false;
        const matchesSearch = 
          (producto.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (producto.descripcion?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || producto.categoria === filterCategory;
        return matchesSearch && matchesCategory;
      })
    : [];

  // Calcular páginas
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Cambiar de página
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  // Obtener categorías
  const categories = getCategories();

  // Renderizado condicional para carga y errores
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>¡Ups! Algo salió mal</h2>
        <p>{error}</p>
        <button onClick={fetchProductos} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="productos-page">
      <div className="productos-container">
        <div className="productos-header">
          <h1>Nuestros Productos</h1>
          <p>Encuentra todo lo que necesitas para el cuidado de tu tortuga</p>
        </div>

        <div className="productos-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          {categories.length > 0 && (
            <div className="category-filter">
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-products">
            <h3>No se encontraron productos</h3>
            <p>Intenta con otros términos de búsqueda o categorías.</p>
          </div>
        ) : (
          <>
            <div className="productos-grid">
              {currentProducts.map((producto, index) => (
                <div 
                  key={producto._id || producto.id || index} 
                  className="producto-card"
                  onClick={() => abrirDetallesProducto(producto)}
                >
                  <div className="producto-imagen">
                    <img 
                      src={(producto.imagenes && producto.imagenes[0]) || "/images/placeholder.jpg"} 
                      alt={producto.nombre || "Producto"} 
                    />
                  </div>
                  <div className="producto-info">
                    <h3>{producto.nombre || "Producto sin nombre"}</h3>
                    <p className="producto-descripcion">{producto.descripcion || "Sin descripción"}</p>
                    <p className="producto-precio">${(producto.precio || 0).toFixed(2)}</p>
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
                  className="pagination-button"
                >
                  Anterior
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`page-number ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalles del producto */}
      {productoSeleccionado && (
        <div className="producto-modal">
          <div className="modal-contenido">
            <span 
              className="cerrar-modal"
              onClick={cerrarDetallesProducto}
            >
              &times;
            </span>
            
            <div className="modal-imagen">
              <img 
                src={(productoSeleccionado.imagenes && productoSeleccionado.imagenes[0]) || "/images/placeholder.jpg"} 
                alt={productoSeleccionado.nombre || "Producto"}
              />
              {productoSeleccionado.esIoT && (
                <div className="iot-badge-modal">Dispositivo IoT</div>
              )}
            </div>
            
            <div className="modal-detalles">
              <h2>{productoSeleccionado.nombre || "Producto sin nombre"}</h2>
              <p className="modal-precio">${(productoSeleccionado.precio || 0).toFixed(2)}</p>
              <p className="modal-descripcion">
                {productoSeleccionado.descripcion || "Sin descripción disponible"}
              </p>
              <p className="modal-stock">
                Disponibles: {productoSeleccionado.stock || 0} unidades
              </p>
              {productoSeleccionado.esIoT && (
                <div className="iot-info-box">
                  <p>Este es un dispositivo IoT que requiere activación después de la compra.</p>
                </div>
              )}
              <button 
                className="comprar-btn"
                onClick={() => handleComprarClick(productoSeleccionado)}
                disabled={!productoSeleccionado.stock || productoSeleccionado.stock <= 0}
              >
                {productoSeleccionado.stock > 0 ? "Comprar Ahora" : "Sin Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosList;
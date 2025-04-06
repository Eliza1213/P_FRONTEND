import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ListarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 10;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/api/productos");
        if (!response.ok) throw new Error("Error al obtener productos");
        const data = await response.json();
        setProductos(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los productos",
          icon: "error",
          confirmButtonColor: "#003366",
        });
        setProductos([]);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Función para eliminar un producto
  const handleEliminar = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003366",
      cancelButtonColor: "#f44336",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:4000/api/productos/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const nuevosProductos = productos.filter((producto) => producto._id !== id);
          setProductos(nuevosProductos);
          
          // Ajustar página actual si la página actual queda vacía
          if (
            nuevosProductos.length > 0 && 
            nuevosProductos.length <= (paginaActual - 1) * productosPorPagina
          ) {
            setPaginaActual(paginaActual - 1);
          }

          Swal.fire({
            title: "¡Eliminado!",
            text: "El producto ha sido eliminado correctamente.",
            icon: "success",
            confirmButtonColor: "#003366",
          });
        } else {
          throw new Error("Error al eliminar el producto");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar el producto.",
          icon: "error",
          confirmButtonColor: "#003366",
        });
      }
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    if (!filtro) return true;
    const filtroLower = filtro.toLowerCase();
    return (producto.nombre || '').toLowerCase().includes(filtroLower) ||
           (producto.precio || '').toString().includes(filtroLower);
  });

  // Paginación
  const indexUltimoProducto = paginaActual * productosPorPagina;
  const indexPrimerProducto = indexUltimoProducto - productosPorPagina;
  const productosActuales = productosFiltrados.slice(
    indexPrimerProducto, 
    indexUltimoProducto
  );

  // Calcular número total de páginas
  const numeroPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  // Cambiar página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="preguntas-container">
      <div className="preguntas-header">
        <h2 className="preguntas-titulo">Gestión de Productos</h2>
        <p className="preguntas-descripcion">
          Administra los productos de TortuTerra
        </p>
      </div>
      
      <div className="acciones-header">
        <div className="filtro-busqueda">
          <input
            type="text"
            placeholder="Buscar por nombre o precio..."
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPaginaActual(1); // Volver a la primera página al filtrar
            }}
            className="filtro-input"
          />
        </div>
        <Link to="/admin/productos/crear" className="btn-crear">
          <i className="fas fa-plus"></i> Crear Nuevo Producto
        </Link>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="preguntas-vacio">
          {filtro ? 
            "No se encontraron productos que coincidan con la búsqueda" : 
            "No hay productos disponibles"}
        </div>
      ) : (
        <>
          <table className="preguntas-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosActuales.map((producto) => (
                <tr key={producto._id} className="pregunta-fila">
                  <td>{producto.nombre || 'Sin nombre'}</td>
                  <td>${(producto.precio || 0).toFixed(2)}</td>
                  <td className="acciones">
                    <Link
                      to={`/admin/productos/actualizar/${producto._id}`}
                      className="btn-accion btn-actualizar"
                    >
                      <i className="fas fa-edit"></i> Editar
                    </Link>
                    <button
                      onClick={() => handleEliminar(producto._id)}
                      className="btn-accion btn-eliminar"
                    >
                      <i className="fas fa-trash-alt"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="paginacion">
            {Array.from({ length: numeroPaginas }, (_, i) => (
              <button
                key={i}
                onClick={() => cambiarPagina(i + 1)}
                className={`btn-pagina ${paginaActual === i + 1 ? 'activo' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ListarProductos;
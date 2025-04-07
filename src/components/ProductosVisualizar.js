import { useEffect, useState } from "react";

const ProductosVisualizar = () => {
    const [productos, setProductos] = useState([]);
  
    useEffect(() => {
      fetch("https://mi-proyecto-virid.vercel.app/api/productos") // Llamada al backend
        .then((response) => response.json())
        .then((data) => setProductos(data))
        .catch((error) => console.error("Error al obtener productos:", error));
    }, []);
  
    return (
      <div className="productos-container">
        <h2 className="productos-title">Nuestros Productos</h2>
        {productos.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          <ul className="productos-list">
            {productos.map((producto) => (
              <li key={producto._id} className="producto-item">
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <p><strong>Precio:</strong> ${producto.precio.toFixed(2)}</p>
                <p><strong>Stock:</strong> {producto.stock}</p>
                <div className="producto-imagenes">
                  {producto.imagenes.map((imagen, index) => (
                    <img key={index} src={imagen} alt={`Imagen ${index + 1} de ${producto.nombre}`} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
export default ProductosVisualizar;
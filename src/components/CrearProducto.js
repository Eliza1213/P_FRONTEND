import React, { useState } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Crear.css"; // Importa el archivo CSS

const CrearProducto = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagenes, setImagenes] = useState([""]); // Por defecto, un array vacío para imágenes

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProducto = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      imagenes,
    };

    try {
      const response = await fetch("http://localhost:4000/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProducto),
      });

      if (response.ok) {
        // Mostrar alerta de éxito con SweetAlert2
        Swal.fire({
          title: "¡Éxito!",
          text: "Producto creado con éxito",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Limpiar el formulario después de crear el producto
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setStock("");
        setImagenes([""]);
      } else {
        throw new Error("Error al crear producto");
      }
    } catch (error) {
      console.error("Error en la creación de producto:", error);

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al crear el producto",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleAgregarImagen = () => {
    setImagenes([...imagenes, ""]); // Agrega un nuevo campo de imagen vacío
  };

  const handleImagenChange = (index, value) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index] = value;
    setImagenes(nuevasImagenes);
  };

  return (
    <div className="visiones-container"> {/* Usamos la misma clase CSS */}
      <h2>Crear Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <h4>Imágenes</h4>
        {imagenes.map((imagen, index) => (
          <input
            key={index}
            type="text"
            placeholder={`URL de la imagen ${index + 1}`}
            value={imagen}
            onChange={(e) => handleImagenChange(index, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={handleAgregarImagen}>
          Agregar Imagen
        </button>
        <button type="submit">Crear Producto</button>
      </form>
    </div>
  );
};

export default CrearProducto;
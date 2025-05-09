import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const CrearProducto = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagenes, setImagenes] = useState([""]);
  const [esIoT, setEsIoT] = useState(false);
  const [identificadorIoT, setIdentificadorIoT] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!nombre.trim() || !descripcion.trim() || !precio.trim() || !stock.trim()) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
        confirmButtonColor: "#003366",
      });
      return;
    }

    // Validar que el precio sea un número positivo
    const precioNumero = parseFloat(precio);
    if (isNaN(precioNumero) || precioNumero <= 0) {
      Swal.fire({
        title: "Error",
        text: "Por favor, introduce un precio válido",
        icon: "error",
        confirmButtonColor: "#003366",
      });
      return;
    }

    // Validar que el stock sea un número entero positivo
    const stockNumero = parseInt(stock);
    if (isNaN(stockNumero) || stockNumero < 0) {
      Swal.fire({
        title: "Error",
        text: "Por favor, introduce una cantidad de stock válida",
        icon: "error",
        confirmButtonColor: "#003366",
      });
      return;
    }

    // Validar imágenes
    const imagenesValidas = imagenes.filter(img => img.trim() !== "");
    if (imagenesValidas.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Debe agregar al menos una imagen",
        icon: "error",
        confirmButtonColor: "#003366",
      });
      return;
    }

    // Validar identificador IoT si es un dispositivo IoT
    if (esIoT && !identificadorIoT.trim()) {
      Swal.fire({
        title: "Error",
        text: "Debe proporcionar un identificador IoT",
        icon: "error",
        confirmButtonColor: "#003366",
      });
      return;
    }

    try {
      setLoading(true);
      const nuevoProducto = {
        nombre,
        descripcion,
        precio: precioNumero,
        stock: stockNumero,
        imagenes: imagenesValidas,
        esIoT,
        identificadorIoT: esIoT ? identificadorIoT : null
      };

      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!response.ok) {
        throw new Error("Error al crear el producto");
      }

      Swal.fire({
        title: "¡Éxito!",
        text: "El producto se ha creado correctamente",
        icon: "success",
        confirmButtonColor: "#003366",
      }).then(() => {
        navigate("/admin/productos");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al crear el producto",
        icon: "error",
        confirmButtonColor: "#003366",
      });
    } finally {
      setLoading(false);
    }
  };

  // Agregar una nueva imagen
  const agregarImagen = () => {
    setImagenes([...imagenes, ""]);
  };

  // Eliminar una imagen
  const eliminarImagen = (index) => {
    const nuevasImagenes = imagenes.filter((_, i) => i !== index);
    setImagenes(nuevasImagenes);
  };

  // Actualizar una imagen
  const actualizarImagen = (index, valor) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index] = valor;
    setImagenes(nuevasImagenes);
  };

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h2 className="formulario-titulo">Crear Nuevo Producto</h2>
        <p className="formulario-descripcion">
          Añade un nuevo producto al sistema de TortuTerra
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="formulario-campo">
          <label htmlFor="nombre" className="formulario-label">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="formulario-input"
            placeholder="Escribe el nombre del producto"
            required
          />
        </div>

        <div className="formulario-campo">
          <label htmlFor="descripcion" className="formulario-label">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="formulario-textarea"
            placeholder="Escribe la descripción del producto"
            required
          />
        </div>

        <div className="formulario-campo">
          <label htmlFor="precio" className="formulario-label">
            Precio
          </label>
          <input
            type="number"
            id="precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="formulario-input"
            placeholder="Introduce el precio"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="formulario-campo">
          <label htmlFor="stock" className="formulario-label">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="formulario-input"
            placeholder="Introduce la cantidad en stock"
            min="0"
            required
          />
        </div>

        <div className="formulario-campo">
          <label className="formulario-label">Imágenes</label>
          {imagenes.map((imagen, index) => (
            <div key={index} className="imagen-grupo">
              <input
                type="text"
                placeholder={`URL de la imagen ${index + 1}`}
                value={imagen}
                onChange={(e) => actualizarImagen(index, e.target.value)}
                className="formulario-input"
                required
              />
              {imagenes.length > 1 && (
                <button
                  type="button"
                  onClick={() => eliminarImagen(index)}
                  className="btn-accion btn-eliminar"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={agregarImagen}
            className="btn-accion btn-actualizar"
          >
            Agregar Imagen
          </button>
        </div>

        <div className="formulario-campo">
          <label className="formulario-label">
            <input
              type="checkbox"
              checked={esIoT}
              onChange={() => setEsIoT(!esIoT)}
              style={{ marginRight: '10px' }}
            />
            ¿Es un dispositivo IoT?
          </label>
        </div>

        {esIoT && (
          <div className="formulario-campo">
            <label htmlFor="identificadorIoT" className="formulario-label">
              Identificador IoT (MAC de la ESP32)
            </label>
            <input
              type="text"
              id="identificadorIoT"
              value={identificadorIoT}
              onChange={(e) => setIdentificadorIoT(e.target.value)}
              className="formulario-input"
              placeholder="Introduce el identificador IoT"
              required
            />
          </div>
        )}

        <div className="formulario-botones">
          <Link to="/admin/productos" className="btn-cancelar">
            Cancelar
          </Link>
          <button type="submit" className="btn-guardar" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearProducto;
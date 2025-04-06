// components/ActivarDispositivo.js (o FormActivarIOT.js)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "../style/ActivarDispositivo.css"; // Asegúrate de que este archivo existe

const ActivarDispositivo = () => {
  const { id } = useParams(); // ID del producto a activar (opcional)
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productoId, setProductoId] = useState(id || "");
  const [identificadorIoT, setIdentificadorIoT] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductosIoT = async () => {
      try {
        console.log("Obteniendo productos IoT...");
        const token = localStorage.getItem("token");
        console.log("Token para obtener productos:", token ? "Presente" : "Ausente");

        // Obtener productos que son IoT
        const response = await axios.get("http://localhost:4000/api/productos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Productos obtenidos:", response.data);
        
        // Filtrar solo productos IoT
        const productosIoT = response.data.filter(p => p.esIoT);
        console.log("Productos IoT filtrados:", productosIoT);
        
        setProductos(productosIoT);
        setLoading(false);
      } catch (error) {
        console.error("Error detallado al obtener productos:", error);
        let mensajeError = "Error al cargar los productos";
        
        if (error.response) {
          mensajeError += `: ${error.response.data.error || error.response.statusText}`;
        }
        
        setError(mensajeError);
        setLoading(false);
      }
    };

    obtenerProductosIoT();
  }, []);

  useEffect(() => {
    // Si se proporciona un ID en la URL, buscar el producto y cargar su identificador IoT
    if (id && productos.length > 0) {
      console.log("ID proporcionado en URL:", id);
      const productoSeleccionado = productos.find(p => p._id === id);
      console.log("Producto seleccionado:", productoSeleccionado);
      
      if (productoSeleccionado && productoSeleccionado.identificadorIoT) {
        console.log("Cargando identificador IoT:", productoSeleccionado.identificadorIoT);
        setIdentificadorIoT(productoSeleccionado.identificadorIoT);
        setProductoId(id);
      }
    }
  }, [id, productos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado", { productoId, identificadorIoT });
    
    if (!productoId) {
      console.log("Error: No hay producto seleccionado");
      return Swal.fire({
        title: "Error",
        text: "Debes seleccionar un producto",
        icon: "error"
      });
    }

    if (!identificadorIoT) {
      console.log("Error: No hay identificador IoT");
      return Swal.fire({
        title: "Error",
        text: "Debes ingresar el identificador IoT",
        icon: "error"
      });
    }

    try {
      console.log("Verificando disponibilidad...");
      const token = localStorage.getItem("token");
      console.log("Token de autenticación:", token ? "Presente" : "Ausente");
      
      const verificacionUrl = `http://localhost:4000/api/dispositivos/verificar-disponibilidad/${productoId}`;
      console.log("URL de verificación:", verificacionUrl);
      
      const verificacion = await axios.get(
        verificacionUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log("Respuesta de verificación:", verificacion.data);

      if (!verificacion.data.disponible) {
        console.log("Dispositivo no disponible:", verificacion.data.mensaje);
        return Swal.fire({
          title: "Dispositivo no disponible",
          text: verificacion.data.mensaje,
          icon: "warning"
        });
      }

      console.log("Dispositivo disponible, procediendo con la activación...");
      const activacionUrl = "http://localhost:4000/api/dispositivos/activar";
      console.log("URL de activación:", activacionUrl);
      console.log("Datos a enviar:", { productoId, identificadorIoT });
      
      const response = await axios.post(
        activacionUrl,
        {
          productoId,
          identificadorIoT
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Respuesta de activación:", response.data);

      Swal.fire({
        title: "¡Éxito!",
        text: "Dispositivo activado correctamente",
        icon: "success"
      }).then(() => {
        console.log("Redirigiendo a mis dispositivos...");
        navigate("/usuario/mis-dispositivos");
      });
    } catch (error) {
      console.error("Error completo:", error);
      
      // Información más detallada del error
      let errorDetail = "";
      if (error.response) {
        // El servidor respondió con un código de error
        errorDetail = `Status: ${error.response.status}, Mensaje: ${JSON.stringify(error.response.data)}`;
        console.error("Error de respuesta:", errorDetail);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        errorDetail = "No se recibió respuesta del servidor. Verifica si el servidor está en ejecución.";
        console.error("Error de petición:", error.request);
      } else {
        // Algo ocurrió al configurar la petición
        errorDetail = error.message;
        console.error("Error de configuración:", error.message);
      }
      
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Error al activar el dispositivo",
        icon: "error",
        footer: `Detalles técnicos: ${errorDetail}`
      });
    }
  };

  if (loading) return <div className="activar-loading">Cargando...</div>;
  if (error) return <div className="activar-error">{error}</div>;

  return (
    <div className="activar-container">
      <h2>Activar Dispositivo IoT</h2>
      
      <form onSubmit={handleSubmit} className="activar-form">
        <div className="form-group">
          <label>Selecciona tu producto IoT:</label>
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            required
            className="producto-select"
          >
            <option value="">Seleccionar producto</option>
            {productos.map((producto) => (
              <option key={producto._id} value={producto._id}>
                {producto.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Identificador IoT (MAC):</label>
          <input
            type="text"
            placeholder="Ej: AB:CD:EF:12:34:56"
            value={identificadorIoT}
            onChange={(e) => setIdentificadorIoT(e.target.value)}
            required
            className="mac-input"
          />
          <small className="form-help">
            Este es el identificador único de tu dispositivo IoT. 
            Lo encuentras en la etiqueta del producto o en la documentación.
          </small>
        </div>

        <button type="submit" className="activar-btn">
          Activar Dispositivo
        </button>
      </form>
    </div>
  );
};

export default ActivarDispositivo;
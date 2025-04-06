//Esto es nuevo
// components/DispositivoDetalle.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../style/DispositivoDetalle.css";

const DispositivoDetalle = () => {
  const { id } = useParams();
  const [dispositivo, setDispositivo] = useState(null);
  const [datosSensor, setDatosSensor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDispositivo = async () => {
      try {
        // Obtener los detalles del dispositivo
        const respDispositivo = await axios.get(
          `http://localhost:4000/api/dispositivos/mis-dispositivos`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        
        // Buscar el dispositivo por ID
        const disp = respDispositivo.data.find(d => d._id === id);
        
        if (!disp) {
          setError("Dispositivo no encontrado");
          setLoading(false);
          return;
        }
        
        setDispositivo(disp);
        
        // Obtener los datos del sensor (si existen)
        if (disp.activo) {
          const respDatos = await axios.get(
            `http://localhost:4000/api/dispositivos/datos/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          setDatosSensor(respDatos.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos del dispositivo:", error);
        setError("Error al cargar los datos del dispositivo");
        setLoading(false);
      }
    };

    obtenerDispositivo();
  }, [id]);

  const handleDesactivar = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Desactivar este dispositivo liberará la asignación. ¿Continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `http://localhost:4000/api/dispositivos/desactivar/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          
          // Actualizar el estado del dispositivo
          setDispositivo({
            ...dispositivo,
            activo: false
          });
          
          Swal.fire({
            title: "Desactivado",
            text: "El dispositivo ha sido desactivado correctamente",
            icon: "success"
          });
        } catch (error) {
          console.error("Error al desactivar dispositivo:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo desactivar el dispositivo",
            icon: "error"
          });
        }
      }
    });
  };
  
  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    const f = new Date(fecha);
    return f.toLocaleString();
  };

  if (loading) return <div className="loading-detalle">Cargando datos del dispositivo...</div>;
  if (error) return <div className="error-detalle">{error}</div>;
  if (!dispositivo) return <div className="error-detalle">Dispositivo no encontrado</div>;

  return (
    <div className="dispositivo-detalle-container">
      <div className="detalle-header">
        <Link to="/usuario/mis-dispositivos" className="btn-volver">
          ← Volver a mis dispositivos
        </Link>
        <h2>Detalles del Dispositivo</h2>
      </div>
      
      <div className="dispositivo-info-card">
        <div className="info-header">
          <h3>{dispositivo.producto.nombre}</h3>
          <span className={`estado-badge ${dispositivo.activo ? 'activo' : 'inactivo'}`}>
            {dispositivo.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        
        <div className="info-content">
          <div className="info-imagen">
            <img 
              src={dispositivo.producto.imagenes[0]} 
              alt={dispositivo.producto.nombre} 
            />
          </div>
          
          <div className="info-detalles">
            <p><strong>ID del Dispositivo:</strong> {dispositivo._id}</p>
            <p><strong>Identificador IoT (MAC):</strong> {dispositivo.identificadorIoT}</p>
            <p><strong>Fecha de Activación:</strong> {formatearFecha(dispositivo.fechaActivacion)}</p>
            <p><strong>Descripción:</strong> {dispositivo.producto.descripcion}</p>
          </div>
        </div>
        
        {dispositivo.activo && (
          <div className="info-actions">
            <button 
              className="btn-desactivar"
              onClick={handleDesactivar}
            >
              Desactivar dispositivo
            </button>
          </div>
        )}
      </div>
      
      {dispositivo.activo && (
        <div className="datos-sensor-container">
          <h3>Datos del Dispositivo</h3>
          
          {datosSensor.length === 0 ? (
            <div className="no-datos">
              <p>
                Este dispositivo aún no ha enviado datos. 
                Los datos se mostrarán automáticamente cuando el dispositivo comience a transmitir.
              </p>
            </div>
          ) : (
            <div className="datos-grid">
              {datosSensor.map((dato, index) => (
                <div key={index} className="dato-card">
                  <div className="dato-tiempo">
                    {formatearFecha(dato.timestamp)}
                  </div>
                  <div className="dato-valores">
                    {Object.entries(dato.datos).map(([key, value]) => (
                      <div key={key} className="dato-item">
                        <span className="dato-label">{key}:</span>
                        <span className="dato-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DispositivoDetalle;
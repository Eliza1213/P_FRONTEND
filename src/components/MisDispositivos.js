// components/MisDispositivos.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useTerrarioApi } from "../utils/api"; // Solo para mostrar estado, no para control
import "../style/MisDispositivos.css";

const MisDispositivos = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activoFilter, setActivoFilter] = useState("todos"); // todos, activos, inactivos

  // API de control de terrario (solo para visualización de estado)
  const { status, connectionStatus } = useTerrarioApi();

  useEffect(() => {
    const obtenerDispositivos = async () => {
      try {
        const response = await axios.get(
          "https://mi-proyecto-virid.vercel.app/api/dispositivos/mis-dispositivos",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setDispositivos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener dispositivos:", error);
        setError("No se pudieron cargar tus dispositivos. Intenta más tarde.");
        setLoading(false);
      }
    };

    obtenerDispositivos();
  }, []);

  const handleDesactivar = async (dispositivoId) => {
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
            `https://mi-proyecto-virid.vercel.app/api/dispositivos/desactivar/${dispositivoId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          
          // Actualizar la lista de dispositivos
          setDispositivos(dispositivos.filter(d => d._id !== dispositivoId));
          
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

  // Filtrar dispositivos según el estado seleccionado
  const dispositivosFiltrados = dispositivos.filter(dispositivo => {
    if (activoFilter === "todos") return true;
    if (activoFilter === "activos") return dispositivo.activo;
    if (activoFilter === "inactivos") return !dispositivo.activo;
    return true;
  });

  if (loading) return <div className="loading-dispositivos">Cargando tus dispositivos...</div>;
  
  return (
    <div className="mis-dispositivos-container">
      <h2>Mis Dispositivos IoT</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {!error && dispositivos.length === 0 ? (
        <div className="no-dispositivos">
          <p>Aún no se ha agregado ningún dispositivo.</p>
          <Link to="/usuario/activar-iot" className="btn-activar">
            Activar un dispositivo
          </Link>
        </div>
      ) : (
        <>
          {/* Estado de conexión */}
          <div className={`connection-status ${connectionStatus}`}>
            Estado de conexión: {connectionStatus === 'connected' ? 'Conectado' : 
                               connectionStatus === 'connecting' ? 'Conectando...' : 
                               'Desconectado'}
          </div>

          {/* Filtros */}
          <div className="filtros-container">
            <label>Filtrar por estado:</label>
            <div className="filtros-botones">
              <button 
                className={`btn-filtro ${activoFilter === 'todos' ? 'activo' : ''}`}
                onClick={() => setActivoFilter('todos')}
              >
                Todos
              </button>
              <button 
                className={`btn-filtro ${activoFilter === 'activos' ? 'activo' : ''}`}
                onClick={() => setActivoFilter('activos')}
              >
                Activos
              </button>
              <button 
                className={`btn-filtro ${activoFilter === 'inactivos' ? 'activo' : ''}`}
                onClick={() => setActivoFilter('inactivos')}
              >
                Inactivos
              </button>
            </div>
          </div>
          
          {/* Lista de dispositivos */}
          <div className="dispositivos-grid">
            {dispositivosFiltrados.map((dispositivo) => (
              <div 
                key={dispositivo._id} 
                className={`dispositivo-card ${dispositivo.activo ? 'activo' : 'inactivo'}`}
              >
                <div className="dispositivo-header">
                  <h3>{dispositivo.producto.nombre}</h3>
                  <span className={`estado-badge ${dispositivo.activo ? 'activo' : 'inactivo'}`}>
                    {dispositivo.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="dispositivo-content">
                  <div className="dispositivo-imagen">
                    <img 
                      src={dispositivo.producto.imagenes[0]} 
                      alt={dispositivo.producto.nombre} 
                    />
                  </div>
                  
                  <div className="dispositivo-info">
                    <p><strong>ID IoT:</strong> {dispositivo.identificadorIoT}</p>
                    <p><strong>Activado:</strong> {new Date(dispositivo.fechaActivacion).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {/* Solo mostramos información de estado, no controles */}
                {dispositivo.activo && (
                  <div className="terrario-info">
                    <h4>Estado del Terrario</h4>
                    <div className="sensor-data">
                      <div className="sensor-item">
                        <span className="sensor-label">Temperatura:</span>
                        <span className="sensor-value">{status.temperature}°C</span>
                      </div>
                      <div className="sensor-item">
                        <span className="sensor-label">Nivel de comida:</span>
                        <span className="sensor-value">{
                          status.foodLevel === "high" ? "Alto" :
                          status.foodLevel === "medium" ? "Medio" : "Bajo"
                        }</span>
                      </div>
                      <div className="sensor-item">
                        <span className="sensor-label">Actividad:</span>
                        <span className="sensor-value">{status.turtleActivity ? "Detectada" : "No detectada"}</span>
                      </div>
                      <div className="sensor-item">
                        <span className="sensor-label">Ventilador:</span>
                        <span className="sensor-value">{status.fanState ? "Encendido" : "Apagado"}</span>
                      </div>
                      <div className="sensor-item">
                        <span className="sensor-label">Lámpara:</span>
                        <span className="sensor-value">{status.lampState ? "Encendida" : "Apagada"}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="dispositivo-actions">
                  <button 
                    className="btn-ver-datos"
                    onClick={() => window.location.href = `/usuario/terrario-control`}
                  >
                    Controlar terrario
                  </button>
                  
                  {dispositivo.activo && (
                    <button 
                      className="btn-desactivar"
                      onClick={() => handleDesactivar(dispositivo._id)}
                    >
                      Desactivar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="activar-nuevo">
            <Link to="/usuario/activar-iot" className="btn-activar">
              Activar nuevo dispositivo
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MisDispositivos;
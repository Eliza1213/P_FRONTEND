// src/components/TerrarioControlScreen.js
import React, { useState, useCallback, useEffect } from "react";
import { useTerrarioApi } from "../utils/api";
import "../style/terrarioControl.css";

// Íconos
import { 
  FaThermometerHalf, 
  FaPaw, 
  FaCog, 
  FaBolt, 
  FaLightbulb, 
  FaUtensils,
  FaWifi,
  FaSyncAlt
} from 'react-icons/fa';

const TerrarioControlScreen = () => {
  // Estado del terrario
  const [status, setStatus] = useState({
    temperature: 28.7,
    fanState: false,
    foodLevel: "empty",
    turtleActivity: false,
    stableTemp: 24.0,
    maxTemp: 30.0,
    lampState: false
  });
  
  // Estados de interfaz
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Hook API
  const { 
    status: apiStatus, 
    connectionStatus, 
    errorMessage, 
    connect, 
    controlFan, 
    controlLamp, 
    dispenseFood 
  } = useTerrarioApi();
  
  const connected = connectionStatus === 'connected';

  // Actualizar estado
  useEffect(() => {
    if (apiStatus) {
      setStatus(prev => ({
        ...prev,
        temperature: apiStatus.temperature,
        fanState: apiStatus.fanState,
        foodLevel: apiStatus.foodLevel,
        turtleActivity: apiStatus.turtleActivity,
        lampState: apiStatus.lampState
      }));
      
      if (connectionStatus === 'connected') {
        setLoading(false);
        setError(null);
      }
    }
  }, [apiStatus, connectionStatus]);

  // Manejar errores
  useEffect(() => {
    if (connectionStatus === 'error' && errorMessage) {
      setError(`Error de conexión: ${errorMessage}`);
      setLoading(false);
      setReconnectAttempts(prev => prev + 1);
      
      if (reconnectAttempts >= 3) {
        setError('No se puede conectar al servidor. Verifica tu conexión a Internet.');
      }
    }
  }, [connectionStatus, errorMessage, reconnectAttempts]);

  // Funciones de control
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setError(null);
    connect().finally(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    });
  }, [connect]);

  const handleFanToggle = useCallback((event) => {
    if (connected) {
      const value = event.target.checked;
      controlFan(value);
    }
  }, [connected, controlFan]);

  const handleLampToggle = useCallback((event) => {
    if (connected) {
      const value = event.target.checked;
      controlLamp(value);
    }
  }, [connected, controlLamp]);

  const handleDispenseFood = useCallback(() => {
    if (connected) {
      dispenseFood();
      alert('Dispensando comida. Se ha enviado la orden al dispensador.');
    }
  }, [connected, dispenseFood]);

  const handleForceReconnect = useCallback(() => {
    setLoading(true);
    setError(null);
    connect();
  }, [connect]);

  // Pantalla de carga
  if (loading && !refreshing) {
    return (
      <div className="loading-page">
        <div className="loading-content">
          <div className="spinner"></div>
          <h2>Conectando con el terrario...</h2>
          <p>Por favor espera mientras establecemos conexión</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Main Content */}
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <div className="title-container">
              <h2>Control del Terrario</h2>
              <div className="connection-status">
                <FaWifi className={`connection-icon ${connected ? 'connected' : 'disconnected'}`} />
                <span>{connected ? 'Conectado' : 'Desconectado'}</span>
                <button className="refresh-btn" onClick={onRefresh} disabled={refreshing}>
                  <FaSyncAlt className={refreshing ? 'spinning' : ''} />
                </button>
              </div>
            </div>
            <p>Monitorea y controla el hábitat de tu tortuga desde cualquier lugar</p>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="error-alert">
            <p>{error}</p>
            <button className="reconnect-btn" onClick={handleForceReconnect}>
              Intentar reconectar
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          {/* Status Panel */}
          <section className="status-panel card">
            <h3 className="panel-title">
              <FaThermometerHalf className="title-icon" />
              Estado Actual
            </h3>
            
            <div className="status-grid">
              <div className="status-item">
                <div className="status-icon temp">
                  <FaThermometerHalf />
                </div>
                <div className="status-info">
                  <p className="status-label">Temperatura</p>
                  <p className="status-value">{status.temperature.toFixed(1)}°C</p>
                </div>
              </div>

              <div className="status-item">
                <div className="status-icon food">
                  <FaUtensils />
                </div>
                <div className="status-info">
                  <p className="status-label">Nivel de Comida</p>
                  <p className="status-value">
                    {status.foodLevel === "empty" ? "Vacío" :
                    status.foodLevel === "medium" ? "Medio" : "Lleno"}
                  </p>
                </div>
              </div>

              <div className="status-item">
                <div className="status-icon activity">
                  <FaPaw />
                </div>
                <div className="status-info">
                  <p className="status-label">Actividad</p>
                  <p className="status-value">{status.turtleActivity ? "Activa" : "Inactiva"}</p>
                </div>
              </div>

              <div className="status-item">
                <div className="status-icon ideal">
                  <FaCog />
                </div>
                <div className="status-info">
                  <p className="status-label">Temp. Ideal</p>
                  <p className="status-value">
                    {status.stableTemp}°C - {status.maxTemp}°C
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Controls Panel */}
          <section className="controls-panel card">
            <h3 className="panel-title">
              <FaBolt className="title-icon" />
              Controles
            </h3>

            <div className="control-list">
              <div className="control-item">
                <div className="control-info">
                  <div className="control-icon">
                    <FaBolt />
                  </div>
                  <div>
                    <p className="control-label">Ventilador</p>
                    <p className="control-status">{status.fanState ? "Encendido" : "Apagado"}</p>
                  </div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={status.fanState}
                    onChange={handleFanToggle}
                    disabled={!connected}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="control-item">
                <div className="control-info">
                  <div className="control-icon">
                    <FaLightbulb />
                  </div>
                  <div>
                    <p className="control-label">Lámpara</p>
                    <p className="control-status">{status.lampState ? "Encendida" : "Apagada"}</p>
                  </div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={status.lampState}
                    onChange={handleLampToggle}
                    disabled={!connected}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <button 
                className={`food-button ${!connected ? 'disabled' : ''}`}
                onClick={handleDispenseFood}
                disabled={!connected}
              >
                <FaUtensils className="button-icon" />
                <span>Dispensar Comida</span>
              </button>
            </div>
          </section>
        </div>

        {/* Info Section */}
        <section className="info-section card">
          <h3>Información del Sistema</h3>
          <p>
            El sistema de TORTUTERRA permite monitorear y controlar el hábitat de tu tortuga en tiempo real.
            Todos los controles se actualizan instantáneamente cuando hay conexión estable.
          </p>
          <div className="status-indicator">
            <div className={`indicator-dot ${connected ? 'connected' : 'disconnected'}`}></div>
            <span>Estado actual: {connected ? 'Conectado al terrario' : 'Desconectado'}</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="page-footer">
        <p>© {new Date().getFullYear()} TORTUTERRA - Sistema de Control de Terrarios</p>
      </footer>
    </div>
  );
};

export default TerrarioControlScreen;
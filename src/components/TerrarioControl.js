// components/TerrarioControlPanel.js
import React, { useState, useEffect } from 'react';
import { useTerrarioApi } from '../utils/api';
import '../style/terrarioControl.css';

const TerrarioControlPanel = () => {
  const { 
    status, 
    connectionStatus, 
    errorMessage,
    connect, 
    controlFan, 
    controlLamp, 
    dispenseFood 
  } = useTerrarioApi();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        await connect();
        setLoading(false);
      } catch (error) {
        console.error("Error al conectar:", error);
        setLoading(false);
      }
    };

    initializeConnection();
  }, [connect]);

  const handleToggleFan = async () => {
    await controlFan(!status.fanState);
  };

  const handleToggleLamp = async () => {
    await controlLamp(!status.lampState);
  };

  const handleDispenseFood = async () => {
    await dispenseFood();
  };

  if (loading) {
    return <div className="loading-container">Conectando al terrario...</div>;
  }

  return (
    <div className="terrario-panel-container">
      <h2>Control del Terrario Inteligente</h2>
      
      <div className={`connection-status ${connectionStatus}`}>
        Estado de conexión: {connectionStatus === 'connected' ? 'Conectado' : 
                            connectionStatus === 'connecting' ? 'Conectando...' : 
                            'Desconectado'}
      </div>
      
      {errorMessage && (
        <div className="error-message">
          Error: {errorMessage}
        </div>
      )}
      
      <div className="panel-content">
        <div className="sensor-readings">
          <h3>Lecturas de Sensores</h3>
          
          <div className="sensor-grid">
            <div className="sensor-card temperature">
              <div className="sensor-icon">🌡️</div>
              <div className="sensor-data">
                <span className="sensor-value">{status.temperature}°C</span>
                <span className="sensor-label">Temperatura</span>
              </div>
            </div>
            
            <div className="sensor-card food-level">
              <div className="sensor-icon">🍽️</div>
              <div className="sensor-data">
                <span className="sensor-value">
                  {status.foodLevel === 'high' ? 'Alto' : 
                   status.foodLevel === 'medium' ? 'Medio' : 'Bajo'}
                </span>
                <span className="sensor-label">Nivel de Comida</span>
              </div>
            </div>
            
            <div className="sensor-card activity">
              <div className="sensor-icon">🐢</div>
              <div className="sensor-data">
                <span className="sensor-value">
                  {status.turtleActivity ? 'Detectada' : 'No detectada'}
                </span>
                <span className="sensor-label">Actividad</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="control-section">
          <h3>Controles</h3>
          
          <div className="control-grid">
            <div className="control-card">
              <h4>Ventilador</h4>
              <div className={`device-status ${status.fanState ? 'on' : 'off'}`}>
                {status.fanState ? 'Encendido' : 'Apagado'}
              </div>
              <button 
                className={`control-btn ${status.fanState ? 'active' : ''}`}
                onClick={handleToggleFan}
              >
                {status.fanState ? 'Apagar' : 'Encender'}
              </button>
            </div>
            
            <div className="control-card">
              <h4>Lámpara</h4>
              <div className={`device-status ${status.lampState ? 'on' : 'off'}`}>
                {status.lampState ? 'Encendida' : 'Apagada'}
              </div>
              <button 
                className={`control-btn ${status.lampState ? 'active' : ''}`}
                onClick={handleToggleLamp}
              >
                {status.lampState ? 'Apagar' : 'Encender'}
              </button>
            </div>
            
            <div className="control-card">
              <h4>Dispensador de Comida</h4>
              <button 
                className="control-btn food-btn"
                onClick={handleDispenseFood}
              >
                Dispensar Comida
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="terrario-info">
        <h3>Información del Terrario</h3>
        <p>
          Este panel te permite controlar tu terrario inteligente en tiempo real. 
          Puedes encender/apagar el ventilador y la lámpara para mantener la temperatura 
          adecuada, y dispensar comida cuando sea necesario.
        </p>
        <p>
          Los datos de los sensores se actualizan automáticamente cada 5 segundos para 
          mostrarte el estado actual de tu terrario.
        </p>
      </div>
    </div>
  );
};

export default TerrarioControlPanel;
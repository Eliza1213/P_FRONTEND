import React from "react";
import { Link } from "react-router-dom";
import { FaKey, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import "../style/recovery-method.css";

const SelectRecoveryMethod = () => {
  return (
    <div className="recovery-method-page">
      <div className="recovery-method-container">
        <div className="recovery-method-header">
          <h1>Recuperación de Contraseña</h1>
          <p>Selecciona el método para recuperar tu contraseña</p>
        </div>
        
        <div className="recovery-methods">
          <Link to="/recuperacion" className="method-card">
            <div className="method-icon">
              <FaKey />
            </div>
            <div className="method-content">
              <h3>Pregunta Secreta</h3>
              <p>Usa tu pregunta de seguridad para restablecer tu contraseña</p>
            </div>
          </Link>
          
          <Link to="/solicitar-restablecimiento" className="method-card">
            <div className="method-icon">
              <FaEnvelope />
            </div>
            <div className="method-content">
              <h3>Correo Electrónico</h3>
              <p>Recibe un enlace para restablecer tu contraseña en tu correo</p>
            </div>
          </Link>
        </div>
        
        <div className="action-links">
          <Link to="/login" className="back-link">
            <FaArrowLeft /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SelectRecoveryMethod;
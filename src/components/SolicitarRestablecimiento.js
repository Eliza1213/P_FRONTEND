import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEnvelope, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import "../style/restablecimiento.css";

const SolicitarRestablecimiento = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar el formato del correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El formato del correo electrónico no es válido.",
        confirmButtonColor: "#2a7f68",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:4000/api/usuarios/solicitar-restablecimiento", { email });
      Swal.fire({
        icon: "success",
        title: "Solicitud Enviada",
        text: response.data.mensaje,
        confirmButtonColor: "#2a7f68",
      });
      setEnviado(true);
    } catch (error) {
      if (error.response) {
        // Error de respuesta del servidor
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error,
          confirmButtonColor: "#2a7f68",
        });
      } else {
        // Error de red o de cliente
        Swal.fire({
          icon: "error",
          title: "Error de Conexión",
          text: "No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.",
          confirmButtonColor: "#2a7f68",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-container">
        <div className="reset-header">
          <h1>Restablecer Contraseña</h1>
          <p>Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>
        
        {!enviado ? (
          <form onSubmit={handleSubmit} className="reset-form">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
              </div>
              <p className="form-help">Recibirás un enlace en este correo para restablecer tu contraseña.</p>
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <FaPaperPlane /> Enviar Solicitud
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">
              <FaPaperPlane />
            </div>
            <h2>¡Solicitud Enviada!</h2>
            <p>Hemos enviado las instrucciones para restablecer tu contraseña a tu correo electrónico. Por favor, revisa tu bandeja de entrada.</p>
            <p className="note">Si no recibes el correo en unos minutos, revisa tu carpeta de spam.</p>
          </div>
        )}
        
        <div className="action-links">
          <Link to="/login" className="back-link">
            <FaArrowLeft /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SolicitarRestablecimiento;
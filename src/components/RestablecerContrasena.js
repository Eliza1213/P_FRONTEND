import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaUndo } from "react-icons/fa";
import "../style/restablecer.css";

const RestablecerContrasena = () => {
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({
    nueva: false,
    confirmar: false
  });
  const { token } = useParams(); // Obtener el token de la URL
  const navigate = useNavigate();

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{12,}$/;
    if (!passwordRegex.test(nuevaPassword)) {
      Swal.fire({
        icon: "error",
        title: "Contraseña débil",
        text: "La contraseña debe tener al menos 12 caracteres, una letra mayúscula, un número y un carácter especial.",
        confirmButtonColor: "#2a7f68",
      });
      return;
    }
    
    if (nuevaPassword !== confirmarPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
        confirmButtonColor: "#2a7f68",
      });
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.post("https://mi-proyecto-virid.vercel.app/api/usuarios/restablecer-contrasena", {
        token,
        nuevaPassword,
      });
      
      setSuccess(true);
      Swal.fire({
        icon: "success",
        title: "¡Contraseña restablecida!",
        text: response.data.mensaje,
        confirmButtonColor: "#2a7f68",
      });
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error,
          confirmButtonColor: "#2a7f68",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.",
          confirmButtonColor: "#2a7f68",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="restablecer-page">
      <div className="restablecer-container">
        <div className="restablecer-header">
          <h1>Restablecer Contraseña</h1>
          <p>Establece una nueva contraseña para tu cuenta</p>
        </div>
        
        {!success ? (
          <form onSubmit={handleSubmit} className="restablecer-form">
            <div className="form-group">
              <label htmlFor="nuevaPassword">Nueva Contraseña</label>
              <div className="input-container">
               
                <input
                  type={showPassword.nueva ? "text" : "password"}
                  id="nuevaPassword"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('nueva')}
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword.nueva ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              <div className="password-strength">
                <p>La contraseña debe tener:</p>
                <ul>
                  <li className={nuevaPassword.length >= 12 ? "valid" : ""}>
                    <span className="check-icon"><FaCheck /></span> Al menos 12 caracteres
                  </li>
                  <li className={/[A-Z]/.test(nuevaPassword) ? "valid" : ""}>
                    <span className="check-icon"><FaCheck /></span> Una letra mayúscula
                  </li>
                  <li className={/\d/.test(nuevaPassword) ? "valid" : ""}>
                    <span className="check-icon"><FaCheck /></span> Un número
                  </li>
                  <li className={/[^a-zA-Z0-9]/.test(nuevaPassword) ? "valid" : ""}>
                    <span className="check-icon"><FaCheck /></span> Un carácter especial
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmarPassword">Confirmar Contraseña</label>
              <div className="input-container">
                
                <input
                  type={showPassword.confirmar ? "text" : "password"}
                  id="confirmarPassword"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('confirmar')}
                  aria-label="Mostrar u ocultar confirmación de contraseña"
                >
                  {showPassword.confirmar ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {nuevaPassword && confirmarPassword && (
                <div className={`password-match ${nuevaPassword === confirmarPassword ? "valid" : "invalid"}`}>
                  {nuevaPassword === confirmarPassword ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                </div>
              )}
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
                  <FaUndo /> Restablecer Contraseña
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">
              <FaCheck />
            </div>
            <h2>¡Contraseña restablecida!</h2>
            <p>Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.</p>
            <Link to="/login" className="login-button">
              Iniciar Sesión
            </Link>
          </div>
        )}
        
        <div className="action-links">
          <Link to="/login" className="back-link">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestablecerContrasena;
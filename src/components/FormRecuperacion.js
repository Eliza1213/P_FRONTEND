import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaQuestion, FaCheck, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../style/recuperacion.css";

const FormRecuperacion = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    respuestaSecreta: "",
    nuevaPassword: "",
    confirmarPassword: "",
  });
  const [preguntaSecreta, setPreguntaSecreta] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    nueva: false,
    confirmar: false
  });

  // Progress bar calculation
  const progress = ((step + 1) / 4) * 100;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleNextStep = async () => {
    setLoading(true);
    
    if (step === 0) {
      // Validar correo
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      if (!formData.email) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debes ingresar un correo electrónico.",
          confirmButtonColor: "#2a7f68",
        });
        setLoading(false);
        return;
      }

      if (!emailRegex.test(formData.email)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El formato del correo electrónico no es válido.",
          confirmButtonColor: "#2a7f68",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post("https://mi-proyecto-virid.vercel.app/api/usuarios/verificar-correo", { email: formData.email });
        Swal.fire({
          icon: "success",
          title: "Correo Verificado",
          text: response.data.mensaje,
          confirmButtonColor: "#2a7f68",
        });
        setStep(1);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.error || "Error al verificar el correo",
          confirmButtonColor: "#2a7f68",
        });
      }
    } else if (step === 1) {
      // Verificar respuesta secreta
      if (!formData.respuestaSecreta) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debes responder la pregunta de seguridad.",
          confirmButtonColor: "#2a7f68",
        });
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.post("https://mi-proyecto-virid.vercel.app/api/usuarios/verificar-respuesta", {
          email: formData.email,
          respuesta: formData.respuestaSecreta,
        });
        Swal.fire({
          icon: "success",
          title: "Respuesta Correcta",
          text: response.data.mensaje,
          confirmButtonColor: "#2a7f68",
        });
        setStep(2);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.error || "Error al verificar la respuesta",
          confirmButtonColor: "#2a7f68",
        });
      }
    } else if (step === 2) {
      // Validar nueva contraseña
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{12,}$/;
      
      if (!formData.nuevaPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debes ingresar una nueva contraseña.",
          confirmButtonColor: "#2a7f68",
        });
        setLoading(false);
        return;
      }
      
      if (!passwordRegex.test(formData.nuevaPassword)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La contraseña debe tener al menos 12 caracteres, una letra mayúscula, un número y un carácter especial.",
          confirmButtonColor: "#2a7f68",
        });
        setLoading(false);
        return;
      }
      
      if (!formData.confirmarPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debes confirmar la nueva contraseña.",
          confirmButtonColor: "#2a7f68",
        });
        setLoading(false);
        return;
      }
      
      // Cambiar contraseña
      if (formData.nuevaPassword === formData.confirmarPassword) {
        try {
          const response = await axios.post("https://mi-proyecto-virid.vercel.app/api/usuarios/cambiar-contrasena", {
            email: formData.email,
            nuevaPassword: formData.nuevaPassword,
          });
          Swal.fire({
            icon: "success",
            title: "Contraseña Cambiada",
            text: response.data.mensaje,
            confirmButtonColor: "#2a7f68",
          });
          setStep(3); // Paso final
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.error || "Error al cambiar la contraseña",
            confirmButtonColor: "#2a7f68",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Las contraseñas no coinciden.",
          confirmButtonColor: "#2a7f68",
        });
      }
    }
    
    setLoading(false);
  };

  const fetchPreguntaSecreta = async () => {
    try {
      setLoading(true);
      const response = await axios.post("https://mi-proyecto-virid.vercel.app/api/usuarios/obtener-pregunta", { email: formData.email });
      setPreguntaSecreta(response.data.preguntaSecreta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Error al obtener la pregunta secreta",
        confirmButtonColor: "#2a7f68",
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener la pregunta secreta cuando se verifica el correo
  useEffect(() => {
    if (step === 1) {
      fetchPreguntaSecreta();
    }
  }, [step]);

  // Mapear preguntas secretas a textos descriptivos
  const formatPregunta = (preguntaClave) => {
    const preguntas = {
      "personaje-favorito": "¿Cuál es tu personaje favorito?",
      "pelicula-favorita": "¿Cuál es tu película favorita?",
      "mejor-amigo": "¿Quién es tu mejor amigo?",
      "nombre-mascota": "¿Cuál es el nombre de tu mascota?",
      "deporte-favorito": "¿Cuál es tu deporte favorito?"
    };
    
    return preguntas[preguntaClave] || preguntaClave;
  };

  const steps = ["Verificar Correo", "Pregunta Secreta", "Nueva Contraseña", "Completado"];

  return (
    <div className="recovery-page">
      <div className="recovery-container">
        <div className="recovery-header">
          <h1>Recuperar Contraseña</h1>
          <p>Sigue los pasos para recuperar tu acceso</p>
        </div>
        
        {/* Progress indicator */}
        <div className="progress-container">
          <div className="steps-indicators">
            {steps.map((stepName, index) => (
              <div 
                key={index} 
                className={`step-indicator ${step === index ? 'active' : ''} ${step > index ? 'completed' : ''}`}
              >
                <div className="step-number">{step > index ? <FaCheck /> : index + 1}</div>
                <div className="step-name">{stepName}</div>
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <form onSubmit={(e) => e.preventDefault()} className="recovery-form">
          {step === 0 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <div className="input-container">
                  
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="form-help">Ingresa el correo electrónico asociado a tu cuenta.</p>
              </div>
              
              <div className="button-container">
                <button
                  type="button"
                  className="next-button"
                  onClick={handleNextStep}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <>
                      Verificar Correo <FaArrowRight />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="pregunta">Pregunta de Seguridad</label>
                <div className="security-question">
                  <FaQuestion className="question-icon" />
                  <p>{formatPregunta(preguntaSecreta)}</p>
                </div>
                
                <label htmlFor="respuestaSecreta">Tu Respuesta</label>
                <div className="input-container">
                  
                  <input
                    type="text"
                    id="respuestaSecreta"
                    name="respuestaSecreta"
                    placeholder="Ingresa tu respuesta secreta"
                    value={formData.respuestaSecreta}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="form-help">Ingresa la respuesta exactamente como la registraste.</p>
              </div>
              
              <div className="button-container">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => setStep(0)}
                  disabled={loading}
                >
                  <FaArrowLeft /> Atrás
                </button>
                <button
                  type="button"
                  className="next-button"
                  onClick={handleNextStep}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <>
                      Verificar Respuesta <FaArrowRight />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="nuevaPassword">Nueva Contraseña</label>
                <div className="input-container">
                  
                  <input
                    type={showPassword.nueva ? "text" : "password"}
                    id="nuevaPassword"
                    name="nuevaPassword"
                    placeholder="Ingresa tu nueva contraseña"
                    value={formData.nuevaPassword}
                    onChange={handleChange}
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
                    <li className={formData.nuevaPassword.length >= 12 ? "valid" : ""}>
                      <span className="check-icon"><FaCheck /></span> Al menos 12 caracteres
                    </li>
                    <li className={/[A-Z]/.test(formData.nuevaPassword) ? "valid" : ""}>
                      <span className="check-icon"><FaCheck /></span> Una letra mayúscula
                    </li>
                    <li className={/\d/.test(formData.nuevaPassword) ? "valid" : ""}>
                      <span className="check-icon"><FaCheck /></span> Un número
                    </li>
                    <li className={/[^a-zA-Z0-9]/.test(formData.nuevaPassword) ? "valid" : ""}>
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
                    name="confirmarPassword"
                    placeholder="Confirma tu nueva contraseña"
                    value={formData.confirmarPassword}
                    onChange={handleChange}
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
                
                {formData.nuevaPassword && formData.confirmarPassword && (
                  <div className={`password-match ${formData.nuevaPassword === formData.confirmarPassword ? "valid" : "invalid"}`}>
                    {formData.nuevaPassword === formData.confirmarPassword ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                  </div>
                )}
              </div>
              
              <div className="button-container">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  <FaArrowLeft /> Atrás
                </button>
                <button
                  type="button"
                  className="next-button"
                  onClick={handleNextStep}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    "Cambiar Contraseña"
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step success-step">
              <div className="success-icon">
                <FaCheck />
              </div>
              <h2>¡Contraseña actualizada!</h2>
              <p>Tu contraseña ha sido cambiada con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.</p>
              <Link to="/login" className="login-link-button">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormRecuperacion;
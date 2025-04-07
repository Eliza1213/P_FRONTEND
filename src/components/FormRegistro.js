import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaQuestion, FaCheck } from "react-icons/fa";
import '../style/registro.css';

const FormRegistro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    ap: "",
    am: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    preguntaSecreta: "",
    respuestaSecreta: "",
    terminos: false,
  });

  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Progress bar calculation
  const progress = ((step + 1) / 3) * 100;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validarPaso = (step) => {
    const {
      nombre,
      ap,
      am,
      username,
      email,
      password,
      confirmPassword,
      telefono,
      respuestaSecreta,
      terminos,
    } = formData;

    const soloLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;
    const letrasYNumeros = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{12,}$/;
    const telefonoRegex = /^[0-9]{10}$/;

    let errores = [];

    if (step === 0) {
      if (!nombre) {
        errores.push("El campo 'Nombre/s' es obligatorio.");
      } else if (!soloLetras.test(nombre)) {
        errores.push("El campo 'Nombre/s' solo debe contener letras.");
      }
      if (!ap) {
        errores.push("El campo 'Apellido Paterno' es obligatorio.");
      } else if (!soloLetras.test(ap)) {
        errores.push("El campo 'Apellido Paterno' solo debe contener letras.");
      }
      if (!am) {
        errores.push("El campo 'Apellido Materno' es obligatorio.");
      } else if (!soloLetras.test(am)) {
        errores.push("El campo 'Apellido Materno' solo debe contener letras.");
      }
    }

    if (step === 1) {
      if (!username) {
        errores.push("El campo 'Nombre de Usuario' es obligatorio.");
      } else if (!letrasYNumeros.test(username)) {
        errores.push("El campo 'Nombre de Usuario' solo debe contener letras y números.");
      }
      if (!email) {
        errores.push("El campo 'Correo Electrónico' es obligatorio.");
      } else if (!emailRegex.test(email)) {
        errores.push("El campo 'Correo Electrónico' no es válido.");
      }
      if (!password) {
        errores.push("El campo 'Contraseña' es obligatorio.");
      } else if (!passwordRegex.test(password)) {
        errores.push("La contraseña debe tener al menos 12 caracteres, incluyendo una letra mayúscula, un número y un carácter especial.");
      }
      if (!confirmPassword) {
        errores.push("El campo 'Confirmar Contraseña' es obligatorio.");
      } else if (password !== confirmPassword) {
        errores.push("Las contraseñas no coinciden.");
      }
    }

    if (step === 2) {
      if (!telefono) {
        errores.push("El campo 'Teléfono' es obligatorio.");
      } else if (!telefonoRegex.test(telefono)) {
        errores.push("El campo 'Teléfono' debe contener exactamente 10 dígitos.");
      }
      if (!formData.preguntaSecreta) {
        errores.push("Debes seleccionar una pregunta secreta.");
      }
      if (!respuestaSecreta) {
        errores.push("El campo 'Respuesta Secreta' es obligatorio.");
      } else if (!soloLetras.test(respuestaSecreta)) {
        errores.push("El campo 'Respuesta Secreta' solo debe contener letras.");
      }
      if (!terminos) {
        errores.push("Debes aceptar los términos y condiciones.");
      }
    }

    if (errores.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Errores en el formulario",
        html: errores.join("<br>"),
        confirmButtonColor: "#2a7f68",
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validarPaso(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarPaso(2)) return;

    try {
      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          ap: formData.ap,
          am: formData.am,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono,
          preguntaSecreta: formData.preguntaSecreta,
          respuestaSecreta: formData.respuestaSecreta,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error,
          confirmButtonColor: "#2a7f68",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "¡Bienvenido! Por favor, inicia sesión.",
        confirmButtonColor: "#2a7f68",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#2a7f68",
      });
    }
  };

  // Function to determine which steps are completed
  const isStepCompleted = (stepIndex) => {
    if (stepIndex === 0) {
      return formData.nombre && formData.ap && formData.am;
    }
    if (stepIndex === 1) {
      return formData.username && formData.email && formData.password && formData.confirmPassword;
    }
    return false;
  };

  const steps = ["Información Personal", "Acceso", "Seguridad"];

  return (
    <div className="register-container">
      <div className="form-container">
        <h2>Registro de Usuario</h2>
        
        {/* Progress indicator */}
        <div className="progress-container">
          <div className="steps-indicators">
            {steps.map((stepName, index) => (
              <div 
                key={index} 
                className={`step-indicator ${step === index ? 'active' : ''} ${isStepCompleted(index) ? 'completed' : ''}`}
                onClick={() => index < step && setStep(index)}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-name">{stepName}</div>
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {step === 0 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="nombre">Nombre/s</label>
                <div className="input-container">
                  
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ap">Apellido Paterno</label>
                <div className="input-container">
                  
                  <input
                    type="text"
                    id="ap"
                    name="ap"
                    value={formData.ap}
                    onChange={handleChange}
                    placeholder="Ingresa tu apellido paterno"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="am">Apellido Materno</label>
                <div className="input-container">
                  
                  <input
                    type="text"
                    id="am"
                    name="am"
                    value={formData.am}
                    onChange={handleChange}
                    placeholder="Ingresa tu apellido materno"
                    required
                  />
                </div>
              </div>

              <div className="button-container">
                <button type="button" className="next-button" onClick={handleNextStep}>
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="username">Nombre de Usuario</label>
                <div className="input-container">
                  
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Elige un nombre de usuario"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <div className="input-container">
                  
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <div className="input-container">
                  
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 12 caracteres"
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility("password")}
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="password-strength">
                  <p>La contraseña debe tener:</p>
                  <ul>
                    <li className={formData.password.length >= 12 ? "valid" : ""}>
                      <span className="check-icon"><FaCheck /></span> Al menos 12 caracteres
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? "valid" : ""}>
                      <span className="check-icon"><FaCheck /></span> Una letra mayúscula
                    </li>
                    <li className={/\d/.test(formData.password) ? "valid" : ""}>
                      <span className="check-icon"><FaCheck /></span> Un número
                    </li>
                    <li className={/[^a-zA-Z0-9]/.test(formData.password) ? "valid" : ""}>
                      <span className="check-icon"><FaCheck /></span> Un carácter especial
                    </li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <div className="input-container">
                  
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility("confirm")}
                    aria-label="Mostrar u ocultar confirmación de contraseña"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formData.password && formData.confirmPassword && (
                  <div className={`password-match ${formData.password === formData.confirmPassword ? "valid" : "invalid"}`}>
                    {formData.password === formData.confirmPassword ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                  </div>
                )}
              </div>

              <div className="button-container">
                <button type="button" className="cancel-button" onClick={() => setStep(0)}>
                  Atrás
                </button>
                <button type="button" className="next-button" onClick={handleNextStep}>
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <div className="input-container">
                  
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="10 dígitos"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="preguntaSecreta">Pregunta Secreta</label>
                <div className="input-container">
                 
                  <select
                    id="preguntaSecreta"
                    name="preguntaSecreta"
                    value={formData.preguntaSecreta}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una pregunta</option>
                    <option value="personaje-favorito">¿Cuál es tu personaje favorito?</option>
                    <option value="pelicula-favorita">¿Cuál es tu película favorita?</option>
                    <option value="mejor-amigo">¿Quién es tu mejor amigo?</option>
                    <option value="nombre-mascota">¿Cuál es el nombre de tu mascota?</option>
                    <option value="deporte-favorito">¿Cuál es tu deporte favorito?</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="respuestaSecreta">Respuesta Secreta</label>
                <div className="input-container">
                  
                  <input
                    type="text"
                    id="respuestaSecreta"
                    name="respuestaSecreta"
                    value={formData.respuestaSecreta}
                    onChange={handleChange}
                    placeholder="Tu respuesta secreta"
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="terminos"
                    checked={formData.terminos}
                    onChange={handleChange}
                    required
                  />
                  <span className="checkmark"></span>
                  <span className="terms-text">
                    Acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer">términos y condiciones</a>
                  </span>
                </label>
              </div>

              <div className="button-container">
                <button type="button" className="cancel-button" onClick={() => setStep(1)}>
                  Atrás
                </button>
                <button type="submit" className="submit-button">
                  Registrarse
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="login-link">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
};

export default FormRegistro;
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const RestablecerContrasena = () => {
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const { token } = useParams(); // Obtener el token de la URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nuevaPassword !== confirmarPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }
  
    try {
      console.log("Token:", token); // Verificar el token
      const response = await axios.post("http://localhost:4000/api/usuarios/restablecer-contrasena", {
        token,
        nuevaPassword,
      });
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: response.data.mensaje,
      });
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.",
        });
      }
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nueva Contraseña:</label>
        <input
          type="password"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Confirmar Contraseña:</label>
        <input
          type="password"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Restablecer Contraseña</button>
    </form>
  );
};

export default RestablecerContrasena;

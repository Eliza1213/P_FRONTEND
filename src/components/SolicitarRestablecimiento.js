import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const SolicitarRestablecimiento = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/usuarios/solicitar-restablecimiento", { email });
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: response.data.mensaje,
      });
    } catch (error) {
      if (error.response) {
        // Error de respuesta del servidor
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error,
        });
      } else {
        // Error de red o de cliente
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
        <label>Correo Electrónico:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Solicitar Restablecimiento</button>
    </form>
  );
};

export default SolicitarRestablecimiento;
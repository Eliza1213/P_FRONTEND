import React, { useState } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Crear.css"; // Importa el archivo CSS

const CrearMision = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMision = { titulo, descripcion };

    try {
      console.log("Enviando solicitud POST:", newMision); // Depuración
      const response = await fetch("http://localhost:4000/api/misiones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMision),
      });

      if (response.ok) {
        // Mostrar alerta de éxito con SweetAlert2
        Swal.fire({
          title: "¡Éxito!",
          text: "Misión creada con éxito",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Limpiar el formulario después de crear la misión
        setTitulo("");
        setDescripcion("");
      } else {
        throw new Error("Error al crear misión");
      }
    } catch (error) {
      console.error("Error en la creación de misión:", error);
      setError(error.message);

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al crear la misión",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="visiones-container"> {/* Usamos la misma clase CSS */}
      <h2>Crear Misión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <button type="submit">Crear Misión</button>
      </form>
    </div>
  );
};

export default CrearMision;
import React, { useState } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Crear.css"; // Importa el archivo CSS

const CrearTermino = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTermino = { titulo, descripcion };

    try {
      console.log("Enviando solicitud POST:", newTermino); // Depuración
      const response = await fetch("http://localhost:4000/api/terminos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTermino),
      });

      if (response.ok) {
        // Mostrar alerta de éxito con SweetAlert2
        Swal.fire({
          title: "¡Éxito!",
          text: "Término creado con éxito",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        setTitulo("");
        setDescripcion("");
      } else {
        throw new Error("Error al crear término");
      }
    } catch (error) {
      console.error("Error en la creación de término:", error);
      setError(error.message);

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al crear el término",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="visiones-container"> {/* Mantenemos la misma clase CSS */}
      <h2>Crear Término</h2>
      {error && <p>{error}</p>}
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
        <button type="submit">Crear Término</button>
      </form>
    </div>
  );
};

export default CrearTermino;
import React, { useState } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Crear.css"; // Importa el archivo CSS

const CrearPolitica = () => {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPolitica = { titulo, contenido };

    try {
      console.log("Enviando solicitud POST:", newPolitica); // Depuración
      const response = await fetch("http://localhost:4000/api/politicas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPolitica),
      });

      if (response.ok) {
        // Mostrar alerta de éxito con SweetAlert2
        Swal.fire({
          title: "¡Éxito!",
          text: "Política creada con éxito",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Limpiar el formulario después de crear la política
        setTitulo("");
        setContenido("");
      } else {
        throw new Error("Error al crear política");
      }
    } catch (error) {
      console.error("Error en la creación de política:", error);
      setError(error.message);

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al crear la política",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="visiones-container"> {/* Usamos la misma clase CSS */}
      <h2>Crear Política</h2>
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
          placeholder="Contenido"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
        />
        <button type="submit">Crear Política</button>
      </form>
    </div>
  );
};

export default CrearPolitica;
import React, { useState } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Crear.css"; // Importa el archivo CSS

const CrearPregunta = () => {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPregunta = { pregunta, respuesta };

    try {
      const response = await fetch("http://localhost:4000/api/preguntas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPregunta),
      });

      if (response.ok) {
        // Mostrar alerta de éxito con SweetAlert2
        Swal.fire({
          title: "¡Éxito!",
          text: "Pregunta creada con éxito",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Limpiar el formulario después de crear la pregunta
        setPregunta("");
        setRespuesta("");
      } else {
        throw new Error("Error al crear pregunta");
      }
    } catch (error) {
      console.error("Error en la creación de pregunta:", error);

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al crear la pregunta",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="visiones-container"> {/* Usamos la misma clase CSS */}
      <h2>Crear Pregunta</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pregunta"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          required
        />
        <textarea
          placeholder="Respuesta"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          required
        />
        <button type="submit">Crear Pregunta</button>
      </form>
    </div>
  );
};

export default CrearPregunta;
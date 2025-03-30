import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Actualizar.css";

const ActualizarPregunta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");

  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/preguntas/${id}`);
        if (!response.ok) throw new Error("Error al obtener la pregunta");
        const data = await response.json();
        setPregunta(data.pregunta);
        setRespuesta(data.respuesta);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPregunta();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPregunta = { pregunta, respuesta };

    try {
      const response = await fetch(`http://localhost:4000/api/preguntas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPregunta),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Pregunta actualizada con éxito",
        }).then(() => navigate("/admin/preguntas/listar"));
      } else {
        throw new Error("Error al actualizar la pregunta");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la pregunta",
      });
    }
  };

  return (
    <div className="contactos-container">
      <h2>Actualizar Pregunta</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Pregunta" value={pregunta} onChange={(e) => setPregunta(e.target.value)} required />
        <textarea placeholder="Respuesta" value={respuesta} onChange={(e) => setRespuesta(e.target.value)} required />
        <button type="submit">Actualizar Pregunta</button>
      </form>
    </div>
  );
};

export default ActualizarPregunta;

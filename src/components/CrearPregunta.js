import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const CrearPregunta = () => {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pregunta.trim() || !respuesta.trim()) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
        confirmButtonColor: "#003366",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/preguntas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ pregunta, respuesta }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la pregunta");
      }

      Swal.fire({
        title: "¡Éxito!",
        text: "La pregunta se ha creado correctamente",
        icon: "success",
        confirmButtonColor: "#003366",
      }).then(() => {
        navigate("/admin/preguntas");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al crear la pregunta",
        icon: "error",
        confirmButtonColor: "#003366",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h2 className="formulario-titulo">Crear Nueva Pregunta</h2>
        <p className="formulario-descripcion">
          Añade una nueva pregunta al sistema de TortuTerra
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="formulario-campo">
          <label htmlFor="pregunta" className="formulario-label">
            Pregunta
          </label>
          <input
            type="text"
            id="pregunta"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            className="formulario-input"
            placeholder="Escribe la pregunta"
            required
          />
        </div>
        <div className="formulario-campo">
          <label htmlFor="respuesta" className="formulario-label">
            Respuesta
          </label>
          <textarea
            id="respuesta"
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            className="formulario-textarea"
            placeholder="Escribe la respuesta detallada"
            required
          />
        </div>
        <div className="formulario-botones">
          <Link to="/admin/preguntas" className="btn-cancelar">
            Cancelar
          </Link>
          <button type="submit" className="btn-guardar" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Pregunta"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearPregunta;
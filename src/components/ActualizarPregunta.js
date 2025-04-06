import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ActualizarPregunta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/preguntas/${id}`);
        if (!response.ok) throw new Error("Error al obtener la pregunta");
        
        const data = await response.json();
        setPregunta(data.pregunta);
        setRespuesta(data.respuesta);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar la información de la pregunta",
          icon: "error",
          confirmButtonColor: "#003366",
        }).then(() => {
          navigate("/admin/preguntas");
        });
      }
    };

    fetchPregunta();
  }, [id, navigate]);

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
      setSaving(true);
      const response = await fetch(`http://localhost:4000/api/preguntas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ pregunta, respuesta }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la pregunta");
      }

      Swal.fire({
        title: "¡Actualizado!",
        text: "La pregunta se ha actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#003366",
      }).then(() => {
        navigate("/admin/preguntas");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar la pregunta",
        icon: "error",
        confirmButtonColor: "#003366",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando información de la pregunta...</p>
      </div>
    );
  }

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h2 className="formulario-titulo">Actualizar Pregunta</h2>
        <p className="formulario-descripcion">
          Modifica la información de la pregunta existente
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
          <button type="submit" className="btn-guardar" disabled={saving}>
            {saving ? "Guardando..." : "Actualizar Pregunta"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActualizarPregunta;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const CrearMision = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim() || !descripcion.trim()) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
        confirmButtonColor: "#8bc34a",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/misiones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ titulo, descripcion }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la misión");
      }

      Swal.fire({
        title: "¡Éxito!",
        text: "La misión se ha creado correctamente",
        icon: "success",
        confirmButtonColor: "#8bc34a",
      }).then(() => {
        navigate("/admin/misiones");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al crear la misión",
        icon: "error",
        confirmButtonColor: "#8bc34a",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h2 className="formulario-titulo">Crear Nueva Misión</h2>
        <p className="formulario-descripcion">
          Añade una nueva misión al sistema de TortuTerra
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="formulario-campo">
          <label htmlFor="titulo" className="formulario-label">
            Título
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="formulario-input"
            placeholder="Escribe el título de la misión"
            required
          />
        </div>

        <div className="formulario-campo">
          <label htmlFor="descripcion" className="formulario-label">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="formulario-textarea"
            placeholder="Escribe la descripción detallada de la misión"
            required
          />
        </div>

        <div className="formulario-botones">
          <Link to="/admin/misiones" className="btn-cancelar">
            Cancelar
          </Link>
          <button type="submit" className="btn-guardar" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Misión"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearMision;
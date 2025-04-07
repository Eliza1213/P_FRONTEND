import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ActualizarMision = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMision = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/misiones/${id}`);
        if (!response.ok) throw new Error("Error al obtener la misión");
        
        const data = await response.json();
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar la información de la misión",
          icon: "error",
          confirmButtonColor: "#8bc34a",
        }).then(() => {
          navigate("/admin/misiones");
        });
      }
    };

    fetchMision();
  }, [id, navigate]);

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
      setSaving(true);
      const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/misiones/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ titulo, descripcion }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la misión");
      }

      Swal.fire({
        title: "¡Actualizado!",
        text: "La misión se ha actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#8bc34a",
      }).then(() => {
        navigate("/admin/misiones");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar la misión",
        icon: "error",
        confirmButtonColor: "#8bc34a",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando información de la misión...</p>
      </div>
    );
  }

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h2 className="formulario-titulo">Actualizar Misión</h2>
        <p className="formulario-descripcion">
          Modifica la información de la misión existente
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
          <button type="submit" className="btn-guardar" disabled={saving}>
            {saving ? "Guardando..." : "Actualizar Misión"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActualizarMision;
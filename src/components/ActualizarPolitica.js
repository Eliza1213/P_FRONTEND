import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ActualizarPolitica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPolitica = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/politicas/${id}`);
        if (!response.ok) throw new Error("Error al obtener la política");
        
        const data = await response.json();
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar la información de la política",
          icon: "error",
          confirmButtonColor: "#003366",
        }).then(() => {
          navigate("/admin/politicas");
        });
      }
    };

    fetchPolitica();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim() || !descripcion.trim()) {
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
      const response = await fetch(`http://localhost:4000/api/politicas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ titulo, descripcion }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la política");
      }

      Swal.fire({
        title: "¡Actualizado!",
        text: "La política se ha actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#003366",
      }).then(() => {
        navigate("/admin/politicas");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar la política",
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
        <p>Cargando información de la política...</p>
      </div>
    );
  }

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h2 className="formulario-titulo">Actualizar Política</h2>
        <p className="formulario-descripcion">
          Modifica la información de la política existente
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
            placeholder="Escribe el título de la política"
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
            placeholder="Escribe la descripción detallada de la política"
            required
          />
        </div>

        <div className="formulario-botones">
          <Link to="/admin/politicas" className="btn-cancelar">
            Cancelar
          </Link>
          <button type="submit" className="btn-guardar" disabled={saving}>
            {saving ? "Guardando..." : "Actualizar Política"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActualizarPolitica;
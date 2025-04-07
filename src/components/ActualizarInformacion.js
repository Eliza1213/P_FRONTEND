import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ActualizarInformacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [especie, setEspecie] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [alimentacion, setAlimentacion] = useState("");
  const [temperaturaIdeal, setTemperaturaIdeal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInformacion = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/informaciones/${id}`);
        if (!response.ok) throw new Error("Error al obtener la información");
        
        const data = await response.json();
        setEspecie(data.especie);
        setDescripcion(data.descripcion);
        setAlimentacion(data.alimentacion);
        setTemperaturaIdeal(data.temperatura_ideal);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar la información de la especie",
          icon: "error",
          confirmButtonColor: "#003366",
        }).then(() => {
          navigate("/admin/informaciones");
        });
      }
    };

    fetchInformacion();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!especie.trim() || !descripcion.trim() || !alimentacion.trim() || !temperaturaIdeal.trim()) {
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
      const informacionActualizada = {
        especie,
        descripcion,
        alimentacion,
        temperatura_ideal: temperaturaIdeal
      };

      const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/informaciones/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(informacionActualizada),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la información");
      }

      Swal.fire({
        title: "¡Actualizado!",
        text: "La información se ha actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#003366",
      }).then(() => {
        navigate("/admin/informaciones");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar la información",
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
        <p>Cargando información de la especie...</p>
      </div>
    );
  }

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h2 className="formulario-titulo">Actualizar Información de Tortuga</h2>
        <p className="formulario-descripcion">
          Modifica la información de la especie existente
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="formulario-campo">
          <label htmlFor="especie" className="formulario-label">
            Especie
          </label>
          <input
            type="text"
            id="especie"
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
            className="formulario-input"
            placeholder="Escribe el nombre de la especie"
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
            placeholder="Escribe una descripción detallada de la especie"
            required
          />
        </div>

        <div className="formulario-campo">
          <label htmlFor="alimentacion" className="formulario-label">
            Alimentación
          </label>
          <textarea
            id="alimentacion"
            value={alimentacion}
            onChange={(e) => setAlimentacion(e.target.value)}
            className="formulario-textarea"
            placeholder="Describe la dieta y hábitos alimenticios"
            required
          />
        </div>

        <div className="formulario-campo">
          <label htmlFor="temperaturaIdeal" className="formulario-label">
            Temperatura Ideal
          </label>
          <input
            type="text"
            id="temperaturaIdeal"
            value={temperaturaIdeal}
            onChange={(e) => setTemperaturaIdeal(e.target.value)}
            className="formulario-input"
            placeholder="Ejemplo: 25-30°C"
            required
          />
        </div>

        <div className="formulario-botones">
          <Link to="/admin/informaciones" className="btn-cancelar">
            Cancelar
          </Link>
          <button type="submit" className="btn-guardar" disabled={saving}>
            {saving ? "Guardando..." : "Actualizar Información"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActualizarInformacion;
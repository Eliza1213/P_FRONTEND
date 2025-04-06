import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const CrearInformacion = () => {
  const [especie, setEspecie] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [alimentacion, setAlimentacion] = useState("");
  const [temperaturaIdeal, setTemperaturaIdeal] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setLoading(true);
      const nuevaInformacion = {
        especie,
        descripcion,
        alimentacion,
        temperatura_ideal: temperaturaIdeal
      };

      const response = await fetch("http://localhost:4000/api/informaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(nuevaInformacion),
      });

      if (!response.ok) {
        throw new Error("Error al crear la información");
      }

      Swal.fire({
        title: "¡Éxito!",
        text: "La información se ha creado correctamente",
        icon: "success",
        confirmButtonColor: "#003366",
      }).then(() => {
        navigate("/admin/informaciones");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al crear la información",
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
        <h2 className="formulario-titulo">Crear Nueva Información de Tortuga</h2>
        <p className="formulario-descripcion">
          Añade información detallada sobre una especie de tortuga
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
          <button type="submit" className="btn-guardar" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Información"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearInformacion;
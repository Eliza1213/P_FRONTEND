import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Actualizar.css";

const ActualizarTermino = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const fetchTermino = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/terminos/${id}`);
        if (!response.ok) throw new Error("Error al obtener el término");
        const data = await response.json();
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
      } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo obtener el término." });
      }
    };

    fetchTermino();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTermino = { titulo, descripcion };

    try {
      const response = await fetch(`http://localhost:4000/api/terminos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTermino),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Término actualizado con éxito",
        }).then(() => navigate("/admin/terminos/listar"));
      } else {
        throw new Error("Error al actualizar término");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el término." });
    }
  };

  return (
    <div className="contactos-container">
      <h2>Actualizar Término</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        <button type="submit">Actualizar Término</button>
      </form>
    </div>
  );
};

export default ActualizarTermino;

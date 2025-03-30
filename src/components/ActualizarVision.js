import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Actualizar.css";

const ActualizarVision = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const fetchVision = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/visiones/${id}`);
        if (!response.ok) throw new Error("Error al obtener la visión");
        const data = await response.json();
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
      } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo obtener la visión." });
      }
    };

    fetchVision();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedVision = { titulo, descripcion };

    try {
      const response = await fetch(`http://localhost:4000/api/visiones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVision),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Visión actualizada con éxito",
        }).then(() => navigate("/admin/visiones/listar"));
      } else {
        throw new Error("Error al actualizar visión");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar la visión." });
    }
  };

  return (
    <div className="contactos-container">
      <h2>Actualizar Visión</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        <button type="submit">Actualizar Visión</button>
      </form>
    </div>
  );
};

export default ActualizarVision;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Actualizar.css";

const ActualizarPolitica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  useEffect(() => {
    const fetchPolitica = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/politicas/${id}`);
        if (!response.ok) throw new Error("Error al obtener la política");
        const data = await response.json();
        setTitulo(data.titulo);
        setContenido(data.contenido);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPolitica();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPolitica = { titulo, contenido };

    try {
      const response = await fetch(`http://localhost:4000/api/politicas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPolitica),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Política actualizada con éxito",
        }).then(() => navigate("/admin/politicas/listar"));
      } else {
        throw new Error("Error al actualizar política");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la política",
      });
    }
  };

  return (
    <div className="contactos-container">
      <h2>Actualizar Política</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <textarea placeholder="Contenido" value={contenido} onChange={(e) => setContenido(e.target.value)} required />
        <button type="submit">Actualizar Política</button>
      </form>
    </div>
  );
};

export default ActualizarPolitica;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Actualizar.css"; // Importa el archivo CSS

const ActualizarMision = () => {
  const { id } = useParams(); // Obtiene el ID de la misión desde la URL
  const navigate = useNavigate(); // Para redirigir después de actualizar
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMision = async () => {
      try {
        console.log("Obteniendo misión con ID:", id); // Depuración
        const response = await fetch(`http://localhost:4000/api/misiones/${id}`);
        if (!response.ok) throw new Error("Error al obtener la misión");
        const data = await response.json();
        console.log("Misión obtenida:", data); // Depuración
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
      } catch (error) {
        console.error(error);
        setError("Error al obtener la misión.");
      }
    };

    fetchMision();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedMision = { titulo, descripcion };

    try {
      console.log("Enviando solicitud PUT:", updatedMision); // Depuración
      const response = await fetch(`http://localhost:4000/api/misiones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMision),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Misión actualizada con éxito",
          confirmButtonText: "Aceptar",
        }).then(() => {
          navigate("/admin/misiones/listar"); // Redirige a la lista de misiones
        });
      } else {
        throw new Error("Error al actualizar misión");
      }
    } catch (error) {
      console.error("Error en la actualización:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al actualizar la misión",
      });
    }
  };

  return (
    <div className="contactos-container">
      <h2>Actualizar Misión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <button type="submit">Actualizar Misión</button>
      </form>
    </div>
  );
};

export default ActualizarMision;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Crear.css"; // Importa el archivo CSS

const CrearVision = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newVision = { titulo, descripcion };

    try {
      console.log("Enviando solicitud POST:", newVision); // Depuración
      const response = await fetch("http://localhost:4000/api/visiones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVision),
      });

      if (response.ok) {
        // Mostrar alerta de éxito con SweetAlert2
        await Swal.fire({
          title: "¡Éxito!",
          text: "Visión creada con éxito",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Redirigir a la lista de visiones
        navigate("/admin/visiones/listar");
      } else {
        throw new Error("Error al crear visión");
      }
    } catch (error) {
      console.error("Error en la creación de visión:", error);
      setError(error.message);

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al crear la visión",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="visiones-container">
      <h2>Crear Visión</h2>
      {error && <p>{error}</p>}
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
        <button type="submit">Crear Visión</button>
      </form>
    </div>
  );
};

export default CrearVision;
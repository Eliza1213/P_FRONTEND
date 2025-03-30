import React, { useState } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Crear.css"; // Importa el archivo CSS

const CrearInformacion = () => {
  const [especie, setEspecie] = useState("");
  const [alimentacion, setAlimentacion] = useState("");
  const [temperaturaIdeal, setTemperaturaIdeal] = useState("");
  const [humedadIdeal, setHumedadIdeal] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevaInformacion = {
      especie,
      alimentacion,
      temperatura_ideal: temperaturaIdeal,
      humedad_ideal: humedadIdeal,
      descripcion,
      imagen,
    };

    try {
      const response = await fetch("http://localhost:4000/api/informaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaInformacion),
      });

      if (response.ok) {
        // Mostrar alerta de éxito con SweetAlert2
        Swal.fire({
          title: "¡Éxito!",
          text: "Información creada con éxito",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Limpiar el formulario después de crear la información
        setEspecie("");
        setAlimentacion("");
        setTemperaturaIdeal("");
        setHumedadIdeal("");
        setDescripcion("");
        setImagen("");
      } else {
        throw new Error("Error al crear la información");
      }
    } catch (error) {
      console.error("Error en la creación de información:", error);

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al crear la información",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="visiones-container"> {/* Usamos la misma clase CSS */}
      <h2>Crear Información</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Especie"
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Alimentación"
          value={alimentacion}
          onChange={(e) => setAlimentacion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Temperatura Ideal"
          value={temperaturaIdeal}
          onChange={(e) => setTemperaturaIdeal(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Humedad Ideal"
          value={humedadIdeal}
          onChange={(e) => setHumedadIdeal(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="URL de la Imagen"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
          required
        />
        <button type="submit">Crear Información</button>
      </form>
    </div>
  );
};

export default CrearInformacion;
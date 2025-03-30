import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Actualizar.css"; // Importa el archivo CSS

const ActualizarInformacion = () => {
  const { id } = useParams(); // Obtiene el ID de la información desde la URL
  const navigate = useNavigate(); // Para redirigir después de actualizar
  const [especie, setEspecie] = useState("");
  const [alimentacion, setAlimentacion] = useState("");
  const [temperaturaIdeal, setTemperaturaIdeal] = useState("");
  const [humedadIdeal, setHumedadIdeal] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");

  useEffect(() => {
    const fetchInformacion = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/informaciones/${id}`);
        if (!response.ok) throw new Error("Error al obtener la información");
        const data = await response.json();
        setEspecie(data.especie);
        setAlimentacion(data.alimentacion);
        setTemperaturaIdeal(data.temperatura_ideal);
        setHumedadIdeal(data.humedad_ideal);
        setDescripcion(data.descripcion);
        setImagen(data.imagen);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInformacion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedInformacion = {
      especie,
      alimentacion,
      temperatura_ideal: temperaturaIdeal,
      humedad_ideal: humedadIdeal,
      descripcion,
      imagen,
    };

    try {
      const response = await fetch(`http://localhost:4000/api/informaciones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInformacion),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Información actualizada con éxito",
          confirmButtonText: "Aceptar",
        }).then(() => {
          navigate("/admin/informacion/listar"); // Redirige después de aceptar
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al actualizar la información",
        });
      }
    } catch (error) {
      console.error("Error en la actualización:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al actualizar la información",
      });
    }
  };

  return (
    <div className="contactos-container">
      <h2>Actualizar Información</h2>
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
        <button type="submit">Actualizar Información</button>
      </form>
    </div>
  );
};

export default ActualizarInformacion;

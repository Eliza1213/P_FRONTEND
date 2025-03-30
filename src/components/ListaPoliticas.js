import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Lista.css"; // Importa el archivo CSS compartido

const ListarPoliticas = () => {
  const [politicas, setPoliticas] = useState([]);

  useEffect(() => {
    const fetchPoliticas = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/politicas");
        if (!response.ok) throw new Error("Error al obtener políticas");
        const data = await response.json();
        console.log("Políticas obtenidas:", data); // Depuración
        setPoliticas(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPoliticas();
  }, []);

  const handleEliminar = async (id) => {
    // Mostrar confirmación con SweetAlert2
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003366", // Azul marino
      cancelButtonColor: "#dc3545", // Rojo
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:4000/api/politicas/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPoliticas(politicas.filter((politica) => politica._id !== id));

          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            title: "¡Eliminado!",
            text: "La política ha sido eliminada.",
            icon: "success",
            confirmButtonColor: "#003366", // Azul marino
          });
        } else {
          console.error("Error al eliminar la política");

          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar la política.",
            icon: "error",
            confirmButtonColor: "#003366", // Azul marino
          });
        }
      } catch (error) {
        console.error("Error:", error);

        // Mostrar alerta de error con SweetAlert2
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la política.",
          icon: "error",
          confirmButtonColor: "#003366", // Azul marino
        });
      }
    }
  };

  return (
    <div className="preguntas-container">
      <h2 className="preguntas-titulo">Listado de Políticas</h2>
      {/* Botón para crear una nueva política */}
      <Link to="/admin/politicas/crear" className="btn-crear">
        ➕ Crear Nueva Política
      </Link>
      {politicas.length === 0 ? (
        <p className="preguntas-vacio">No hay políticas disponibles</p>
      ) : (
        <table className="preguntas-tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {politicas.map((politica) => (
              <tr key={politica._id} className="pregunta-fila">
                <td>{politica.titulo}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/politicas/actualizar/${politica._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    Actualizar
                  </Link>
                  <button
                    onClick={() => handleEliminar(politica._id)}
                    className="btn-accion btn-eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarPoliticas;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Lista.css"; // Importa el archivo CSS

const ListarPreguntas = () => {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/preguntas");
        if (!response.ok) throw new Error("Error al obtener preguntas");
        const data = await response.json();
        console.log("Preguntas obtenidas:", data); // Depuración
        setPreguntas(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPreguntas();
  }, []);

  // Función para eliminar una pregunta con confirmación
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
        const response = await fetch(`http://localhost:4000/api/preguntas/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPreguntas(preguntas.filter((pregunta) => pregunta._id !== id));

          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            title: "¡Eliminado!",
            text: "La pregunta ha sido eliminada.",
            icon: "success",
            confirmButtonColor: "#003366", // Azul marino
          });
        } else {
          console.error("Error al eliminar la pregunta");

          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar la pregunta.",
            icon: "error",
            confirmButtonColor: "#003366", // Azul marino
          });
        }
      } catch (error) {
        console.error("Error:", error);

        // Mostrar alerta de error con SweetAlert2
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la pregunta.",
          icon: "error",
          confirmButtonColor: "#003366", // Azul marino
        });
      }
    }
  };

  return (
    <div className="preguntas-container">
      <h2 className="preguntas-titulo">Listado de Preguntas</h2>
      {/* Botón para crear una nueva pregunta */}
      <Link to="/admin/preguntas/crear" className="btn-crear">
        ➕ Crear Nueva Pregunta
      </Link>
      {preguntas.length === 0 ? (
        <p className="preguntas-vacio">No hay preguntas disponibles</p>
      ) : (
        <table className="preguntas-tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {preguntas.map((pregunta) => (
              <tr key={pregunta._id} className="pregunta-fila">
                <td>{pregunta.pregunta || "Sin título"}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/preguntas/actualizar/${pregunta._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    Actualizar
                  </Link>
                  <button
                    onClick={() => handleEliminar(pregunta._id)}
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

export default ListarPreguntas;
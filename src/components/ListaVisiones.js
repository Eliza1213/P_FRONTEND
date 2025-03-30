import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Lista.css"; // Importa el archivo CSS compartido

const ListarVisiones = () => {
  const [visiones, setVisiones] = useState([]);

  useEffect(() => {
    const fetchVisiones = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/visiones");
        if (!response.ok) throw new Error("Error al obtener visiones");
        const data = await response.json();
        console.log("Visiones obtenidas:", data); // Depuración
        setVisiones(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchVisiones();
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
        const response = await fetch(`http://localhost:4000/api/visiones/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setVisiones(visiones.filter((vision) => vision._id !== id));

          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            title: "¡Eliminado!",
            text: "La visión ha sido eliminada.",
            icon: "success",
            confirmButtonColor: "#003366", // Azul marino
          });
        } else {
          console.error("Error al eliminar la visión");

          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar la visión.",
            icon: "error",
            confirmButtonColor: "#003366", // Azul marino
          });
        }
      } catch (error) {
        console.error("Error:", error);

        // Mostrar alerta de error con SweetAlert2
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la visión.",
          icon: "error",
          confirmButtonColor: "#003366", // Azul marino
        });
      }
    }
  };

  return (
    <div className="preguntas-container">
      <h2 className="preguntas-titulo">Listado de Visiones</h2>
      {/* Botón para crear una nueva visión */}
      <Link to="/admin/visiones/crear" className="btn-crear">
        ➕ Crear Nueva Visión
      </Link>
      {visiones.length === 0 ? (
        <p className="preguntas-vacio">No hay visiones disponibles</p>
      ) : (
        <table className="preguntas-tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visiones.map((vision) => (
              <tr key={vision._id} className="pregunta-fila">
                <td>{vision.titulo}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/visiones/actualizar/${vision._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    Actualizar
                  </Link>
                  <button
                    onClick={() => handleEliminar(vision._id)}
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

export default ListarVisiones;
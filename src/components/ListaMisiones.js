import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Lista.css"; // Importa el archivo CSS compartido

const ListarMisiones = () => {
  const [misiones, setMisiones] = useState([]);

  useEffect(() => {
    const fetchMisiones = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/misiones");
        if (!response.ok) throw new Error("Error al obtener misiones");
        const data = await response.json();
        console.log("Misiones obtenidas:", data); // Depuración
        setMisiones(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMisiones();
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
        const response = await fetch(`http://localhost:4000/api/misiones/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setMisiones(misiones.filter((mision) => mision._id !== id));

          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            title: "¡Eliminado!",
            text: "La misión ha sido eliminada.",
            icon: "success",
            confirmButtonColor: "#003366", // Azul marino
          });
        } else {
          console.error("Error al eliminar la misión");

          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar la misión.",
            icon: "error",
            confirmButtonColor: "#003366", // Azul marino
          });
        }
      } catch (error) {
        console.error("Error:", error);

        // Mostrar alerta de error con SweetAlert2
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la misión.",
          icon: "error",
          confirmButtonColor: "#003366", // Azul marino
        });
      }
    }
  };

  return (
    <div className="preguntas-container">
      <h2 className="preguntas-titulo">Listado de Misiones</h2>
      {/* Botón para crear una nueva misión */}
      <Link to="/admin/misiones/crear" className="btn-crear">
        ➕ Crear Nueva Misión
      </Link>
      {misiones.length === 0 ? (
        <p className="preguntas-vacio">No hay misiones disponibles</p>
      ) : (
        <table className="preguntas-tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {misiones.map((mision) => (
              <tr key={mision._id} className="pregunta-fila">
                <td>{mision.titulo}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/misiones/actualizar/${mision._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    Actualizar
                  </Link>
                  <button
                    onClick={() => handleEliminar(mision._id)}
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

export default ListarMisiones;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Lista.css"; // Importa el archivo CSS compartido

const ListarTerminos = () => {
  const [terminos, setTerminos] = useState([]);

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/terminos");
        if (!response.ok) throw new Error("Error al obtener términos");
        const data = await response.json();
        console.log("Términos obtenidos:", data); // Depuración
        setTerminos(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTerminos();
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
        const response = await fetch(`http://localhost:4000/api/terminos/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setTerminos(terminos.filter((termino) => termino._id !== id));

          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            title: "¡Eliminado!",
            text: "El término ha sido eliminado.",
            icon: "success",
            confirmButtonColor: "#003366", // Azul marino
          });
        } else {
          console.error("Error al eliminar el término");

          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar el término.",
            icon: "error",
            confirmButtonColor: "#003366", // Azul marino
          });
        }
      } catch (error) {
        console.error("Error:", error);

        // Mostrar alerta de error con SweetAlert2
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar el término.",
          icon: "error",
          confirmButtonColor: "#003366", // Azul marino
        });
      }
    }
  };

  return (
    <div className="preguntas-container">
      <h2 className="preguntas-titulo">Listado de Términos y condiciones</h2>
      {/* Botón para crear un nuevo término */}
      <Link to="/admin/terminos/crear" className="btn-crear">
        ➕ Crear Nuevo Término
      </Link>
      {terminos.length === 0 ? (
        <p className="preguntas-vacio">No hay términos disponibles</p>
      ) : (
        <table className="preguntas-tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {terminos.map((termino) => (
              <tr key={termino._id} className="pregunta-fila">
                <td>{termino.titulo}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/terminos/actualizar/${termino._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    Actualizar
                  </Link>
                  <button
                    onClick={() => handleEliminar(termino._id)}
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

export default ListarTerminos;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/Lista.css"; // Importa el archivo CSS compartido

const ListarInformacion = () => {
  const [informaciones, setInformaciones] = useState([]);

  useEffect(() => {
    const fetchInformaciones = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/informaciones");
        if (!response.ok) throw new Error("Error al obtener información");
        const data = await response.json();
        console.log("Información obtenida:", data); // Depuración
        setInformaciones(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchInformaciones();
  }, []);

  // Función para eliminar información con confirmación
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
        const response = await fetch(`http://localhost:4000/api/informaciones/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setInformaciones(informaciones.filter((info) => info._id !== id));

          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            title: "¡Eliminado!",
            text: "La información ha sido eliminada.",
            icon: "success",
            confirmButtonColor: "#003366", // Azul marino
          });
        } else {
          console.error("Error al eliminar la información");

          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar la información.",
            icon: "error",
            confirmButtonColor: "#003366", // Azul marino
          });
        }
      } catch (error) {
        console.error("Error:", error);

        // Mostrar alerta de error con SweetAlert2
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la información.",
          icon: "error",
          confirmButtonColor: "#003366", // Azul marino
        });
      }
    }
  };

  return (
    <div className="preguntas-container">
      <h2 className="preguntas-titulo">Información sobre Tortugas</h2>
      {/* Botón para crear nueva información */}
      <Link to="/admin/informaciones/crear" className="btn-crear">
        ➕ Crear Nueva Información
      </Link>
      {informaciones.length === 0 ? (
        <p className="preguntas-vacio">No hay información disponible</p>
      ) : (
        <table className="preguntas-tabla">
          <thead>
            <tr>
              <th>Especie</th>
              <th>Alimentación</th>
              <th>Temperatura Ideal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informaciones.map((info) => (
              <tr key={info._id} className="pregunta-fila">
                <td>{info.especie}</td>
                <td>{info.alimentacion}</td>
                <td>{info.temperatura_ideal}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/informaciones/actualizar/${info._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    Actualizar
                  </Link>
                  <button
                    onClick={() => handleEliminar(info._id)}
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

export default ListarInformacion;
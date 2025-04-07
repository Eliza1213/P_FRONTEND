import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ListarPreguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/preguntas");
        if (!response.ok) throw new Error("Error al obtener preguntas");
        const data = await response.json();
        setPreguntas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las preguntas",
          icon: "error",
          confirmButtonColor: "#003366",
        });
        setLoading(false);
      }
    };

    fetchPreguntas();
  }, []);

  const handleEliminar = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003366",
      cancelButtonColor: "#f44336",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/preguntas/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          setPreguntas(preguntas.filter((pregunta) => pregunta._id !== id));
          Swal.fire({
            title: "¡Eliminado!",
            text: "La pregunta ha sido eliminada correctamente.",
            icon: "success",
            confirmButtonColor: "#003366",
          });
        } else {
          throw new Error("Error al eliminar la pregunta");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la pregunta.",
          icon: "error",
          confirmButtonColor: "#003366",
        });
      }
    }
  };

  // Filtrar preguntas
  const preguntasFiltradas = preguntas.filter(pregunta => 
    pregunta.pregunta.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando preguntas...</p>
      </div>
    );
  }

  return (
    <div className="preguntas-container">
      <div className="preguntas-header">
        <h2 className="preguntas-titulo">Gestión de Preguntas</h2>
        <p className="preguntas-descripcion">
          Administra las preguntas de TortuTerra
        </p>
      </div>
      
      <div className="acciones-header">
        <div className="filtro-busqueda">
          <input
            type="text"
            placeholder="Buscar por pregunta..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-input"
          />
        </div>
        <Link to="/admin/preguntas/crear" className="btn-crear">
          <i className="fas fa-plus"></i> Crear Nueva Pregunta
        </Link>
      </div>

      {preguntasFiltradas.length === 0 ? (
        <div className="preguntas-vacio">
          {filtro ? 
            "No se encontraron preguntas que coincidan con la búsqueda" : 
            "No hay preguntas disponibles"}
        </div>
      ) : (
        <table className="preguntas-tabla">
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {preguntasFiltradas.map((pregunta) => (
              <tr key={pregunta._id} className="pregunta-fila">
                <td>{pregunta.pregunta || "Sin título"}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/preguntas/actualizar/${pregunta._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    <i className="fas fa-edit"></i> Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(pregunta._id)}
                    className="btn-accion btn-eliminar"
                  >
                    <i className="fas fa-trash-alt"></i> Eliminar
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
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ListarMisiones = () => {
  const [misiones, setMisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchMisiones = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/misiones");
        if (!response.ok) throw new Error("Error al obtener misiones");
        const data = await response.json();
        setMisiones(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las misiones",
          icon: "error",
          confirmButtonColor: "#8bc34a",
        });
        setLoading(false);
      }
    };

    fetchMisiones();
  }, []);

  const handleEliminar = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8bc34a",
      cancelButtonColor: "#f44336",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/misiones/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          setMisiones(misiones.filter((mision) => mision._id !== id));
          Swal.fire({
            title: "¡Eliminado!",
            text: "La misión ha sido eliminada correctamente.",
            icon: "success",
            confirmButtonColor: "#8bc34a",
          });
        } else {
          throw new Error("Error al eliminar la misión");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la misión.",
          icon: "error",
          confirmButtonColor: "#8bc34a",
        });
      }
    }
  };

  // Filtrar misiones
  const misionesFiltradas = misiones.filter(mision => 
    mision.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando misiones...</p>
      </div>
    );
  }

  return (
    <div className="preguntas-container">
      <div className="preguntas-header">
        <h2 className="preguntas-titulo">Gestión de Misiones</h2>
        <p className="preguntas-descripcion">
          Administra las misiones de TortuTerra
        </p>
      </div>
      
      <div className="acciones-header">
        <div className="filtro-busqueda">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-input"
          />
        </div>
        <Link to="/admin/misiones/crear" className="btn-crear">
          <i className="fas fa-plus"></i> Crear Nueva Misión
        </Link>
      </div>

      {misionesFiltradas.length === 0 ? (
        <div className="preguntas-vacio">
          {filtro ? 
            "No se encontraron misiones que coincidan con la búsqueda" : 
            "No hay misiones disponibles"}
        </div>
      ) : (
        <table className="preguntas-tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {misionesFiltradas.map((mision) => (
              <tr key={mision._id} className="pregunta-fila">
                <td>{mision.titulo}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/misiones/actualizar/${mision._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    <i className="fas fa-edit"></i> Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(mision._id)}
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

export default ListarMisiones;
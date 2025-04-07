import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ListarVisiones = () => {
  const [visiones, setVisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchVisiones = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/visiones");
        if (!response.ok) throw new Error("Error al obtener visiones");
        const data = await response.json();
        setVisiones(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las visiones",
          icon: "error",
          confirmButtonColor: "#003366",
        });
        setLoading(false);
      }
    };

    fetchVisiones();
  }, []);

  const handleEliminar = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003366",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/visiones/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          setVisiones(visiones.filter((vision) => vision._id !== id));
          Swal.fire({
            title: "¡Eliminado!",
            text: "La visión ha sido eliminada correctamente.",
            icon: "success",
            confirmButtonColor: "#003366",
          });
        } else {
          throw new Error("Error al eliminar la visión");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la visión.",
          icon: "error",
          confirmButtonColor: "#003366",
        });
      }
    }
  };

  // Filtrar visiones
  const visionesFiltradas = visiones.filter(vision => 
    vision.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando visiones...</p>
      </div>
    );
  }

  return (
    <div className="preguntas-container">
      <div className="preguntas-header">
        <h2 className="preguntas-titulo">Gestión de Visiones</h2>
        <p className="preguntas-descripcion">
          Administra las visiones de TortuTerra
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
        <Link to="/admin/visiones/crear" className="btn-crear">
          <i className="fas fa-plus"></i> Crear Nueva Visión
        </Link>
      </div>

      {visionesFiltradas.length === 0 ? (
        <div className="preguntas-vacio">
          {filtro ? 
            "No se encontraron visiones que coincidan con la búsqueda" : 
            "No hay visiones disponibles"}
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
            {visionesFiltradas.map((vision) => (
              <tr key={vision._id} className="pregunta-fila">
                <td>{vision.titulo}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/visiones/actualizar/${vision._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    <i className="fas fa-edit"></i> Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(vision._id)}
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

export default ListarVisiones;
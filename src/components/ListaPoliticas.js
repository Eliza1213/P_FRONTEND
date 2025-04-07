import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ListarPoliticas = () => {
  const [politicas, setPoliticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchPoliticas = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/politicas");
        if (!response.ok) throw new Error("Error al obtener políticas");
        const data = await response.json();
        setPoliticas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las políticas",
          icon: "error",
          confirmButtonColor: "#003366",
        });
        setLoading(false);
      }
    };

    fetchPoliticas();
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
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/politicas/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          setPoliticas(politicas.filter((politica) => politica._id !== id));
          Swal.fire({
            title: "¡Eliminado!",
            text: "La política ha sido eliminada correctamente.",
            icon: "success",
            confirmButtonColor: "#003366",
          });
        } else {
          throw new Error("Error al eliminar la política");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la política.",
          icon: "error",
          confirmButtonColor: "#003366",
        });
      }
    }
  };

  // Filtrar políticas
  const politicasFiltradas = politicas.filter(politica => 
    politica.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando políticas...</p>
      </div>
    );
  }

  return (
    <div className="preguntas-container">
      <div className="preguntas-header">
        <h2 className="preguntas-titulo">Gestión de Políticas</h2>
        <p className="preguntas-descripcion">
          Administra las políticas de TortuTerra
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
        <Link to="/admin/politicas/crear" className="btn-crear">
          <i className="fas fa-plus"></i> Crear Nueva Política
        </Link>
      </div>

      {politicasFiltradas.length === 0 ? (
        <div className="preguntas-vacio">
          {filtro ? 
            "No se encontraron políticas que coincidan con la búsqueda" : 
            "No hay políticas disponibles"}
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
            {politicasFiltradas.map((politica) => (
              <tr key={politica._id} className="pregunta-fila">
                <td>{politica.titulo}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/politicas/actualizar/${politica._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    <i className="fas fa-edit"></i> Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(politica._id)}
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

export default ListarPoliticas;
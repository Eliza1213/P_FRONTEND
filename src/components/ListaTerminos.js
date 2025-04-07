import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ListarTerminos = () => {
  const [terminos, setTerminos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/terminos");
        if (!response.ok) throw new Error("Error al obtener términos");
        const data = await response.json();
        setTerminos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los términos y condiciones",
          icon: "error",
          confirmButtonColor: "#003366",
        });
        setLoading(false);
      }
    };

    fetchTerminos();
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
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/terminos/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          setTerminos(terminos.filter((termino) => termino._id !== id));
          Swal.fire({
            title: "¡Eliminado!",
            text: "El término ha sido eliminado correctamente.",
            icon: "success",
            confirmButtonColor: "#003366",
          });
        } else {
          throw new Error("Error al eliminar el término");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar el término.",
          icon: "error",
          confirmButtonColor: "#003366",
        });
      }
    }
  };

  // Filtrar términos
  const terminosFiltrados = terminos.filter(termino => 
    termino.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando términos y condiciones...</p>
      </div>
    );
  }

  return (
    <div className="preguntas-container">
      <div className="preguntas-header">
        <h2 className="preguntas-titulo">Gestión de Términos y Condiciones</h2>
        <p className="preguntas-descripcion">
          Administra los términos y condiciones de TortuTerra
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
        <Link to="/admin/terminos/crear" className="btn-crear">
          <i className="fas fa-plus"></i> Crear Nuevo Término
        </Link>
      </div>

      {terminosFiltrados.length === 0 ? (
        <div className="preguntas-vacio">
          {filtro ? 
            "No se encontraron términos que coincidan con la búsqueda" : 
            "No hay términos disponibles"}
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
            {terminosFiltrados.map((termino) => (
              <tr key={termino._id} className="pregunta-fila">
                <td>{termino.titulo}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/terminos/actualizar/${termino._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    <i className="fas fa-edit"></i> Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(termino._id)}
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

export default ListarTerminos;
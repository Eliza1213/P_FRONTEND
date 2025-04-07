import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ListarInformacion = () => {
  const [informaciones, setInformaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const informacionesPorPagina = 10;

  useEffect(() => {
    const fetchInformaciones = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/informaciones");
        if (!response.ok) throw new Error("Error al obtener información");
        const data = await response.json();
        setInformaciones(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las informaciones",
          icon: "error",
          confirmButtonColor: "#003366",
        });
        setInformaciones([]);
        setLoading(false);
      }
    };

    fetchInformaciones();
  }, []);

  // Función para eliminar información
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
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/informaciones/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const nuevasInformaciones = informaciones.filter((info) => info._id !== id);
          setInformaciones(nuevasInformaciones);
          
          // Ajustar página actual si la página actual queda vacía
          if (
            nuevasInformaciones.length > 0 && 
            nuevasInformaciones.length <= (paginaActual - 1) * informacionesPorPagina
          ) {
            setPaginaActual(paginaActual - 1);
          }

          Swal.fire({
            title: "¡Eliminado!",
            text: "La información ha sido eliminada correctamente.",
            icon: "success",
            confirmButtonColor: "#003366",
          });
        } else {
          throw new Error("Error al eliminar la información");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la información.",
          icon: "error",
          confirmButtonColor: "#003366",
        });
      }
    }
  };

  // Filtrar informaciones
  const informacionesFiltradas = informaciones.filter(info => {
    if (!filtro) return true;
    const filtroLower = filtro.toLowerCase();
    return (info.especie || '').toLowerCase().includes(filtroLower) ||
           (info.alimentacion || '').toLowerCase().includes(filtroLower) ||
           (info.temperatura_ideal || '').toLowerCase().includes(filtroLower);
  });

  // Paginación
  const indexUltimaInformacion = paginaActual * informacionesPorPagina;
  const indexPrimerInformacion = indexUltimaInformacion - informacionesPorPagina;
  const informacionesActuales = informacionesFiltradas.slice(
    indexPrimerInformacion, 
    indexUltimaInformacion
  );

  // Calcular número total de páginas
  const numeroPaginas = Math.ceil(informacionesFiltradas.length / informacionesPorPagina);

  // Cambiar página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="preguntas-container">
      <div className="preguntas-header">
        <h2 className="preguntas-titulo">Gestión de Información de Tortugas</h2>
        <p className="preguntas-descripcion">
          Administra la información de especies de TortuTerra
        </p>
      </div>
      
      <div className="acciones-header">
        <div className="filtro-busqueda">
          <input
            type="text"
            placeholder="Buscar por especie, alimentación o temperatura..."
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPaginaActual(1); // Volver a la primera página al filtrar
            }}
            className="filtro-input"
          />
        </div>
        <Link to="/admin/informaciones/crear" className="btn-crear">
          <i className="fas fa-plus"></i> Crear Nueva Información
        </Link>
      </div>

      {informacionesFiltradas.length === 0 ? (
        <div className="preguntas-vacio">
          {filtro ? 
            "No se encontraron resultados que coincidan con la búsqueda" : 
            "No hay información disponible"}
        </div>
      ) : (
        <>
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
              {informacionesActuales.map((info) => (
                <tr key={info._id} className="pregunta-fila">
                  <td>{info.especie || 'Sin especie'}</td>
                  <td>{info.alimentacion || 'Sin información'}</td>
                  <td>{info.temperatura_ideal || 'Sin datos'}</td>
                  <td className="acciones">
                    <Link
                      to={`/admin/informaciones/actualizar/${info._id}`}
                      className="btn-accion btn-actualizar"
                    >
                      <i className="fas fa-edit"></i> Editar
                    </Link>
                    <button
                      onClick={() => handleEliminar(info._id)}
                      className="btn-accion btn-eliminar"
                    >
                      <i className="fas fa-trash-alt"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="paginacion">
            {Array.from({ length: numeroPaginas }, (_, i) => (
              <button
                key={i}
                onClick={() => cambiarPagina(i + 1)}
                className={`btn-pagina ${paginaActual === i + 1 ? 'activo' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ListarInformacion;
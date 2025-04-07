import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ListarContactos = () => {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/contactos");
        if (!response.ok) throw new Error("Error al obtener contactos");
        const data = await response.json();
        setContactos(data || []); // Asegura que sea un arreglo incluso si es null
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los contactos",
          icon: "error",
          confirmButtonColor: "#003366",
        });
        setContactos([]); // Establece un arreglo vacío en caso de error
        setLoading(false);
      }
    };

    fetchContactos();
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
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/contactos/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          setContactos(contactos.filter((contacto) => contacto._id !== id));
          Swal.fire({
            title: "¡Eliminado!",
            text: "El contacto ha sido eliminado correctamente.",
            icon: "success",
            confirmButtonColor: "#003366",
          });
        } else {
          throw new Error("Error al eliminar el contacto");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar el contacto.",
          icon: "error",
          confirmButtonColor: "#003366",
        });
      }
    }
  };

  // Filtrar contactos de manera segura
  const contactosFiltrados = contactos.filter(contacto => {
    // Si no hay filtro, mostrar todos los contactos
    if (!filtro) return true;

    // Convierte a string vacío si es undefined o null
    const nombre = (contacto.nombre || '').toLowerCase();
    const email = (contacto.email || '').toLowerCase();
    const telefono = (contacto.telefono || '').toLowerCase();
    const filtroLower = filtro.toLowerCase();

    // Verifica si alguno de los campos contiene el filtro
    return nombre.includes(filtroLower) || 
           email.includes(filtroLower) || 
           telefono.includes(filtroLower);
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando contactos...</p>
      </div>
    );
  }

  return (
    <div className="preguntas-container">
      <div className="preguntas-header">
        <h2 className="preguntas-titulo">Gestión de Contactos</h2>
        <p className="preguntas-descripcion">
          Administra los contactos de TortuTerra
        </p>
      </div>
      
      <div className="acciones-header">
        <div className="filtro-busqueda">
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-input"
          />
        </div>
        <Link to="/admin/contactos/crear" className="btn-crear">
          <i className="fas fa-plus"></i> Crear Nuevo Contacto
        </Link>
      </div>

      {contactosFiltrados.length === 0 ? (
        <div className="preguntas-vacio">
          {filtro ? 
            "No se encontraron contactos que coincidan con la búsqueda" : 
            "No hay contactos disponibles"}
        </div>
      ) : (
        <table className="preguntas-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactosFiltrados.map((contacto) => (
              <tr key={contacto._id} className="pregunta-fila">
                <td>{contacto.nombre || 'Sin nombre'}</td>
                <td>{contacto.email || 'Sin email'}</td>
                <td>{contacto.telefono || 'Sin teléfono'}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/contactos/actualizar/${contacto._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    <i className="fas fa-edit"></i> Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(contacto._id)}
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

export default ListarContactos;
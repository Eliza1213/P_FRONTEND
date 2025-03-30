import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/ListaContactos.css"; // Importa el archivo de estilos

const ListaContactos = () => {
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/contactos");
        if (!response.ok) throw new Error("Error al obtener contactos");
        const data = await response.json();
        console.log("Contactos obtenidos:", data); // Depuración
        setContactos(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchContactos();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
      try {
        const response = await fetch(`http://localhost:4000/api/contactos/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setContactos(contactos.filter((contacto) => contacto._id !== id));
        } else {
          console.error("Error al eliminar el contacto");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="contactos-container">
      <h2 className="contactos-titulo">Contactos</h2>
      {/* Botón para crear un nuevo contacto */}
      <Link to="/admin/contactos/crear" className="btn-crear">
        ➕ Crear Nuevo Contacto
      </Link>
      {contactos.length === 0 ? (
        <p className="contactos-vacio">No hay contactos disponibles</p>
      ) : (
        <table className="contactos-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((contacto) => (
              <tr key={contacto._id} className="contacto-fila">
                <td>{contacto.nombre}</td>
                <td>{contacto.email}</td>
                <td>{contacto.telefono}</td>
                <td className="acciones">
                  <Link
                    to={`/admin/contactos/actualizar/${contacto._id}`}
                    className="btn-accion btn-actualizar"
                  >
                    Actualizar
                  </Link>
                  <button
                    onClick={() => handleEliminar(contacto._id)}
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

export default ListaContactos;

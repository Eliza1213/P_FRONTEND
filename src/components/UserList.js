import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);

  // Obtener todos los usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/usuarios/admin/usuarios", {
          headers: { Authorization: token },
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  // Actualizar el rol de un usuario
  const handleUpdateRol = async (id, nuevoRol) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/api/admin/usuarios/${id}/rol`,
        { rol: nuevoRol },
        { headers: { Authorization: token } }
      );
      setUsuarios(usuarios.map(usuario => usuario._id === id ? response.data : usuario));
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  // Eliminar un usuario
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/usuarios/admin/usuarios${id}`, {
        headers: { Authorization: token },
      });
      setUsuarios(usuarios.filter(usuario => usuario._id !== id));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>
                <select
                  value={usuario.rol}
                  onChange={(e) => handleUpdateRol(usuario._id, e.target.value)}
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(usuario._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
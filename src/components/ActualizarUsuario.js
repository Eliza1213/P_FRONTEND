import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ActualizarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rol, setRol] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/usuarios/${id}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al obtener el usuario: ${errorText}`);
        }
        
        const data = await response.json();
        setUsuario(data);
        setRol(data.rol);
      } catch (error) {
        console.error("Error detallado:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo cargar la información del usuario'
        });
      }
    };
  
    fetchUsuario();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rol }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Rol de usuario actualizado correctamente'
        }).then(() => {
          navigate("/admin/usuarios/listar");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.message || 'Error al actualizar rol de usuario'
        });
      }
    } catch (error) {
      console.error("Error en la actualización:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar el rol'
      });
    }
  };

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="usuarios-container">
      <h2>Actualizar Rol de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre: {usuario.nombre}</label>
        </div>
        <div>
          <label>Email: {usuario.email}</label>
        </div>
        <div>
          <label>Rol Actual:</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)} required>
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Actualizar Rol</button>
      </form>
    </div>
  );
};

export default ActualizarUsuario;
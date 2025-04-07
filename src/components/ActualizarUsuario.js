// components/ActualizarUsuario.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/ActualizarUsuario.css";

const ActualizarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre: "",
    ap: "",
    am: "",
    email: "",
    telefono: "",
    username: "",
    rol: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener usuario");
        }

        const data = await response.json();
        setUsuario(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener la información del usuario",
        });
        setLoading(false);
      }
    };

    obtenerUsuario();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar usuario");
      }

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: "La información del usuario ha sido actualizada correctamente",
      }).then(() => {
        navigate("/admin/usuarios");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la información del usuario",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="actualizar-usuario-loading">
        <div className="spinner"></div>
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  return (
    <div className="actualizar-usuario-container">
      <div className="actualizar-usuario-header">
        <h2>Actualizar Usuario</h2>
        <p>ID: {id}</p>
      </div>

      <form onSubmit={handleSubmit} className="actualizar-usuario-form">
        <div className="form-section">
          <h3>Información Personal</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={usuario.nombre || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ap">Apellido Paterno</label>
              <input
                type="text"
                id="ap"
                name="ap"
                value={usuario.ap || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="am">Apellido Materno</label>
              <input
                type="text"
                id="am"
                name="am"
                value={usuario.am || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={usuario.telefono || ""}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Debe ser un número de 10 dígitos"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Información de Cuenta</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={usuario.email || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                value={usuario.username || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rol">Rol</label>
              <select
                id="rol"
                name="rol"
                value={usuario.rol || ""}
                onChange={handleChange}
                required
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancelar"
            onClick={() => navigate("/admin/usuarios")}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-guardar"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActualizarUsuario;
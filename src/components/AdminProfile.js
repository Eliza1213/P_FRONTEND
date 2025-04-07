// components/AdminProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/AdminProfile.css";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/usuarios/perfil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el perfil del administrador");
        }

        const data = await response.json();
        setAdminData(data.usuario);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el perfil de administrador",
        });
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil del administrador");
      }

      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tu información ha sido actualizada correctamente",
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la información",
      });
    }
  };

  const handleCambiarContraseña = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Cambiar Contraseña",
      html: `
        <input id="swal-current-password" type="password" placeholder="Contraseña actual" class="swal2-input">
        <input id="swal-new-password" type="password" placeholder="Nueva contraseña" class="swal2-input">
        <input id="swal-confirm-password" type="password" placeholder="Confirmar nueva contraseña" class="swal2-input">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const currentPassword = document.getElementById('swal-current-password').value;
        const newPassword = document.getElementById('swal-new-password').value;
        const confirmPassword = document.getElementById('swal-confirm-password').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Por favor, completa todos los campos');
          return false;
        }
        
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Las nuevas contraseñas no coinciden');
          return false;
        }
        
        return { currentPassword, newPassword };
      }
    });

    if (formValues) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/usuarios/cambiar-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            passwordActual: formValues.currentPassword,
            nuevaPassword: formValues.newPassword,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al cambiar la contraseña");
        }

        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada",
          text: "Tu contraseña ha sido actualizada correctamente",
        });
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "No se pudo cambiar la contraseña",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-profile-loading">
        <div className="spinner"></div>
        <p>Cargando información del perfil...</p>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="admin-profile-error">
        <p>No se pudo cargar la información del perfil. Por favor, intenta nuevamente.</p>
        <button onClick={() => window.location.reload()} className="reload-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-card">
        {isEditing ? (
          <>
            <div className="profile-header editing">
              <h2>Editar Perfil de Administrador</h2>
              <p className="profile-subtitle">Modifica tus datos personales</p>
            </div>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    value={adminData.nombre || ''} 
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
                    value={adminData.ap || ''} 
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
                    value={adminData.am || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input 
                    type="tel" 
                    id="telefono" 
                    name="telefono" 
                    value={adminData.telefono || ''} 
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    title="Debe ser un número de 10 dígitos"
                  />
                </div>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="email">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={adminData.email || ''} 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="username">Nombre de Usuario</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={adminData.username || ''} 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-btn">Guardar Cambios</button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="profile-header">
              <div className="profile-avatar">
                {adminData.nombre ? adminData.nombre.charAt(0).toUpperCase() : ''}
                {adminData.ap ? adminData.ap.charAt(0).toUpperCase() : ''}
              </div>
              <h2>{adminData.nombre} {adminData.ap} {adminData.am}</h2>
              <span className="profile-role admin">Administrador</span>
            </div>
            
            <div className="profile-info">
              <div className="info-section">
                <h3>Información Personal</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Nombre completo</span>
                    <span className="info-value">{adminData.nombre} {adminData.ap} {adminData.am}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Correo Electrónico</span>
                    <span className="info-value">{adminData.email}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Teléfono</span>
                    <span className="info-value">{adminData.telefono || 'No especificado'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Nombre de usuario</span>
                    <span className="info-value">{adminData.username}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-section">
                <h3>Información de Seguridad</h3>
                <div className="security-info">
                  <p>Puedes actualizar tu información de perfil o cambiar tu contraseña utilizando los botones de abajo.</p>
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              <button 
                onClick={() => setIsEditing(true)} 
                className="edit-btn"
              >
                Modificar Perfil
              </button>
              <button 
                onClick={handleCambiarContraseña}
                className="password-btn"
              >
                Cambiar Contraseña
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
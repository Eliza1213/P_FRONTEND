// UserProfile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/UserProfile.css";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/api/usuarios/perfil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el perfil del usuario");
        }

        const data = await response.json();
        setUserData(data.usuario);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el perfil de usuario'
        });
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:4000/api/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil del usuario");
      }

      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: 'Los cambios han sido guardados correctamente'
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el perfil'
      });
    }
  };

  if (loading) {
    return (
      <div className="user-profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando información de perfil...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="user-profile-error">
        <p>No se pudo cargar la información del perfil. Por favor, intenta nuevamente.</p>
        <button onClick={() => window.location.reload()} className="reload-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        {isEditing ? (
          <>
            <div className="profile-header editing">
              <h2>Editar Perfil</h2>
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
                    value={userData.nombre || ''} 
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
                    value={userData.ap || ''} 
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
                    value={userData.am || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input 
                    type="tel" 
                    id="telefono" 
                    name="telefono" 
                    value={userData.telefono || ''} 
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
                  value={userData.email || ''} 
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
                  value={userData.username || ''} 
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
                {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : ''}
                {userData.ap ? userData.ap.charAt(0).toUpperCase() : ''}
              </div>
              <h2>{userData.nombre} {userData.ap} {userData.am}</h2>
              <span className="profile-role">{userData.rol}</span>
            </div>
            
            <div className="profile-info">
              <div className="info-section">
                <h3>Información Personal</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Nombre completo</span>
                    <span className="info-value">{userData.nombre} {userData.ap} {userData.am}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Correo Electrónico</span>
                    <span className="info-value">{userData.email}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Teléfono</span>
                    <span className="info-value">{userData.telefono || 'No especificado'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Nombre de usuario</span>
                    <span className="info-value">{userData.username}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-section">
                <h3>Cuenta</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Rol</span>
                    <span className="info-value role-badge">{userData.rol}</span>
                  </div>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
// components/DashboardWelcome.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/AdminDashboard.css';

const DashboardWelcome = () => {
  return (
    <div className="welcome-container">
      <h1>Bienvenido al Panel de Administración</h1>
      <p>
        Desde este panel podrás gestionar todo el contenido de TortuTerra.
        Selecciona una de las opciones populares a continuación o usa el menú lateral para navegar.
      </p>
      
      <div className="welcome-actions">
        <Link to="/admin/productos" className="action-card">
          <div className="action-icon">
            <i className="fas fa-box-open"></i>
          </div>
          <div className="action-title">Productos</div>
          <div className="action-description">
            Gestiona el catálogo de productos y dispositivos IoT
          </div>
        </Link>
        
        <Link to="/admin/usuarios" className="action-card">
          <div className="action-icon">
            <i className="fas fa-users-cog"></i>
          </div>
          <div className="action-title">Usuarios</div>
          <div className="action-description">
            Administra usuarios y asigna roles
          </div>
        </Link>
        
        <Link to="/admin/perfil" className="action-card">
          <div className="action-icon">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="action-title">Mi Perfil</div>
          <div className="action-description">
            Actualiza tu información personal
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardWelcome;
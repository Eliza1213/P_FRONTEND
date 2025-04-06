import "../style/Admin.css";
import React from "react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CrearMision from "../components/CrearMision";
import ListaMisiones from "../components/ListaMisiones";
import ActualizarMision from "../components/ActualizarMision";
import CrearVision from "../components/CrearVision";
import ListaVisiones from "../components/ListaVisiones";
import ActualizarVision from "../components/ActualizarVision";
import CrearTermino from "../components/CrearTermino";
import ListaTerminos from "../components/ListaTerminos";
import ActualizarTermino from "../components/ActualizarTermino";
import CrearPolitica from "../components/CrearPolitica";
import ListaPoliticas from "../components/ListaPoliticas";
import ActualizarPolitica from "../components/ActualizarPolitica";
import CrearPregunta from "../components/CrearPregunta";
import ListaPreguntas from "../components/ListaPreguntas";
import ActualizarPregunta from "../components/ActualizarPregunta";
import CrearContacto from "../components/CrearContacto";
import ListaContactos from "../components/ListaContactos";
import ActualizarContacto from "../components/ActualizarContacto";
import CrearProducto from "../components/CrearProducto";
import ListaProductos from "../components/ListaProductos";
import ActualizarProducto from "../components/ActualizarProducto";
import CrearInformacion from "../components/CrearInformacion";
import ListaInformacion from "../components/ListaInformacion";
import ActualizarInformacion from "../components/ActualizarInformacion";
import UsuariosAdmin from "./UsuariosAdmin";
import DispositivosAdmin from "./DispositivosAdmin";
import ListaUsuarios from "../components/ListaUsuarios";
import ActualizarUsuario from "../components/ActualizarUsuario";
import AdminProfile from "../components/AdminProfile";
import DashboardWelcome from "../components/DashboardWelcome";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar qué enlace está activo
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro que deseas salir del panel de administración?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("nombre");
        navigate("/login");
        Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente.", "success");
      }
    });
  };

  return (
    <div className="admin-container">
      {/* Menú de navegación */}
      <nav className="admin-nav">
        <div className="admin-panel-title">
          Panel de Administración
        </div>
        
        <div className="profile-link-container">
          <Link to="/admin/perfil" className={`profile-link ${isActive('/admin/perfil') ? 'active' : ''}`}>
            <i className="fas fa-user-circle"></i> Mi Perfil
          </Link>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/admin/misiones" className={isActive('/admin/misiones') ? 'active' : ''}>
              <i className="fas fa-bullseye"></i> Misiones
            </Link>
          </li>
          <li>
            <Link to="/admin/visiones" className={isActive('/admin/visiones') ? 'active' : ''}>
              <i className="fas fa-eye"></i> Visiones
            </Link>
          </li>
          <li>
            <Link to="/admin/terminos" className={isActive('/admin/terminos') ? 'active' : ''}>
              <i className="fas fa-file-contract"></i> Términos
            </Link>
          </li>
          <li>
            <Link to="/admin/politicas" className={isActive('/admin/politicas') ? 'active' : ''}>
              <i className="fas fa-shield-alt"></i> Políticas
            </Link>
          </li>
          <li>
            <Link to="/admin/preguntas" className={isActive('/admin/preguntas') ? 'active' : ''}>
              <i className="fas fa-question-circle"></i> Preguntas
            </Link>
          </li>
          <li>
            <Link to="/admin/contactos" className={isActive('/admin/contactos') ? 'active' : ''}>
              <i className="fas fa-address-book"></i> Contactos
            </Link>
          </li>
          <li>
            <Link to="/admin/productos" className={isActive('/admin/productos') ? 'active' : ''}>
              <i className="fas fa-box-open"></i> Productos
            </Link>
          </li>
          <li>
            <Link to="/admin/dispositivos" className={isActive('/admin/dispositivos') ? 'active' : ''}>
              <i className="fas fa-microchip"></i> Dispositivos IoT
            </Link>
          </li>
          <li>
            <Link to="/admin/informaciones" className={isActive('/admin/informaciones') ? 'active' : ''}>
              <i className="fas fa-info-circle"></i> Información
            </Link>
          </li>
          <li>
            <Link to="/admin/usuarios" className={isActive('/admin/usuarios') ? 'active' : ''}>
              <i className="fas fa-users-cog"></i> Gestión de Usuarios
            </Link>
          </li>
        </ul>
        <div className="nav-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido dinámico */}
      <div className="admin-content">
      <Routes>
      {/* Página de bienvenida */}
      <Route path="/" element={<DashboardWelcome />} />
      
      {/* Ruta para el perfil de administrador */}
      <Route path="perfil" element={<AdminProfile />} />
      
      {/* Rutas para Misiones */}
      <Route path="misiones" element={<ListaMisiones />} />
      <Route path="misiones/crear" element={<CrearMision />} />
      <Route path="misiones/actualizar/:id" element={<ActualizarMision />} />

      {/* Rutas para Visiones */}
      <Route path="visiones" element={<ListaVisiones />} />
      <Route path="visiones/crear" element={<CrearVision />} />
      <Route path="visiones/actualizar/:id" element={<ActualizarVision />} />

      {/* Rutas para Términos */}
      <Route path="terminos" element={<ListaTerminos />} />
      <Route path="terminos/crear" element={<CrearTermino />} />
      <Route path="terminos/actualizar/:id" element={<ActualizarTermino />} />

      {/* Rutas para Políticas */}
      <Route path="politicas" element={<ListaPoliticas />} />
      <Route path="politicas/crear" element={<CrearPolitica />} />
      <Route path="politicas/actualizar/:id" element={<ActualizarPolitica />} />

      {/* Rutas para Preguntas */}
      <Route path="preguntas" element={<ListaPreguntas />} />
      <Route path="preguntas/crear" element={<CrearPregunta />} />
      <Route path="preguntas/actualizar/:id" element={<ActualizarPregunta />} />

      {/* Rutas para Contactos - Asegúrate que este componente sea correcto */}
      <Route path="contactos" element={<ListaContactos />} />
      <Route path="contactos/crear" element={<CrearContacto />} />
      <Route path="contactos/actualizar/:id" element={<ActualizarContacto />} />

      {/* Rutas para Productos */}
      <Route path="productos" element={<ListaProductos />} />
      <Route path="productos/crear" element={<CrearProducto />} />
      <Route path="productos/actualizar/:id" element={<ActualizarProducto />} />

      {/* Rutas para Dispositivos IoT - Asegúrate que sea una ruta distinta */}
      <Route path="dispositivos/*" element={<DispositivosAdmin />} />

      {/* Rutas para Información */}
      <Route path="informaciones" element={<ListaInformacion />} />
      <Route path="informaciones/crear" element={<CrearInformacion />} />
      <Route path="informaciones/actualizar/:id" element={<ActualizarInformacion />} />

      {/* Rutas para Gestión de Usuarios */}
      <Route path="usuarios" element={<UsuariosAdmin />} />
      <Route path="usuarios/listar" element={<ListaUsuarios />} />
      <Route path="usuarios/actualizar/:id" element={<ActualizarUsuario />} />
    </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
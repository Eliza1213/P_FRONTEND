import "../style/Admin.css";
import React from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
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
import ListaUsuarios from "../components/ListaUsuarios";
import ActualizarUsuario from "../components/ActualizarUsuario";
import Swal from "sweetalert2";

const AdminDashboard = () => {

  const navigate = useNavigate();

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
        <div className="admin-header">
          <h1>Panel de Administración</h1>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/admin/misiones">
              <i className="fas fa-bullseye"></i> Misiones
            </Link>
          </li>
          <li>
            <Link to="/admin/visiones">
              <i className="fas fa-eye"></i> Visiones
            </Link>
          </li>
          <li>
            <Link to="/admin/terminos">
              <i className="fas fa-file-contract"></i> Términos
            </Link>
          </li>
          <li>
            <Link to="/admin/politicas">
              <i className="fas fa-shield-alt"></i> Políticas
            </Link>
          </li>
          <li>
            <Link to="/admin/preguntas">
              <i className="fas fa-question-circle"></i> Preguntas
            </Link>
          </li>
          <li>
            <Link to="/admin/contactos">
              <i className="fas fa-address-book"></i> Contactos
            </Link>
          </li>
          <li>
            <Link to="/admin/productos">
              <i className="fas fa-box-open"></i> Productos
            </Link>
          </li>
          <li>
            <Link to="/admin/informaciones">
              <i className="fas fa-info-circle"></i> Información
            </Link>
          </li>
          {/* 📌 NUEVO: Botón para Actualizar Roles */}
          <li>
            <Link to="/admin/usuarios">
              <i className="fas fa-users-cog"></i> Actualizar Roles
            </Link>
          </li>
        </ul>
      </nav>

      {/* Contenido dinámico */}
      <div className="admin-content">
        <Routes>
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

          {/* Rutas para Contactos */}
          <Route path="contactos" element={<ListaContactos />} />
          <Route path="contactos/crear" element={<CrearContacto />} />
          <Route path="contactos/actualizar/:id" element={<ActualizarContacto />} />

          {/* Rutas para Productos */}
          <Route path="productos" element={<ListaProductos />} />
          <Route path="productos/crear" element={<CrearProducto />} />
          <Route path="productos/actualizar/:id" element={<ActualizarProducto />} />

          {/* Rutas para Información */}
          <Route path="informaciones" element={<ListaInformacion />} />
          <Route path="informaciones/crear" element={<CrearInformacion />} />
          <Route path="informaciones/actualizar/:id" element={<ActualizarInformacion />} />

          {/* 📌 NUEVA RUTA: Página de Usuarios/Roles */}
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="usuarios/listar" element={<ListaUsuarios />} />
          <Route path="usuarios/actualizar/:id" element={<ActualizarUsuario />} />
          
      
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
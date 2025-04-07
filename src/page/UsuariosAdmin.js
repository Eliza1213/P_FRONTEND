// page/UsuariosAdmin.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/UsuariosAdmin.css"; // Asegúrate de que este archivo existe

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [rolFiltro, setRolFiltro] = useState("todos");
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 10;

  // Obtener usuarios del servidor
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("Obteniendo usuarios con token:", token ? "Presente" : "No disponible");
        
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/usuarios/admin/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener usuarios: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Se obtuvieron ${data.length} usuarios`);
        setUsuarios(data);
        setLoading(false);
      } catch (error) {
        console.error("Error detallado:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `No se pudieron cargar los usuarios: ${error.message}`,
        });
        setLoading(false);
      }
    };

    obtenerUsuarios();
  }, []);

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideTexto =
      usuario.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.username?.toLowerCase().includes(filtro.toLowerCase());

    const coincideRol =
      rolFiltro === "todos" || usuario.rol === rolFiltro;

    return coincideTexto && coincideRol;
  });

  // Cálculos para paginación
  const indexUltimoUsuario = paginaActual * usuariosPorPagina;
  const indexPrimerUsuario = indexUltimoUsuario - usuariosPorPagina;
  const usuariosActuales = usuariosFiltrados.slice(indexPrimerUsuario, indexUltimoUsuario);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  // Cambiar página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  // Cambiar el rol del usuario
  const handleCambiarRol = async (id, rolActual) => {
    try {
      const { value: nuevoRol } = await Swal.fire({
        title: "Cambiar rol de usuario",
        input: "select",
        inputOptions: {
          usuario: "Usuario",
          admin: "Administrador",
        },
        inputValue: rolActual,
        showCancelButton: true,
        confirmButtonText: "Cambiar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value === rolActual) {
              resolve("Debes seleccionar un rol diferente");
            } else {
              resolve();
            }
          });
        },
      });

      if (nuevoRol) {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://mi-proyecto-virid.vercel.app/api/usuarios/admin/usuarios/${id}/rol`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rol: nuevoRol }),
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Rol actualizado",
            text: `El rol ha sido cambiado a ${nuevoRol === "admin" ? "Administrador" : "Usuario"}`,
          });

          // Actualizar el usuario en el estado
          setUsuarios(
            usuarios.map((user) =>
              user._id === id ? { ...user, rol: nuevoRol } : user
            )
          );
        } else {
          throw new Error("Error al actualizar el rol");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el rol del usuario",
      });
    }
  };

  // Generar iniciales para el avatar
  const obtenerIniciales = (nombre, apellido) => {
    const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : '?';
    const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : '';
    return inicial1 + inicial2;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="usuarios-header">
        <h2>Gestión de Usuarios</h2>
        <p>Administra los usuarios y sus roles en el sistema</p>
      </div>

      <div className="filtros-usuarios">
        <div className="filtro-busqueda">
          <input
            type="text"
            placeholder="Buscar por nombre, email o username"
            value={filtro}
            onChange={(e) => {setFiltro(e.target.value); setPaginaActual(1);}}
            className="filtro-input"
          />
        </div>

        <div className="filtro-rol">
          <label>Filtrar por rol:</label>
          <select
            value={rolFiltro}
            onChange={(e) => {setRolFiltro(e.target.value); setPaginaActual(1);}}
            className="rol-select"
          >
            <option value="todos">Todos</option>
            <option value="usuario">Usuarios</option>
            <option value="admin">Administradores</option>
          </select>
        </div>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <div className="no-usuarios">
          <p>No se encontraron usuarios con los criterios de búsqueda.</p>
        </div>
      ) : (
        <>
          <div className="tabla-usuarios-container">
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Contacto</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosActuales.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>
                      <div className="usuario-info">
                        <div className="usuario-avatar">
                          {obtenerIniciales(usuario.nombre, usuario.ap)}
                        </div>
                        <div className="usuario-detalles">
                          <div className="usuario-nombre">{usuario.nombre} {usuario.ap} {usuario.am}</div>
                          <div className="usuario-username">@{usuario.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="usuario-contacto">
                        <div className="email">{usuario.email}</div>
                        <div className="telefono">{usuario.telefono || "No disponible"}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`rol-badge ${usuario.rol}`}>
                        {usuario.rol === "admin" ? "Administrador" : "Usuario"}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-container">
                        <button
                          className="btn-accion btn-cambiar-rol"
                          onClick={() => handleCambiarRol(usuario._id, usuario.rol)}
                        >
                          Cambiar Rol
                        </button>
                        <Link to={`/admin/usuarios/actualizar/${usuario._id}`} className="btn-accion btn-editar">
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="paginacion">
              <button
                className="pagina-btn"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                &laquo; Anterior
              </button>
              
              {[...Array(totalPaginas).keys()].map(numero => (
                <button
                  key={numero + 1}
                  className={`pagina-btn ${paginaActual === numero + 1 ? 'activo' : ''}`}
                  onClick={() => cambiarPagina(numero + 1)}
                >
                  {numero + 1}
                </button>
              ))}
              
              <button
                className="pagina-btn"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsuariosAdmin;
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import ListaUsuarios from "../components/ListaUsuarios";
import ActualizarUsuario from "../components/ActualizarUsuario";

const UsuariosAdmin = () => {
  return (
    <div className="usuarios-container">
      <h1>Administración de Usuarios</h1>

      <div className="usuarios-buttons">
        <Link to="/admin/usuarios/listar" className="btn">📋 Ver Usuarios</Link>
      </div>

      <Routes>
        <Route path="listar" element={<ListaUsuarios />} />
        <Route path="actualizar/:id" element={<ActualizarUsuario />} />
      </Routes>
    </div>
  );
};

export default UsuariosAdmin;
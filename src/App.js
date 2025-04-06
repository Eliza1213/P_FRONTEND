import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import FormLogin from "./components/FormLogin";
import FormRegistro from "./components/FormRegistro";
import FormRecuperacion from "./components/FormRecuperacion";
import SolicitarRestablecimiento  from "./components/SolicitarRestablecimiento";
import RestablecerContrasena from "./components/RestablecerContrasena";
import Home from "./components/Home";
import UserDashboard from "./page/UserDashboard";
import AdminDashboard from "./page/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import HeaderPublic from "./components/HeaderPublic";
import HeaderAdmin from "./components/HeaderAdmin";
import HeaderUser from "./components/HeaderUser"; // Importamos el header del usuario
import Perfil from "./components/Perfil";
import TerrarioControl from "./components/TerrarioControl";
//lo de oscar
import Perfil2 from "./components/userProfile";
import UserProfile from "./components/userProfile";


import MisionesVisualizar from "./components/MisionesVisualizar";
import MisionesPublicas from "./components/MisionesPublica";

import InformacionPublicas from "./components/InformacionPublica";
import ProductosList from "./components/ProductosList"; // Importamos el nuevo componente
import ProductosVisualizar from "./components/ProductosVisualizar";
import VisionesVisualizar from "./components/VisionesVisualizar";
import VisionesPublicas from "./components/VisionesPublica";
import ContactoVisualizar from "./components/ContactoVisualizar";
import ContactosPublicas from "./components/ContactoPublica";
import PoliticasVisualizar from "./components/PoliticasVisualizar";
import PoliticasPublicas from "./components/PoliticasPublica";
import PreguntasVisualizar from "./components/PreguntasVisualizar";
import PreguntasPublicas from "./components/PreguntasPublicas";
import TerminosVisualizar from "./components/TerminosVisualizar";
import TerminosPublicas from "./components/TerminosPublica";
import ActivarDispositivo from "./components/FormActivarIOT";
import DispositivoDetalle from "./components/DispositivoDetalle";
import MisDispositivos from "./components/MisDispositivos";
import ProductosPublicas from "./components/ProductosPublica";
import ProductoUsuarios from "./components/ProductosUsuario";


import UsuarioInformacion from './page/UsuarioInformacion';
import TerrarioControlScreen from "./components/TerrarioControl";

import SelectRecoveryMethod from "./components/SelectRecoveryMethod";


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUserRoute = location.pathname.startsWith("/usuario");
  // Determinar si el usuario está autenticado
  const isUserAuthenticated = !!localStorage.getItem("token");

  return (
    <div>
      {/* Mostrar header según la ruta */}
      {isAdminRoute ? <HeaderAdmin /> : isUserRoute ? <HeaderUser /> : <HeaderPublic />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<FormLogin />} />
        <Route path="/registro" element={<FormRegistro />} />
        <Route path="/recuperacion" element={<FormRecuperacion />} />
        
        <Route path="/solicitar-restablecimiento" element={<SolicitarRestablecimiento />} />
        <Route path="/restablecer-contrasena/:token" element={<RestablecerContrasena />} />
        <Route path="/seleccionar-recuperacion" element={<SelectRecoveryMethod />} />
        <Route path="/mision" element={<MisionesPublicas />} />
        <Route path="/InformacionVisualizar" element={<InformacionPublicas />} />
        {/* Cambiamos ProductosVisualizar por ProductosList para la ruta pública */}
        <Route path="/productos" element={<ProductosPublicas isUserAuthenticated={isUserAuthenticated} />} />
        <Route path="/vision" element={<VisionesPublicas />} />
        <Route path="/contacto" element={<ContactosPublicas />} />
        <Route path="/politicas" element={<PoliticasPublicas />} />
        <Route path="/preguntas" element={<PreguntasPublicas />} />
        <Route path="/terminos" element={<TerminosPublicas />} />
        

        <Route element={<PrivateRoute />}>
          <Route path="/usuario" element={<UserDashboard />}>
            {/* Rutas anidadas - se concatenan al path padre /usuario */}
            <Route path="configuraciones" element={<TerrarioControl />} />
            <Route path="perfil" element={<Perfil />} />
            
            <Route path="perfil2" element={<Perfil2 />} />
            <Route path="userProfile" element={<UserProfile />} />
            <Route path="informacion-tortuga" element={<UsuarioInformacion />} />
            {/* También usamos ProductosList para usuarios autenticados, pasándole isUserAuthenticated=true */}
            <Route path="productos" element={<ProductoUsuarios isUserAuthenticated={true} />} /> 
            <Route path="contacto" element={<ContactoVisualizar />} />
            <Route path="mision" element={<MisionesVisualizar />} />
            <Route path="vision" element={<VisionesVisualizar />} />
            <Route path="politicas" element={<PoliticasVisualizar />} />
            <Route path="terminos" element={<TerminosVisualizar />} />
            <Route path="iot" element={<MisDispositivos />} />
            <Route path="activar-iot" element={<ActivarDispositivo />} />
            <Route path="dispositivo/:id" element={<DispositivoDetalle />} />
            <Route path="terrario-control" element={<TerrarioControlScreen/>} />
            
          </Route>
        </Route>

        <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </div>
  );
}

export default App;
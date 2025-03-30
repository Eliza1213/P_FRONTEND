// src/components/AdminRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // Verificar autenticación y rol
  const isAuthenticated = !!token;
  const isAdmin = rol === "admin";

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      // Opcional: Limpiar credenciales si no son válidas
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      localStorage.removeItem("nombre");

      // Mostrar mensaje de error
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'Debes iniciar sesión como administrador para acceder a esta página',
        timer: 3000
      });
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    // Redirigir al home guardando la ubicación intentada
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
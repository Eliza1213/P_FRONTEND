import { Navigate, Outlet } from "react-router-dom";

// Posible código en PrivateRoute.js
const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  
  // Si no hay token, redirige a login
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  // Si hay token, permite acceso a la ruta
  return <Outlet />;
};

export default PrivateRoute;
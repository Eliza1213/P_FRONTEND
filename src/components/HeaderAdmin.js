import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Swal from "sweetalert2";
import "../style/HeaderAdmin.css";

const HeaderAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const nombreUsuario = localStorage.getItem("nombre") || "Administrador";

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Estás seguro que deseas salir del panel de administración?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#32CD32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("nombre");
        navigate("/login");
        Swal.fire(
          'Sesión cerrada',
          'Has cerrado sesión correctamente.',
          'success'
        );
      }
    });
  };

  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className="header-admin">
      <div className="logo-title">
        <img src="../images/logo.png" alt="Logo" className="logo" />
        <Link to="/admin"><h1 className="title">PANEL ADMINISTRACIÓN</h1></Link>
      </div>

      {/* Menú principal en pantallas grandes */}
      <nav className="nav-admin">
        <div className="user-info">
          <span className="welcome-message">Bienvenido, <span className="user-name">{nombreUsuario}</span></span>
        </div>
        
        <button onClick={handleLogout} className="logout-btn">
          Cerrar sesión
        </button>
      </nav>

      {/* Menú Hamburguesa solo en móviles */}
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menú responsive en móviles */}
      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="user-info-mobile">
          <span className="welcome-message">Bienvenido, <span className="user-name">{nombreUsuario}</span></span>
        </div>
        
        <button onClick={handleLogout} className="logout-btn-mobile">
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
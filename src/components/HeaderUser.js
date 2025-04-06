import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Swal from "sweetalert2";
import "../style/HeaderUser.css";
import logoImage from '../images/logo.png';

const HeaderUser = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const nombreUsuario = localStorage.getItem("nombre") || "Usuario";

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Estás seguro que deseas salir?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#32CD32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
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

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className="header-user">
      <div className="logo-title">
        <img src={logoImage} alt="Logo" className="logo" style={{ width: '80px', height: 'auto' }} />
        <Link to="/usuario"><h1 className="title">TORTUTERRA</h1></Link>
      </div>

      <nav className="nav-user">
        <div className="user-info">
          <span className="welcome-message">Bienvenido <span className="user-name">{nombreUsuario}</span></span>
        </div>
        <Link to="/usuario/informacion-tortuga" className="info-btn">Información de Tortuga</Link>
        <Link to="/usuario/productos" className="info-btn">Productos</Link>
        <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
      </nav>

      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="user-info-mobile">
          <span className="welcome-message">Bienvenido, <span className="user-name">{nombreUsuario}</span></span>
        </div>
        <Link to="/usuario/informacion-tortuga" className="info-btn-mobile">Información de Tortuga</Link>
        <Link to="/usuario/productos" className="info-btn-mobile">Productos</Link>
        <button onClick={handleLogout} className="logout-btn-mobile">Cerrar sesión</button>
      </nav>
    </header>
  );
};

export default HeaderUser;
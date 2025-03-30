import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import "../style/Header.css";

const HeaderPublic = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const toggleSubmenu = (menu) => {
    setSubmenuOpen(submenuOpen === menu ? null : menu);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSubmenuOpen(null);
    }
  };

  // Cerrar los dropdowns al cambiar de página
  useEffect(() => {
    setSubmenuOpen(null);
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo-title">
        <img src="/logo.png" alt="Logo" className="logo" />
        <Link to="/"><h1 className="title">TORTUTERRA</h1></Link>
      </div>

      {/* Menú principal en pantallas grandes */}
      <nav className="nav" ref={dropdownRef}>

        <div className="dropdown">
          <button className="nav-link" onClick={() => toggleSubmenu("sesion")}>
            INICIAR SESIÓN
          </button>
          <ul className={`dropdown-menu ${submenuOpen === "sesion" ? "open" : ""}`}>
            <li><Link to="/registro" className="dropdown-item">Formulario de registro</Link></li>
            <li><Link to="/login" className="dropdown-item">Login</Link></li>
            <li><Link to="/recuperacion" className="dropdown-item">Recuperacion de contraseña por pregunta</Link></li>
            <li><Link to="/solicitar-restablecimiento" className="dropdown-item">Recuperacion de contraseña por correo</Link></li>
          </ul>
        </div>

        <Link to="/InformacionVisualizar" className="nav-link">Informacion de Tortugas</Link>
      </nav>

      {/* Menú Hamburguesa solo en móviles */}
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menú responsive en móviles */}
      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link">Inicio</Link>

        <div className="dropdown">
          <button className="nav-link" onClick={() => toggleSubmenu("sesion")}>
            Sesión
          </button>
          <ul className={`dropdown-menu ${submenuOpen === "sesion" ? "open" : ""}`}>
            <li><Link to="/registro" className="dropdown-item">Formulario de registro</Link></li>
            <li><Link to="/login" className="dropdown-item">Login</Link></li>
            <li><Link to="/recuperacion" className="dropdown-item">Recuperación de contraseña</Link></li>
            <li><Link to="/solicitar-restablecimiento" className="dropdown-item">Recuperación de contraseña por correo</Link></li>
          </ul>
        </div>

        <div className="dropdown">
          <button className="nav-link" onClick={() => toggleSubmenu("info")}>
            Información de tortugas
          </button>
          <ul className={`dropdown-menu ${submenuOpen === "info" ? "open" : ""}`}>
            <li><Link to="/tortugas-adecuadas" className="dropdown-item">Tortugas adecuadas</Link></li>
            <li><Link to="/cuidados-basicos" className="dropdown-item">Cuidados básicos</Link></li>
            <li><Link to="/consejos" className="dropdown-item">Consejos para el hábitat</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default HeaderPublic;
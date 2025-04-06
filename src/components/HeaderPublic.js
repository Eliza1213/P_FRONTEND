import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logoImage from '../images/logo.png';
import "../style/Header.css";

const HeaderPublic = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const toggleSubmenu = (menu) => {
    setSubmenuOpen(submenuOpen === menu ? null : menu);
  };

  const handleClickOutside = (event) => {
    // Verificar clicks fuera de los dropdowns para ambos, escritorio y móvil
    if (
      (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
      (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target))
    ) {
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

  // Componente de Dropdown reutilizable
  const Dropdown = ({ title, items, isOpen, onToggle, isMobile = false }) => (
    <div className={`dropdown ${isMobile ? 'mobile-dropdown' : ''}`}>
      <button 
        className={`nav-link ${isOpen ? 'active' : ''}`} 
        onClick={onToggle}
      >
        {title}
        <ChevronDown 
          size={18} 
          className={`dropdown-icon ${isOpen ? 'rotate' : ''}`} 
        />
      </button>
      <ul className={`dropdown-menu ${isOpen ? "open" : ""}`}>
        {items.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className="dropdown-item">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const sesionItems = [
    { label: "Registro", path: "/registro" },
    { label: "Inicio De Sesión", path: "/login" },
    { label: "Recuperación de contraseña", path: "/seleccionar-recuperacion" }
  ];

  const infoItems = [
    { label: "Tortugas adecuadas", path: "/tortugas-adecuadas" },
    { label: "Cuidados básicos", path: "/cuidados-basicos" },
    { label: "Consejos para el hábitat", path: "/consejos" }
  ];

  return (
    <header className="header">
      <div className="logo-title">
        <img 
          src={logoImage} 
          alt="Logo" 
          className="logo" 
          loading="lazy" 
          style={{ width: '80px', height: 'auto' }}
        />
        <Link to="/">
          <h1 className="title">TORTUTERRA</h1>
        </Link>
      </div>

      {/* Menú principal en pantallas grandes - POSICIONES INTERCAMBIADAS */}
      <nav className="nav" ref={dropdownRef}>
        {/* Primero el botón de Productos */}
        <Link to="/productos" className="nav-link">
          Productos
        </Link>

        {/* Después el dropdown de Iniciar Sesión */}
        <Dropdown 
          title="Iniciar Sesión" 
          items={sesionItems} 
          isOpen={submenuOpen === "sesion"}
          onToggle={() => toggleSubmenu("sesion")}
        />

        <Link to="/InformacionVisualizar" className="nav-link">
          Información de Tortugas
        </Link>
      </nav>

      {/* Botón del menú hamburguesa */}
      <button 
        className="menu-btn" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menú responsive en móviles - TAMBIÉN ACTUALIZADO */}
      <nav 
        className={`mobile-menu ${menuOpen ? "open" : ""}`} 
        ref={mobileDropdownRef}
      >
        <Link to="/" className="nav-link">Inicio</Link>
        
        {/* Primero el enlace a Productos */}
        <Link to="/productos" className="nav-link">
          Productos
        </Link>

        {/* Después el dropdown de Sesión */}
        <Dropdown 
          title="Sesión" 
          items={sesionItems} 
          isOpen={submenuOpen === "sesion"}
          onToggle={() => toggleSubmenu("sesion")}
          isMobile={true}
        />

        <Dropdown 
          title="Información de tortugas" 
          items={infoItems} 
          isOpen={submenuOpen === "info"}
          onToggle={() => toggleSubmenu("info")}
          isMobile={true}
        />
      </nav>
    </header>
  );
};

export default HeaderPublic;
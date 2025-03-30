import { Link } from "react-router-dom";
import "../style/SidebarUser.css";

const SidebarUser = () => {
  return (
    <div className="sidebar-user">
      <ul>
        <li><Link to="/usuario/perfil2">👤 Perfil</Link></li>
        <li><Link to="/usuario/iot">🌐 IoT</Link></li>
        <li><Link to="/usuario/activar-iot">🔌 Activar IoT</Link></li>
      </ul>
    </div>
  );
};

export default SidebarUser;
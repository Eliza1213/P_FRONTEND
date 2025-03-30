import { Outlet } from "react-router-dom";
import SidebarUser from "../components/SidebarUser";
import FooterUser from "../components/FooterUser";
import "../style/UserDashboard.css";

const UserLayout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <div 
        className="sidebar-control"
        onMouseEnter={() => setSidebarVisible(true)}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        <div className="hamburger-btn">☰</div>
        {sidebarVisible && (
          <div className="sidebar-wrapper">
            <div className="sidebar-content">
              <SidebarUser />
            </div>
          </div>
        )}
      </div>

      {/* Contenido dinámico */}
      <div className={`dashboard-content ${sidebarVisible ? "shifted" : ""}`}>
        <Outlet /> {/* Aquí entrarán ContactoVisualizar, MisionesVisualizar, etc. */}
      </div>

      {/* Footer persistente */}
      <FooterUser />
    </div>
  );
};

export default UserLayout;
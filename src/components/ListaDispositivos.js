import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ListaDispositivos = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [productos, setProductos] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDispositivos = async () => {
      try {
        setLoading(true);
        // Obtener el token de autenticación
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No hay token de autenticación");
        }
        
        // Primero, vamos a cargar todos los usuarios para tener el mapeo completo
        console.log("Cargando usuarios...");
        const responseUsuarios = await fetch("http://localhost:4000/api/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!responseUsuarios.ok) {
          console.error("Error al cargar usuarios:", responseUsuarios.status);
        } else {
          const datosUsuarios = await responseUsuarios.json();
          console.log("Usuarios cargados:", datosUsuarios.length);
          
          // Crear un mapeo de IDs a nombres de usuario
          const usuariosMap = {};
          datosUsuarios.forEach(usuario => {
            usuariosMap[usuario._id] = usuario.nombre || "Nombre no disponible";
            console.log(`Mapeando usuario: ${usuario._id} -> ${usuario.nombre}`);
          });
          setUsuarios(usuariosMap);
        }
        
        // Ahora cargamos los productos
        console.log("Cargando productos...");
        const responseProductos = await fetch("http://localhost:4000/api/productos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!responseProductos.ok) {
          console.error("Error al cargar productos:", responseProductos.status);
        } else {
          const datosProductos = await responseProductos.json();
          console.log("Productos cargados:", datosProductos.length);
          
          // Crear un mapeo de IDs a nombres de productos
          const productosMap = {};
          datosProductos.forEach(producto => {
            productosMap[producto._id] = producto.nombre || "Producto no disponible";
          });
          setProductos(productosMap);
        }
        
        // Finalmente, cargamos los dispositivos
        console.log("Cargando dispositivos...");
        const responseDispositivos = await fetch("http://localhost:4000/api/dispositivos/admin/listar", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!responseDispositivos.ok) {
          const errorData = await responseDispositivos.json().catch(() => ({}));
          throw new Error(`Error al obtener dispositivos: ${responseDispositivos.statusText} ${errorData.error ? '- ' + errorData.error : ''}`);
        }
        
        const datosDispositivos = await responseDispositivos.json();
        console.log("Dispositivos cargados:", datosDispositivos.length);
        
        // Imprimir los IDs de usuario para depuración
        datosDispositivos.forEach(dispositivo => {
          console.log(`Dispositivo: ${dispositivo._id}, Usuario ID: ${dispositivo.usuario}, ¿Existe en el mapa?: ${usuarios[dispositivo.usuario] ? 'Sí' : 'No'}`);
        });
        
        setDispositivos(datosDispositivos);
        setLoading(false);
      } catch (error) {
        console.error("Error completo:", error);
        setError(error.message);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar todos los datos",
          icon: "error",
          confirmButtonColor: "#003366",
        });
        setLoading(false);
      }
    };

    fetchDispositivos();
  }, []);

  // Formatear fecha para mostrar
  const formatFecha = (fechaString) => {
    if (!fechaString) return "No activado";
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Error al formatear fecha:", e);
      return "Fecha inválida";
    }
  };

  // Obtener nombre de usuario de forma segura
  const getNombreUsuario = (usuarioId) => {
    if (!usuarioId) return "ID de usuario no disponible";
    const nombre = usuarios[usuarioId];
    if (nombre) return nombre;
    
    // Si no tenemos el nombre, mostrar el ID como fallback
    return `Usuario (ID: ${usuarioId.substring(0, 8)}...)`;
  };

  // Filtrar dispositivos
  const dispositivosFiltrados = dispositivos.filter(dispositivo => {
    if (!filtro) return true;

    const usuarioNombre = (getNombreUsuario(dispositivo.usuario) || '').toLowerCase();
    const productoNombre = (productos[dispositivo.producto] || '').toLowerCase();
    const mac = (dispositivo.identificadorIoT || '').toLowerCase();
    const filtroLower = filtro.toLowerCase();

    return usuarioNombre.includes(filtroLower) || 
           productoNombre.includes(filtroLower) || 
           mac.includes(filtroLower);
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando dispositivos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preguntas-container">
        <div className="preguntas-header">
          <h2 className="preguntas-titulo">Dispositivos IoT</h2>
        </div>
        <div className="error-container" style={{ padding: '20px', color: '#721c24', backgroundColor: '#f8d7da', borderRadius: '4px', margin: '20px 0' }}>
          <p><strong>Error:</strong> {error}</p>
          <p>Por favor, verifica que la ruta del API esté correctamente configurada y que tengas permisos de administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preguntas-container">
      <div className="preguntas-header">
        <h2 className="preguntas-titulo">Dispositivos IoT</h2>
        <p className="preguntas-descripcion">
          Listado de dispositivos IoT registrados en el sistema
        </p>
      </div>
      
      <div className="acciones-header">
        <div className="filtro-busqueda">
          <input
            type="text"
            placeholder="Buscar por usuario, producto o MAC..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-input"
          />
        </div>
      </div>

      {dispositivosFiltrados.length === 0 ? (
        <div className="preguntas-vacio">
          {filtro ? 
            "No se encontraron dispositivos que coincidan con la búsqueda" : 
            "No hay dispositivos IoT registrados"}
        </div>
      ) : (
        <table className="preguntas-tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Producto</th>
              <th>Identificador IoT (MAC)</th>
              <th>Fecha de Activación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {dispositivosFiltrados.map((dispositivo) => (
              <tr key={dispositivo._id} className="pregunta-fila">
                <td>{getNombreUsuario(dispositivo.usuario)}</td>
                <td>{productos[dispositivo.producto] || 'Producto desconocido'}</td>
                <td>{dispositivo.identificadorIoT || 'No disponible'}</td>
                <td>{formatFecha(dispositivo.fechaActivacion)}</td>
                <td>
                  <span className={`estado-badge ${dispositivo.activo ? "activo" : "inactivo"}`}>
                    {dispositivo.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaDispositivos;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Actualizar.css";

const ObtenerUsuario = () => {
  //const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/usuarios/perfil", {
          headers: {
            "Authorization": token,
            "Content-Type": "application/json"
          }
        });
  
        const data = await response.json();
        console.log("Datos recibidos:", data); // Añade este log para depurar
  
        if (!response.ok) {
          throw new Error(data.error || "Error al obtener el usuario");
        }
  
        setUsuario(data); // Ahora data debería ser el objeto usuario directamente
        Swal.fire({
          icon: "success",
          title: "Usuario obtenido",
          text: "La información del usuario se cargó correctamente",
          timer: 2000,
          showConfirmButton: false
        });
  
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "No se pudo obtener la información del usuario",
          confirmButtonText: "Entendido"
        });
        // navigate("/usuarios"); // Comenta o elimina esta línea para no redirigir en caso de error
      } finally {
        setCargando(false);
      }
    };
  
    obtenerPerfil();
  }, []);

  if (cargando) {
    return <div className="loading">Cargando información del usuario...</div>;
  }

  if (!usuario) {
    return <div className="error">No se pudo cargar la información del usuario</div>;
  }

  return (
    <div className="contactos-container">
      <h2>Información del Usuario</h2>
      
      <div className="usuario-info">
        <p><strong>ID:</strong> {usuario.id}</p>
        <p><strong>Nombre:</strong> {usuario.nombre}</p>
        <p><strong>Apellidos:</strong> {usuario.ap} {usuario.am}</p>
        <p><strong>Username:</strong> {usuario.username}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Teléfono:</strong> {usuario.telefono || "No especificado"}</p>
        <p><strong>Rol:</strong> {usuario.rol}</p>
      </div>

      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
      >
        Volver
      </button>
    </div>
  );
};

export default ObtenerUsuario;
// EditProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    nombre: "",
    ap: "",
    am: "",
    email: "",
    telefono: "",
    username: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("https://mi-proyecto-virid.vercel.app/api/usuarios/perfil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el perfil del usuario");
        }

        const data = await response.json();
        setUserData(data.usuario);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://mi-proyecto-virid.vercel.app/api/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil del usuario");
      }

      navigate("/perfil");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Editar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={userData.nombre} onChange={handleChange} />
        </div>
        <div>
          <label>Apellido Paterno:</label>
          <input type="text" name="ap" value={userData.ap} onChange={handleChange} />
        </div>
        <div>
          <label>Apellido Materno:</label>
          <input type="text" name="am" value={userData.am} onChange={handleChange} />
        </div>
        <div>
          <label>Correo Electrónico:</label>
          <input type="email" name="email" value={userData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={userData.telefono} onChange={handleChange} />
        </div>
        <div>
          <label>Nombre de Usuario:</label>
          <input type="text" name="username" value={userData.username} onChange={handleChange} />
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditProfile;

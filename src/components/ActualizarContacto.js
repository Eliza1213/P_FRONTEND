import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/Lista.css";

const ActualizarContacto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState({ lat: "", lng: "", direccion: "" });
  const [redesSociales, setRedesSociales] = useState([{ nombre: "", enlace: "" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContacto = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/contactos/${id}`);
        if (!response.ok) throw new Error("Error al obtener el contacto");
        
        const data = await response.json();
        setEmail(data.email);
        setTelefono(data.telefono);
        setUbicacion({
          lat: data.ubicacion?.lat.toString() || "",
          lng: data.ubicacion?.lng.toString() || "",
          direccion: data.ubicacion?.direccion || ""
        });
        setRedesSociales(data.redes_sociales && data.redes_sociales.length > 0 
          ? data.redes_sociales 
          : [{ nombre: "", enlace: "" }]);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar la información del contacto",
          icon: "error",
          confirmButtonColor: "#003366",
        }).then(() => {
          navigate("/admin/contactos");
        });
      }
    };

    fetchContacto();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!email.trim() || !telefono.trim()) {
      Swal.fire({
        title: "Error",
        text: "Email y teléfono son obligatorios",
        icon: "error",
        confirmButtonColor: "#003366",
      });
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        title: "Error",
        text: "Por favor, introduce un email válido",
        icon: "error",
        confirmButtonColor: "#003366",
      });
      return;
    }

    // Validación de ubicación
    if (!ubicacion.lat || !ubicacion.lng || !ubicacion.direccion) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa todos los campos de ubicación",
        icon: "error",
        confirmButtonColor: "#003366",
      });
      return;
    }

    // Validación de redes sociales
    const redesValidas = redesSociales.every((red) => red.nombre && red.enlace);
    if (!redesValidas) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa todos los campos de redes sociales",
        icon: "error",
        confirmButtonColor: "#003366",
      });
      return;
    }

    try {
      setSaving(true);
      
      const contactoActualizado = {
        email,
        telefono,
        ubicacion: {
          lat: parseFloat(ubicacion.lat),
          lng: parseFloat(ubicacion.lng),
          direccion: ubicacion.direccion,
        },
        redes_sociales: redesSociales,
      };

      const response = await fetch(`http://localhost:4000/api/contactos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(contactoActualizado),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el contacto");
      }

      Swal.fire({
        title: "¡Éxito!",
        text: "El contacto se ha actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#003366",
      }).then(() => {
        navigate("/admin/contactos");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar el contacto",
        icon: "error",
        confirmButtonColor: "#003366",
      });
    } finally {
      setSaving(false);
    }
  };

  // Agregar una nueva red social
  const agregarRedSocial = () => {
    setRedesSociales([...redesSociales, { nombre: "", enlace: "" }]);
  };

  // Eliminar una red social
  const eliminarRedSocial = (index) => {
    const nuevasRedes = redesSociales.filter((_, i) => i !== index);
    setRedesSociales(nuevasRedes);
  };

  // Actualizar una red social
  const actualizarRedSocial = (index, campo, valor) => {
    const nuevasRedes = [...redesSociales];
    nuevasRedes[index][campo] = valor;
    setRedesSociales(nuevasRedes);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando información del contacto...</p>
      </div>
    );
  }

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h2 className="formulario-titulo">Actualizar Contacto</h2>
        <p className="formulario-descripcion">
          Modifica la información del contacto existente
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="formulario-campo">
          <label htmlFor="email" className="formulario-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="formulario-input"
            placeholder="Escribe el correo electrónico"
            required
          />
        </div>

        <div className="formulario-campo">
          <label htmlFor="telefono" className="formulario-label">
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="formulario-input"
            placeholder="Escribe el número de teléfono"
            required
          />
        </div>

        <div className="formulario-campo">
          <label className="formulario-label">Ubicación</label>
          <div className="ubicacion-grid">
            <input
              type="text"
              placeholder="Latitud"
              value={ubicacion.lat}
              onChange={(e) => setUbicacion({ ...ubicacion, lat: e.target.value })}
              className="formulario-input"
              required
            />
            <input
              type="text"
              placeholder="Longitud"
              value={ubicacion.lng}
              onChange={(e) => setUbicacion({ ...ubicacion, lng: e.target.value })}
              className="formulario-input"
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              value={ubicacion.direccion}
              onChange={(e) => setUbicacion({ ...ubicacion, direccion: e.target.value })}
              className="formulario-input"
              required
            />
          </div>
        </div>

        <div className="formulario-campo">
          <label className="formulario-label">Redes Sociales</label>
          {redesSociales.map((red, index) => (
            <div key={index} className="redes-sociales-grupo">
              <input
                type="text"
                placeholder="Nombre de la red social"
                value={red.nombre}
                onChange={(e) => actualizarRedSocial(index, "nombre", e.target.value)}
                className="formulario-input"
                required
              />
              <input
                type="text"
                placeholder="Enlace"
                value={red.enlace}
                onChange={(e) => actualizarRedSocial(index, "enlace", e.target.value)}
                className="formulario-input"
                required
              />
              {redesSociales.length > 1 && (
                <button
                  type="button"
                  onClick={() => eliminarRedSocial(index)}
                  className="btn-accion btn-eliminar"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={agregarRedSocial}
            className="btn-accion btn-actualizar"
          >
            Agregar Red Social
          </button>
        </div>

        <div className="formulario-botones">
          <Link to="/admin/contactos" className="btn-cancelar">
            Cancelar
          </Link>
          <button type="submit" className="btn-guardar" disabled={saving}>
            {saving ? "Guardando..." : "Actualizar Contacto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActualizarContacto;
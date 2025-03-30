import React, { useState } from "react";

const CrearContacto = () => {
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState({ lat: "", lng: "", direccion: "" });
  const [redesSociales, setRedesSociales] = useState([{ nombre: "", enlace: "" }]); // Estado para redes sociales

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Datos antes de enviar:", { email, telefono, ubicacion, redesSociales }); // Depuración

    // Valida que todos los campos estén llenos
    if (!ubicacion.lat || !ubicacion.lng || !ubicacion.direccion) {
      alert("Por favor, completa todos los campos de ubicación.");
      return;
    }

    // Valida que las redes sociales tengan nombre y enlace
    const redesValidas = redesSociales.every((red) => red.nombre && red.enlace);
    if (!redesValidas) {
      alert("Por favor, completa todos los campos de redes sociales.");
      return;
    }

    const nuevoContacto = {
      email,
      telefono,
      ubicacion: {
        lat: parseFloat(ubicacion.lat),
        lng: parseFloat(ubicacion.lng),
        direccion: ubicacion.direccion,
      },
      redes_sociales: redesSociales, // Envía las redes sociales
    };

    console.log("Datos a enviar al backend:", nuevoContacto); // Depuración

    const response = await fetch("http://localhost:4000/api/contactos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoContacto),
    });

    if (response.ok) {
      alert("Contacto creado con éxito");
      // Limpia el formulario después de crear el contacto
      setEmail("");
      setTelefono("");
      setUbicacion({ lat: "", lng: "", direccion: "" });
      setRedesSociales([{ nombre: "", enlace: "" }]); // Reinicia las redes sociales
    } else {
      alert("Error al crear contacto");
    }
  };

  // Agrega una nueva red social
  const agregarRedSocial = () => {
    setRedesSociales([...redesSociales, { nombre: "", enlace: "" }]);
  };

  // Elimina una red social
  const eliminarRedSocial = (index) => {
    const nuevasRedes = redesSociales.filter((_, i) => i !== index);
    setRedesSociales(nuevasRedes);
  };

  // Actualiza una red social
  const actualizarRedSocial = (index, campo, valor) => {
    const nuevasRedes = [...redesSociales];
    nuevasRedes[index][campo] = valor;
    setRedesSociales(nuevasRedes);
  };

  return (
    <div className="contactos-container">
      <h2>Crear Contacto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Latitud"
          value={ubicacion.lat}
          onChange={(e) => setUbicacion({ ...ubicacion, lat: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Longitud"
          value={ubicacion.lng}
          onChange={(e) => setUbicacion({ ...ubicacion, lng: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Dirección"
          value={ubicacion.direccion}
          onChange={(e) => setUbicacion({ ...ubicacion, direccion: e.target.value })}
          required
        />

        {/* Campos para redes sociales */}
        <h4>Redes Sociales</h4>
        {redesSociales.map((red, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Nombre de la red social"
              value={red.nombre}
              onChange={(e) => actualizarRedSocial(index, "nombre", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enlace"
              value={red.enlace}
              onChange={(e) => actualizarRedSocial(index, "enlace", e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => eliminarRedSocial(index)}
              style={{ marginLeft: "10px" }}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" onClick={agregarRedSocial} style={{ marginBottom: "10px" }}>
          Agregar Red Social
        </button>

        <button type="submit">Crear Contacto</button>
      </form>
    </div>
  );
};

export default CrearContacto;
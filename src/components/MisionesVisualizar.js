import { useEffect, useState } from "react";
import '../style/visionesPublica.css';


const MisionesVisualizar = () => {
  const [misiones, setMisiones] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/misiones") // Llamada al backend
      .then((response) => response.json())
      .then((data) => setMisiones(data))
      .catch((error) => console.error("Error al obtener misiones:", error));
  }, []);

  return (
    <>
      <div className="misiones-container">
        <h2 className="misiones-title">Nuestra Misión</h2>
        {misiones.length === 0 ? (
          <p className="no-misiones">No hay misiones disponibles</p>
        ) : (
          <div className="misiones-grid">
            {misiones.map((mision) => (
              <div key={mision._id} className="mision-card">
                <h3 className="mision-titulo">{mision.titulo}</h3>
                <p className="mision-descripcion">{mision.descripcion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MisionesVisualizar;
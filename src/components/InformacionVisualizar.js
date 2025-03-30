import { useEffect, useState } from "react";
import '../style/informacionTortuga.css';

const InformacionVisualizar = () => {
    const [informaciones, setInformaciones] = useState([]);

    useEffect(() => {
      fetch("http://localhost:4000/api/informaciones")
        .then((response) => response.json())
        .then((data) => setInformaciones(data))
        .catch((error) => console.error("Error al obtener la información:", error));
    }, []);

    return (
      <div className="info-container">
        <h2 className="info-title">Información sobre Tortugas</h2>
        {informaciones.length === 0 ? (
          <p className="info-empty">No hay información disponible</p>
        ) : (
          <div className="info-grid">
            {informaciones.map((info) => (
              <div key={info._id} className="info-card">
                {info.imagen && (
                  <div className="info-image">
                    <img src={info.imagen} alt={`Imagen de ${info.especie}`} />
                  </div>
                )}
                <div className="info-content">
                  <h3 className="info-species">{info.especie}</h3>
                  <p><strong>Alimentación:</strong> {info.alimentacion}</p>
                  <p><strong>Temperatura Ideal:</strong> {info.temperatura_ideal}</p>
                  <p><strong>Humedad Ideal:</strong> {info.humedad_ideal}</p>
                  <p><strong>Descripción:</strong> {info.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
};

export default InformacionVisualizar;

import { useEffect, useState } from "react";
import '../style/visionesPublica.css';


const PoliticasVisualizar = () => {
  const [politicas, setPoliticas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/politicas") // Llamada al backend
      .then((response) => response.json())
      .then((data) => setPoliticas(data))
      .catch((error) => console.error("Error al obtener politicas:", error));
  }, []);

  return (
    <>
      <div className="visiones-container">
        <h2 className="visiones-title">Políticas de Privacidad</h2>
        {politicas.length === 0 ? (
          <p>No hay Políticas disponibles</p>
        ) : (
          <ul className="visiones-list">
            {politicas.map((politica) => (
              <li key={politica._id} className="vision-item">
                <h3>{politica.titulo}</h3>
                <p>{politica.contenido}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default PoliticasVisualizar;
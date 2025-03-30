import { useEffect, useState } from "react";
import '../style/visionesPublica.css';

const PreguntasVisualizar = () => {
    const [preguntas, setPreguntas] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:4000/api/preguntas") // Llamada al backend
        .then((response) => response.json())
        .then((data) => setPreguntas(data))
        .catch((error) => console.error("Error al obtener preguntas:", error));
    }, []);
  
    return (
      <div className="visiones-container">
        <h2 className="visiones-title">Preguntas Frecuentes</h2>
        {preguntas.length === 0 ? (
          <p>No hay preguntas disponibles</p>
        ) : (
          <ul className="visiones-list">
            {preguntas.map((pregunta) => (
              <li key={pregunta._id} className="vision-item">
                <h3>{pregunta.pregunta}</h3>
                <p>{pregunta.respuesta}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default PreguntasVisualizar;

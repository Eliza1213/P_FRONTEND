import { useEffect, useState } from "react";
import '../style/visionesPublica.css';


const TerminosVisualizar = () => {
  const [terminos, setTerminos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/terminos") // Llamada al backend
      .then((response) => response.json())
      .then((data) => setTerminos(data))
      .catch((error) => console.error("Error al obtener Términos:", error));
  }, []);

  return (
    <>
      <div className="visiones-container">
        <h2 className="visiones-title">Términos y Condiciones</h2>
        {terminos.length === 0 ? (
          <p>No hay Términos disponibles</p>
        ) : (
          <ul className="visiones-list">
            {terminos.map((termino) => (
              <li key={termino._id} className="vision-item">
                <h3>{termino.titulo}</h3>
                <p>{termino.descripcion}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default TerminosVisualizar;
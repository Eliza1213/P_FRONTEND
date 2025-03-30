import React, { useEffect } from "react";
import L from "leaflet"; // Importa Leaflet
import "leaflet/dist/leaflet.css"; // Importa el CSS de Leaflet

// Define un icono personalizado (marcador rojo)
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41], // Tamaño del icono
  iconAnchor: [12, 41], // Punto de anclaje del icono
  shadowSize: [41, 41], // Tamaño de la sombra
});

const LeafletMap = ({ lat, lng }) => {
  useEffect(() => {
    // Verifica que las coordenadas sean válidas
    if (lat && lng) {
      // Crea el mapa y lo centra en las coordenadas proporcionadas
      const map = L.map("map").setView([lat, lng], 15);

      // Agrega los tiles de OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Agrega un marcador rojo en la ubicación
      L.marker([lat, lng], { icon: redIcon }).addTo(map);

      // Limpia el mapa cuando el componente se desmonte
      return () => {
        map.remove();
      };
    }
  }, [lat, lng]); // Ejecuta el efecto cuando las coordenadas cambien

  return <div id="map" style={{ height: "200px", width: "100%" }}></div>;
};

export default LeafletMap;
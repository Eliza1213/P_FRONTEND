import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/VinculacionDispositivo.css';

const VinculacionDispositivo = () => {
  const [dispositivoId, setDispositivoId] = useState('');
  const [dispositivos, setDispositivos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Obtener dispositivos al cargar el componente
  useEffect(() => {
    obtenerDispositivosVinculados();
  }, []);

  const obtenerDispositivosVinculados = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mi-proyecto-virid.vercel.app/api/usuarios/dispositivos/mis-dispositivos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener dispositivos');
      }

      const data = await response.json();
      setDispositivos(data);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonText: 'Entendido'
      });
    } finally {
      setCargando(false);
    }
  };

  const handleVincularDispositivo = async () => {
    if (!dispositivoId.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor ingresa el ID del dispositivo',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://mi-proyecto-virid.vercel.app/api/usuarios/dispositivos/vincular', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dispositivoId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al vincular dispositivo');
      }

      Swal.fire({
        icon: 'success',
        title: '¡Vinculado!',
        text: 'Dispositivo vinculado correctamente',
        timer: 2000,
        showConfirmButton: false
      });

      setDispositivoId('');
      obtenerDispositivosVinculados();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonText: 'Entendido'
      });
    } finally {
      setCargando(false);
    }
  };

  const handleToggleEstado = async (dispositivo) => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://mi-proyecto-virid.vercel.app/api/usuarios/dispositivos/${dispositivo._id}/activar`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ activo: !dispositivo.activo })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar estado');
      }

      Swal.fire({
        icon: 'success',
        title: '¡Estado actualizado!',
        text: `Dispositivo ${!dispositivo.activo ? 'activado' : 'desactivado'}`,
        timer: 1500,
        showConfirmButton: false
      });

      obtenerDispositivosVinculados();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonText: 'Entendido'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="vinculacion-container">
      <h2>Vincular Nuevo Terrario</h2>
      
      <div className="vinculacion-form">
        <input
          type="text"
          value={dispositivoId}
          onChange={(e) => setDispositivoId(e.target.value)}
          placeholder="Ingresa el ID del terrario"
          disabled={cargando}
        />
        <button 
          onClick={handleVincularDispositivo}
          disabled={cargando || !dispositivoId.trim()}
        >
          {cargando ? 'Procesando...' : 'Vincular'}
        </button>
      </div>

      <div className="dispositivos-list">
        <h3>Tus Terrarios Vinculados</h3>
        
        {cargando && dispositivos.length === 0 ? (
          <p>Cargando dispositivos...</p>
        ) : dispositivos.length === 0 ? (
          <p>No tienes terrarios vinculados</p>
        ) : (
          <ul>
            {dispositivos.map((dispositivo) => (
              <li key={dispositivo._id}>
                <div className="dispositivo-info">
                  <span className="dispositivo-id">{dispositivo.dispositivo}</span>
                  <span className={`dispositivo-estado ${dispositivo.activo ? 'activo' : 'inactivo'}`}>
                    {dispositivo.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleEstado(dispositivo)}
                  className={`toggle-btn ${dispositivo.activo ? 'active' : ''}`}
                  disabled={cargando}
                >
                  {dispositivo.activo ? 'Desactivar' : 'Activar'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VinculacionDispositivo;
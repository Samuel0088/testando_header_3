import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const BusMap = () => {
  const [selectedLine, setSelectedLine] = useState('');
  const [status, setStatus] = useState('Selecione uma linha para iniciar.');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const busMarker = useRef(null);
  const routePolyline = useRef(null);
  const timerRef = useRef(null);
  const currentRoute = useRef(null);
  const currentIndex = useRef(0);

  const MAP_CENTER = [-22.7392, -47.3315];
  const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjQ3MGY4ZDdkNmVkMjQ3ODQ5MzU2ZTVjYWRhNjkwYTlmIiwiaCI6Im11cm11cjY0In0=';

  const lines = {
    "208": {
      label: "208 - Jd. da Paz → Zanaga",
      points: [
        [-22.708379324888575, -47.36492242103188],
        [-22.701881530567405, -47.2982575314699],
      ]
    },
    "220": {
      label: "220 - Mário Covas → Praia Recanto", 
      points: [
        [-22.705368396436704, -47.37174883064851],
        [-22.762028100917373, -47.3205743038377],
      ]
    },
    "119": {
      label: "119 - Pq. Liberdade → Praia dos Namorados",
      points: [
        [-22.715667, -47.355308],
        [-22.705820, -47.275467],
      ]
    },
    "108": {
      label: "108 - Bertini → Cariobinha → Terminal",
      points: [
        [-22.72388742058966, -47.29391465125763],
        [-22.729601510820363, -47.31863120811019], 
        [-22.736057867221675, -47.3290509625754],
      ]
    },
    "105": {
      label: "105 - Bertini → Jd. Alvorada",
      points: [
        [-22.72388742058966, -47.29391465125763],
        [-22.756400387998994, -47.306513210437046],
      ]
    },
    "213": {
      label: "213 - Jd. Balsa → Hosp. Municipal → Galpão",
      points: [
        [-22.702529479399345, -47.38129160315833],
        [-22.742875238510347, -47.309083320096796],
        [-22.75189490911659, -47.30085339238746],
      ]
    },
  };

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(MAP_CENTER, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      busMarker.current = L.marker(MAP_CENTER).addTo(mapInstance.current);
      busMarker.current.bindTooltip("Ônibus em movimento", { 
        permanent: false, 
        direction: "top" 
      });
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const getRealRoute = async (points, label) => {
    setLoading(true);
    setStatus('Calculando rota...');
    
    try {
      const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          'Authorization': ORS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coordinates: points.map(point => [point[1], point[0]]),
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      
      const routeCoords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      
      if (routePolyline.current) {
        mapInstance.current.removeLayer(routePolyline.current);
      }
      
      routePolyline.current = L.polyline(routeCoords, { 
        color: 'blue', 
        weight: 5,
        opacity: 0.7
      }).addTo(mapInstance.current);
      
      mapInstance.current.fitBounds(routePolyline.current.getBounds());
      
      currentRoute.current = routeCoords;
      startRun(routeCoords, label);
      
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      setStatus('Erro ao calcular rota. Usando rota simplificada.');
      
      if (routePolyline.current) {
        mapInstance.current.removeLayer(routePolyline.current);
      }
      
      routePolyline.current = L.polyline(points, { 
        color: 'red', 
        weight: 3,
        dashArray: '5, 10' 
      }).addTo(mapInstance.current);
      
      mapInstance.current.fitBounds(routePolyline.current.getBounds());
      currentRoute.current = points;
      startRun(points, label);
    }
    
    setLoading(false);
  };

  const handleLineChange = (e) => {
    const value = e.target.value;
    setSelectedLine(value);
    clearTimer();

    if (!value) {
      setStatus('Selecione uma linha para iniciar.');
      if (routePolyline.current) {
        mapInstance.current.removeLayer(routePolyline.current);
        routePolyline.current = null;
      }
      busMarker.current.setLatLng(MAP_CENTER);
      mapInstance.current.setView(MAP_CENTER, 13);
      return;
    }

    const { points, label } = lines[value];
    getRealRoute(points, label);
  };

  const startRun = (route, label) => {
    currentIndex.current = 0;
    busMarker.current.setLatLng(route[0]);
    setStatus(`Rodando: ${label} | Ponto 1 de ${route.length}`);

    timerRef.current = setInterval(() => {
      currentIndex.current++;
      
      if (currentIndex.current >= route.length) {
        clearTimer();
        busMarker.current.setLatLng(route[route.length - 1]);
        setStatus(`Chegou ao destino: ${label}`);
        return;
      }
      
      busMarker.current.setLatLng(route[currentIndex.current]);
      setStatus(`Rodando: ${label} | Ponto ${currentIndex.current + 1} de ${route.length}`);
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Linhas de Ônibus - Americana/SP
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <select 
          value={selectedLine}
          onChange={handleLineChange}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '5px',
            fontSize: '16px',
            opacity: loading ? 0.7 : 1
          }}
        >
          <option value="">-- Selecione a Linha --</option>
          <option value="208">208 - Jd. da Paz / Zanaga</option>
          <option value="220">220 - Mário Covas / Praia Recanto</option>
          <option value="119">119 - Pq. Liberdade / Praia dos Namorados</option>
          <option value="108">108 - Bertini / Cariobinha / Terminal</option>
          <option value="105">105 - Bertini / Jd. Alvorada</option>
          <option value="213">213 - Jd. Balsa / Hosp. Municipal / Galpão</option>
        </select>
      </div>

      <div style={{ 
        marginBottom: '15px', 
        fontSize: '14px', 
        color: loading ? '#666' : '#333',
        fontStyle: loading ? 'italic' : 'normal'
      }}>
        {loading ? 'Calculando rota...' : status}
      </div>

      <div 
        ref={mapRef} 
        style={{ 
          height: '500px', 
          width: '100%', 
          border: '2px solid #ddd',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default BusMap;
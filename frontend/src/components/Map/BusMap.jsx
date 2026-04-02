import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Create a custom icon for buses that supports rotation via inline styles
const createBusIcon = (heading, color) => {
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div class="marker-inner" style="transform: rotate(${heading}deg); background-color: ${color}; border-color: white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 2 9 20-9-5-9 5z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16], // center
    popupAnchor: [0, -18]
  });
};

const BusMap = ({ buses }) => {
  // Center roughly around NYC based on simulation coords
  const defaultCenter = [40.7306, -73.9866];
  
  // Store path trace history for polylines using refs
  const pathHistoryRef = useRef({});

  // Update path history whenever buses move
  useEffect(() => {
    buses.forEach(bus => {
      // Create new array to avoid mutating state incorrectly in render
      if (!pathHistoryRef.current[bus.id]) {
        pathHistoryRef.current[bus.id] = [];
      }
      
      const history = pathHistoryRef.current[bus.id];
      const lastPos = history[history.length - 1];
      
      // Avoid pushing duplicate positions due to rapid React renders
      if (!lastPos || lastPos[0] !== bus.location[0] || lastPos[1] !== bus.location[1]) {
        history.push([...bus.location]);
        if (history.length > 50) {
          history.shift();
        }
      }
    });
  }, [buses]);

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={13} 
      zoomControl={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {buses.map((bus) => {
        const color = bus.id === 'bus-1' ? '#3b82f6' : '#10b981';
        return (
          <div key={bus.id}>
            {/* Path history tail */}
            {pathHistoryRef.current[bus.id] && (
              <Polyline 
                positions={pathHistoryRef.current[bus.id]} 
                color={color} 
                weight={3}
                opacity={0.4}
              />
            )}
            
            {/* Live Marker */}
            <Marker 
              position={bus.location} 
              icon={createBusIcon(bus.heading, color)}
              zIndexOffset={1000}
            >
              <Popup>
                <strong>{bus.route}</strong>
              </Popup>
            </Marker>
          </div>
        );
      })}
    </MapContainer>
  );
};

export default BusMap;

import { useEffect, useState } from 'react';
import { socket } from './services/socket';
import BusMap from './components/Map/BusMap';
import { Bus, MapPin, Activity } from 'lucide-react';

function App() {
  const [buses, setBuses] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect socket on mount
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('locationUpdate', (busUpdate) => {
      setBuses((prev) => ({
        ...prev,
        [busUpdate.id]: busUpdate
      }));
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('locationUpdate');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="header">
          <h1>City Transit Live</h1>
          <p>Real-time fleet tracking system</p>
          <div className="status-badge">
            <div className="dot"></div>
            {isConnected ? 'LIVE' : 'CONNECTING...'}
          </div>
        </div>

        <div className="bus-list">
          {Object.values(buses).length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Waiting for fleet data...</p>
          )}
          {Object.values(buses).map((bus) => (
             <div key={bus.id} className="bus-card">
              <div className="bus-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bus size={18} color={bus.id === 'bus-1' ? '#60a5fa' : '#34d399'} />
                  <h3>Vehicle {bus.id.split('-')[1]}</h3>
                </div>
                <span className="route-badge" style={{ background: bus.id === 'bus-1' ? '' : 'rgba(16, 185, 129, 0.2)', color: bus.id === 'bus-1' ? '' : '#6ee7b7' }}>{bus.route}</span>
              </div>
              <div className="bus-details">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} />
                  <span>{bus.location[0].toFixed(5)}, {bus.location[1].toFixed(5)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={14} />
                  <span>Heading: {Math.round(bus.heading)}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="map-container">
         <BusMap buses={Object.values(buses)} />
      </div>
    </div>
  );
}

export default App;

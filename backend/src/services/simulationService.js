const routes = {
  "Route A": [
    // Real coordinates around NYC map
    [40.7128, -74.0060], [40.7206, -73.9966], [40.7380, -73.9855], [40.7549, -73.9840], [40.7614, -73.9776]
  ],
  "Route B": [
    [40.7028, -74.0160], [40.7106, -73.9966], [40.7280, -73.9755], [40.7349, -73.9740], [40.7414, -73.9676]
  ]
};

const state = {
  buses: [
    {
      id: "bus-1",
      route: "Route A",
      location: [...routes["Route A"][0]], // [lat, lng]
      lastWaypointIndex: 0,
      nextWaypointIndex: 1,
      speed: 0.05, // percentage of segment distance to move per tick
      heading: 0
    },
    {
      id: "bus-2",
      route: "Route B",
      location: [...routes["Route B"][0]],
      lastWaypointIndex: 0,
      nextWaypointIndex: 1,
      speed: 0.1,
      heading: 0
    }
  ],
  isRunning: true
};

const TICK_RATE_MS = 2000;

export const getSimulationState = () => state;

// Calculate bearing (rotation angle) from start to destination
function calculateBearing(startLat, startLng, destLat, destLng) {
  const startLatRad = startLat * Math.PI / 180;
  const startLngRad = startLng * Math.PI / 180;
  const destLatRad = destLat * Math.PI / 180;
  const destLngRad = destLng * Math.PI / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x = Math.cos(startLatRad) * Math.sin(destLatRad) -
            Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  const brng = Math.atan2(y, x);
  return (brng * 180 / Math.PI + 360) % 360;
}

export const startSimulation = (io) => {
  setInterval(() => {
    if (!state.isRunning) return;

    state.buses.forEach(bus => {
      const path = routes[bus.route];
      const startPoint = path[bus.lastWaypointIndex];
      const targetPoint = path[bus.nextWaypointIndex];

      const latTotalDiff = targetPoint[0] - startPoint[0];
      const lngTotalDiff = targetPoint[1] - startPoint[1];
      
      // Move bus by fixed fraction of segment distance
      bus.location[0] += latTotalDiff * bus.speed;
      bus.location[1] += lngTotalDiff * bus.speed;

      // Check if we reached or overstepped the target point.
      // Easiest heuristic: check distance to start point vs total segment distance
      const distStartToTarget = Math.sqrt(latTotalDiff**2 + lngTotalDiff**2);
      const currLatDiff = bus.location[0] - startPoint[0];
      const currLngDiff = bus.location[1] - startPoint[1];
      const distStartToCurr = Math.sqrt(currLatDiff**2 + currLngDiff**2);

      if (distStartToCurr >= distStartToTarget) {
        // Snap to target and set next segment
        bus.location = [...targetPoint];
        bus.lastWaypointIndex = bus.nextWaypointIndex;
        bus.nextWaypointIndex = (bus.nextWaypointIndex + 1) % path.length;
      }
      
      bus.heading = calculateBearing(bus.location[0], bus.location[1], targetPoint[0], targetPoint[1]);
      
      // Emit update efficiently to clients
      io.emit('locationUpdate', {
        id: bus.id,
        route: bus.route,
        location: bus.location,
        heading: bus.heading
      });
    });
  }, TICK_RATE_MS);
};

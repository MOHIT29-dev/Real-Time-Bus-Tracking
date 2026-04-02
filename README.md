Real-Time Bus Tracking Application
This plan outlines the design and architecture for building a real-time bus tracking application featuring a React frontend and a Node.js/Express/Socket.io backend. The application will track the real-time location of buses on an interactive map.

Proposed Architecture
We will have a monorepo-style setup with separate folders for frontend and backend inside d:\Tracking.

Backend (/backend)
A Node.js server using Express for REST endpoints and Socket.io for Real-Time bidirectional communication.

Modularity: Clean separation of concerns with controllers, services, and routes.
Simulation Service: A service to simulate the periodic movement of buses (generating coordinates) and emitting them to all connected clients.
WebSocket Gateway: Handles incoming connections, assigns clients to rooms, and broadcasts updates efficiently.
Frontend (/frontend)
React.js (Vite) application emphasizing real-time interactivity.

Map Library: We will use Leaflet.js (via react-leaflet). Why? It is open-source, mobile-friendly, and requires no API key out-of-the-box (unlike Google Maps), allowing us to get a production-ready feature running immediately.
WebSocket Client: socket.io-client listening to locationUpdate events.
State Updates: We will use React useEffect for subscribing/unsubscribing to socket events and managing component unmount cleanups safely to prevent memory leaks and redundant renders.
Styling: Vanilla CSS focusing on a modern, dark-mode, minimal typography style with glassmorphic accents, per best aesthetics practices.
Proposed Changes
Backend Setup
[NEW] d:\Tracking\backend\package.json
[NEW] d:\Tracking\backend\server.js
Entry point initializing Express and Socket.io server.

[NEW] d:\Tracking\backend\src\routes\busRoutes.js
REST API to control the simulation (start/stop) or fetch initial static data.

[NEW] d:\Tracking\backend\src\controllers\busController.js
Controller logic mapping to predefined routes.

[NEW] d:\Tracking\backend\src\services\simulationService.js
Logic to calculate bus heading, smooth GPS coordinate progression, and pushing events.

[NEW] d:\Tracking\backend\src\sockets\socketHandler.js
Contains Socket.io event listeners and emissary functions.

Frontend Setup
[NEW] d:\Tracking\frontend\package.json
[NEW] d:\Tracking\frontend\src\App.jsx
Main view coordinating the map and the sidebar.

[NEW] d:\Tracking\frontend\src\components\Map\BusMap.jsx
The Leaflet map component rendering polylines (history) and dynamic markers. Marker rotation will be implemented using CSS rotation dynamically updated through React state.

[NEW] d:\Tracking\frontend\src\services\socket.js
Singleton pattern socket client.

[NEW] d:\Tracking\frontend\src\styles\index.css
Extensive Vanilla CSS implementing modern, rich aesthetic UI.

TIP

WebSockets over HTTP Polling: We use WebSockets because HTTP polling introduces significant overhead (headers, handshake latency) for every ping. A steady WebSocket connection maintains a single open TCP pipe allowing sub-millisecond data delivery, which is non-negotiable for smooth real-time animation.

TIP

Scalability Handling: The backend simulation service handles calculations and pushes events to Socket.io. For production scalability, we can attach a Redis adapter (@socket.io/redis-adapter) to scale horizontally across multiple Node.js instances if the track/client volume surges.

Open Questions
IMPORTANT

Database: You mentioned MongoDB is optional but preferred. Since the current core requirement is highly focused on real-time live map tracking simulation, setting up MongoDB might slow down the immediate validation of the real-time core mechanics (as live coordinates flow directly from the simulation logic). Would you like me to:

Start solely with an In-Memory Simulation Service that drives the initial MVP, then we add actual data persistence (MongoDB setup rules, Mongoose schemas) later?
Build the MongoDB logic now (saving coordinates over time and loading initial state)? If yes, ensure you have a MongoDB cluster URI ready.
IMPORTANT

Multiple Buses: I plan to build this with multi-bus capability from the start (e.g. tracking "Route A" and "Route B"). Is that acceptable?

Verification Plan
Automated/Manual Verification
Both servers will be launched locally (npm run dev for Vite, node server.js for Express).
I will open the application in the browser.
We expect to see multiple bus markers traversing predetermined paths.
Smooth CSS transitions should happen as the location changes.
Emitted websocket updates will be verified via backend logs and frontend rendering.

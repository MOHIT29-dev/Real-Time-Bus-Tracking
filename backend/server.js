import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import busRoutes from './src/routes/busRoutes.js';
import { initializeSockets } from './src/sockets/socketHandler.js';
import { startSimulation, getSimulationState } from './src/services/simulationService.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Better to restrict in production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Bind the io instance and simulation state to the request object so controllers can use it
app.use((req, res, next) => {
  req.io = io;
  req.getSimulationState = getSimulationState;
  next();
});

// Routes
app.use('/api/buses', busRoutes);

// Socket Initialization
initializeSockets(io);

// Start the real-time simulation, passing the io instance to broadcast updates
startSimulation(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

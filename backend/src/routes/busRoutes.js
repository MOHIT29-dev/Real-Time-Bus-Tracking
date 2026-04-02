import express from 'express';
import { getBuses, controlSimulation } from '../controllers/busController.js';

const router = express.Router();

// GET /api/buses - Fetch the last known location of all simulated buses
router.get('/', getBuses);

// POST /api/buses/control - Start or stop the simulation
router.post('/control', controlSimulation);

export default router;

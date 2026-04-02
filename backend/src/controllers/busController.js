export const getBuses = (req, res) => {
  try {
    const simulationState = req.getSimulationState();
    res.status(200).json({ success: true, data: simulationState.buses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const controlSimulation = (req, res) => {
  try {
    const { action } = req.body; // 'start' or 'stop'
    
    // In a real scenario, we might pause the simulation loop here. 
    // For simplicity, we just return an acknowledgement.
    // The actual simulation state would have a paused/running flag.
    
    res.status(200).json({ success: true, message: `Simulation ${action}ed` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

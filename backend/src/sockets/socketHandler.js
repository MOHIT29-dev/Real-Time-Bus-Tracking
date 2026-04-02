export const initializeSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client Connected: ${socket.id}`);

    // Client can connect and listen to all buses by default, or we could join a specific room
    socket.on('joinBusTrack', (busId) => {
      socket.join(busId);
      console.log(`Client ${socket.id} joined tracking for bus ${busId}`);
    });

    socket.on('leaveBusTrack', (busId) => {
      socket.leave(busId);
      console.log(`Client ${socket.id} stopped tracking bus ${busId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client Disconnected: ${socket.id}`);
    });
  });
};

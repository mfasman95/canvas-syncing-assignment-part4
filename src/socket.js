const socketio = require('socket.io');

let io;
let savedImage;

const emitToAll = (eventName, data) => io.sockets.emit('serverMsg', { eventName, data });
const emitToSocket = socket => (eventName, data) => socket.emit('serverMsg', { eventName, data });

const setMostRecentImage = (image) => {
  savedImage = image;
  emitToAll('image', savedImage);
};

const socketHandlers = Object.freeze({
  imageUpload: data => setMostRecentImage(data),
});

const onDisconnect = (sock) => {
  const socket = sock;
  console.log(`Socket ${socket.id} has disconnected...`);
};

const onConnect = (sock) => {
  const socket = sock;
  console.log(`Socket ${socket.id} has connected...`);

  if (savedImage) emitToSocket(socket)('image', savedImage);
};

module.exports = Object.freeze({
  init: (server) => {
    io = socketio(server);
    io.sockets.on('connection', (socket) => {
      onConnect(socket);
      socket.on('clientMsg', (data) => {
        if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);
        return console.warn(`Missing event handler for ${data.eventName}`);
      });
      socket.on('disconnect', () => onDisconnect(socket));
    });
  },
});

// Disabling full file because linter is not required on client side
/* eslint-disable */
'use strict';

let connected = false;

const socketHandlers = Object.freeze({
  image: (data) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = data;
  },
});

const emitter = (eventName, data) => socket.emit('clientMsg', { eventName, data });

window.onload = () => {
  window.canvas = document.querySelector('#canvas');
  window.ctx = canvas.getContext('2d');
  window.uploadImage = document.querySelector('#uploadImage');

  window.socket = io.connect();
  
  socket.on('connect', () => {
    connected = true;
    console.log('Connected to server...');
  });
  socket.on('disconnect', () => {
    connected = false;
    console.log('Disconnected from server...');
  })
  socket.on('serverMsg', (data) => {
     if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);
     else console.warn(`Missing event handler for ${data.eventName}`);
  });

  uploadImage.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = event => emitter('imageUpload', event.target.result);
    reader.readAsDataURL(e.target.files[0]);
  });
};

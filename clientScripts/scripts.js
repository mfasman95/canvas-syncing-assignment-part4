// Disabling full file because linter is not required on client side
/* eslint-disable */
'use strict';

let connected = false;
const targetImageWidth = 200;

const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

const socketHandlers = Object.freeze({
  image: (data) => {
    clearCanvas();
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, 0, 0, canvas.width, canvas.height) };
    img.src = data;
  },
  clearCanvas,
});

const emitter = (eventName, data) => socket.emit('clientMsg', { eventName, data });

const randomPosition = () => Math.floor(Math.random() * canvas.width);

window.onload = () => {
  window.canvas = document.querySelector('#canvas');
  window.ctx = canvas.getContext('2d');
  window.uploadImage = document.querySelector('#uploadImage');
  window.clearButton = document.querySelector('#clearCanvas');

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
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        console.log(img.width, img.height);
        const ratio = img.width / targetImageWidth;
        ctx.drawImage(img, randomPosition(), randomPosition(), targetImageWidth, img.height / ratio);
        emitter('imageUpload', canvas.toDataURL());
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  });

  clearButton.addEventListener('click', () => emitter('clearCanvas'));
};

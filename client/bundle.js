// Disabling full file because linter is not required on client side
/* eslint-disable */
'use strict';

var connected = false;

var socketHandlers = Object.freeze({
  image: function image(data) {
    var img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = data;
  }
});

var emitter = function emitter(eventName, data) {
  return socket.emit('clientMsg', { eventName: eventName, data: data });
};

window.onload = function () {
  window.canvas = document.querySelector('#canvas');
  window.ctx = canvas.getContext('2d');
  window.uploadImage = document.querySelector('#uploadImage');

  window.socket = io.connect();

  socket.on('connect', function () {
    connected = true;
    console.log('Connected to server...');
  });
  socket.on('disconnect', function () {
    connected = false;
    console.log('Disconnected from server...');
  });
  socket.on('serverMsg', function (data) {
    if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);else console.warn('Missing event handler for ' + data.eventName);
  });

  uploadImage.addEventListener('change', function (e) {
    var reader = new FileReader();
    reader.onload = function (event) {
      return emitter('imageUpload', event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  });
};

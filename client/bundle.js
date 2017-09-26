// Disabling full file because linter is not required on client side
/* eslint-disable */
'use strict';

var connected = false;
var targetImageWidth = 200;

var clearCanvas = function clearCanvas() {
  return ctx.clearRect(0, 0, canvas.width, canvas.height);
};

var socketHandlers = Object.freeze({
  image: function image(data) {
    clearCanvas();
    var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = data;
  },
  clearCanvas: clearCanvas
});

var emitter = function emitter(eventName, data) {
  return socket.emit('clientMsg', { eventName: eventName, data: data });
};

var randomPosition = function randomPosition() {
  return Math.floor(Math.random() * canvas.width);
};

window.onload = function () {
  window.canvas = document.querySelector('#canvas');
  window.ctx = canvas.getContext('2d');
  window.uploadImage = document.querySelector('#uploadImage');
  window.clearButton = document.querySelector('#clearCanvas');

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
      var img = new Image();
      img.onload = function () {
        console.log(img.width, img.height);
        var ratio = img.width / targetImageWidth;
        ctx.drawImage(img, randomPosition(), randomPosition(), targetImageWidth, img.height / ratio);
        emitter('imageUpload', canvas.toDataURL());
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  });

  clearButton.addEventListener('click', function () {
    return emitter('clearCanvas');
  });
};

// Server side
var io = require('socket.io').listen(3000);

io.sockets.on('connection', function (socket) {
  console.log('connect count :' + count);
  //console.log('connected');
  // Broadcast
  socket.on('video', function (data) {
    socket.broadcast.emit('video', data);
  });
});


/*
var maxConnect = 2;

var io = require('socket.io').listen(3000);

for(var i = 0; i < maxConnect; i++) {
  io.sockets.on('connection', function (socket) {
    console.log('connected');
    // Broadcast
    socket.on('video', function (data) {
      socket.broadcast.emit('video', data);
    });
  });

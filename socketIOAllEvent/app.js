// Server
var io = require('socket.io').listen(3000);

io.sockets.on('connection', function (socket) {
  console.log('connected');
  socket.emit('msg push', 'data');
  socket.on('msg send', function (msg) {
    console.log(msg);
  });
});
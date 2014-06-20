// http関連の機能追加
var http = require("http");
// ソケット通信の機能追加
var socketio = require("socket.io");
// ファイルの読み書き
var fs = require("fs");

/*-- Webサーバーを立ち上げる --*/
var server = http.createServer(function(req, res) {
  // 起動後にhttpヘッダに書き込む内容
  res.writeHead(200, {"Content-Type":"text/html"});
  // index.htmlを読み込む
  var output = fs.readFileSync("./index.html", "utf-8");
  // index.htmlを表示
  res.end(output);
}).listen(process.env.VMC_APP_PORT || 3000); // webサーバーで利用するポートを自動選択(リモート or ローカル)

/*-- Socket通信 --*/
// サーバとソケットのヒモ付
var io = socketio.listen(server);

// サーバーとソケットの紐付け
io.sockets.on('connection', function (socket) {
  console.log('connected');
  // ブロードキャストする
  socket.on('video', function(data) {
    // ブロードキャストする
    socket.broadcast.emit('video', data);
  });
});
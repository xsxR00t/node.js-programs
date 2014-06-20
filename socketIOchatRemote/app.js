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
// クライアントからのアクションを受け付ける窓口
io.sockets.on("connection", function(socket) {
  // クライアントからアクションがあったときにサーバが受け取る関数
  // これでクライアントを特定したり、個別にメッセージを送ったりできる
  
  /* メッセージ送信（送信者にも送られる） */
  socket.on("C_to_S_message", function(data) {
    // 自分を含む全員にメッセージ送信
    io.sockets.emit("S_to_C_message", { value : data.value });
  });

  /* ブロードキャスト(送信者以外の全員に送信) */
  socket.on("C_to_S_broadcast", function(data) {
    // 自分以外の全員にメッセージを送信
    socket.broadcast.emit("S_to_C_message", { value : data.value });
  });

  /* 切断時送信する */
  socket.on("disconnect", function() {

  });
});
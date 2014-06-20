// Use Server Name or IP
var serverName = "192.168.11.5";
// Use Server Port
var serverPort = "3000";
// サーバーと socket を利用して接続
var socket = io.connect('http://' + serverName + ':' + serverPort + '/');

$(function() {
  // 実際にはない仮の video タグ
  var video   = $('#webcam-movie')[0];
  // 自分自身が表示される canvas タグ
  var canvas  = $('#webcam-image')[0];
  // 相手が表示される img タグ
  var others  = $('#others-movie')[0];
  
  var context = canvas.getContext('2d');

  // カメラ表示FPS
  var FPS = 30;
  // WebRTC の利用部分
  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia || // chrome
                           navigator.mozGetUserMedia ||    // Mozilla
                           navigator.msGetUserMedia;       //IE(現在はない)

  navigator.getUserMedia(
    { video: true },
    function(stream)
    {
      // video タグにカメラ画を流し込む
      video.src = window.URL.createObjectURL(stream);
      video.play();
      setInterval( function()
      {
        // 定期的に Canvas へ video タグの画像を書き出す
        context.drawImage(video, 0, 0, 320, 240);
        // toDataURL で Base64 エンコードして文字列にする
        var data = canvas.toDataURL('image/jpeg', 0.5);
        // 文字列をサーバに WebSocket で送る
        socket.emit('video', data);
      }, 1000 / FPS);
    },
    function(error)
    {
      console.error(error.code, 'connection failed');
    }
  );

  // サーバからのビデオ画を受ける
  socket.on('video', function(data)
  {
    // サーバから送られてきた Base64 エンコードされた文字列を img タグの src　に渡す
    if (typeof(data) === 'string') others.src = data;
  });
});
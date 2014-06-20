//var socket = io.connect('http://localhost:3000');
var socket = io.connect();

$(function() {
  var video   = $('#webcam-movie')[0];
  var canvas  = $('#webcam-image')[0];
  var others  = $('#others-movie')[0];

  var context = canvas.getContext('2d');

  // ビデオ画をサーバに送る
  var FPS = 30;
  navigator.getUserMedia = navigator.getUserMedia       ||
                           navigator.webkitGetUserMedia ||  // chrome?
                           navigator.mozGetUserMedia    ||  // Mozillaのゲットメディア
                           navigator.msGetUserMedia;        // IEのゲットメディア．現在はない

  navigator.getUserMedia(
    { video: true },
    function(stream) {
      // video タグにカメラ画を流し込む
      video.src = window.URL.createObjectURL(stream);
      video.play();
      // 定期的に Canvas へ video タグの画像を書き出し、
      // それを toDataURL で Base64 エンコードして文字列にし、
      // その文字列をサーバに WebSocket で送る
      setInterval( function() {
        context.drawImage(video, 0, 0, 320, 240);
        var data = canvas.toDataURL('image/jpeg', 0.5);
        socket.emit('video', data);
      }, 1000 / FPS);
    },
    function(error) {
      console.error(error.code, 'connection failed');
    }
  );

  // サーバからのビデオ画を受ける
  socket.on('video', function(data) {
    // サーバから送られてきた Base64 エンコードされた文字列を
    // そのまま img タグの src に流し込む
    if (typeof(data) === 'string') others.src = data;
  });
});
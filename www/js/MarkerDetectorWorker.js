
importScripts('../lib/ArtMobilib/ArtMobilib/aruco/cv.js');
importScripts('../lib/ArtMobilib/ArtMobilib/aruco/aruco.js');
importScripts('../lib/ArtMobilib/ArtMobilib/aruco/svd.js');
importScripts('../lib/ArtMobilib/ArtMobilib/aruco/posit1.js');


var _is_available = true;

var _buffer;
var _width;
var _height;
var _detector = new AR.Detector();


onmessage = function(e) {
  console.log(typeof(e.data));

  var msg = e.data.msg;

  switch (msg) {
    case 'new_img':
      _buffer = e.data.buffer;
      _width = e.data.width;
      _height = e.data.height;
    break;
  }
}


(function loop() {
  if (_buffer) {
    var image = new ImageData(_width, _height);
    var size = _width * _height * 4;

    for (i = 0; i < size; ++i) {
      image.data[i] = _buffer[i];
    }


    var markers = detector.detect(image);

    var msg = {
      msg: 'markers',
      markers: markers
    };

    postMessage(msg);


    _buffer = undefined;
  }

  window.requestAnimationFrame(loop);
})();
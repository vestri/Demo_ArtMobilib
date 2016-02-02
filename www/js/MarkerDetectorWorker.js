window = self;

// aruco
importScripts('../lib/ArtMobilib/ArtMobilib/aruco/cv.js');
importScripts('../lib/ArtMobilib/ArtMobilib/aruco/aruco.js');
importScripts('../lib/ArtMobilib/ArtMobilib/aruco/svd.js');
importScripts('../lib/ArtMobilib/ArtMobilib/aruco/posit1.js');

// jsfeat
// importScripts('../lib/ArtMobilib/ArtMobilib/jsfeat/jsfeat.js');
// importScripts('../lib/ArtMobilib/ArtMobilib/jsfeat/compatibility.js');
// importScripts('../lib/ArtMobilib/ArtMobilib/jsfeat/profiler.js');

// ArtMobilib
// importScripts('../lib/ArtMobilib/ArtMobilib/CornerDetector.js');
// importScripts('../lib/ArtMobilib/ArtMobilib/ImageMarkers.js');
// importScripts('../lib/ArtMobilib/ArtMobilib/MarkerContainer.js');
// importScripts('../lib/ArtMobilib/ArtMobilib/MarkerMatcher.js');
// importScripts('../lib/ArtMobilib/ArtMobilib/webcamConverter.js');
// importScripts('../lib/ArtMobilib/ArtMobilib/MarkerManager.js');



var _detector = new AR.Detector();


function DetectMarkers(image, frame) {
  if (image) {

    var markers = _detector.detect(image);

    var msg = {
      cmd: 'markers',
      markers: markers,
      frame: frame
    };

    postMessage(msg);
  }
}

function AddMarker() {

}


onmessage = function(e) {
  var cmd = e.data.cmd;

  switch (cmd) {
    case 'new_img':
      DetectMarkers(e.data.image, e.data.frame);
    break;
    case 'add_marker':
    break;
  }
};